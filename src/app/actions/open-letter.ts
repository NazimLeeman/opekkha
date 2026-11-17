"use server";

import {
  isLetterOpenable,
  type EnvelopeView,
} from "@/lib/letters/opening";
import { hashAccessToken } from "@/lib/letters/tokens";
import { trackEvent } from "@/lib/monitoring/events";
import {
  createAdminClient,
  isAdminConfigured,
} from "@/lib/supabase/admin";

export type OpenActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type RevealedLetter = {
  title: string;
  prompt: string | null;
  body: string;
  senderLabel: string | null;
  recipientName: string | null;
  opensAt: string | null;
  openedAt: string;
};

type TokenRow = {
  id: string;
  letter_id: string;
  revoked_at: string | null;
  expires_at: string | null;
};

type LetterRow = {
  id: string;
  title: string;
  prompt: string | null;
  body: string;
  status: string;
  opens_at: string | null;
  sender_label: string | null;
  recipient_name: string | null;
  sender_timezone: string;
  deleted_at: string | null;
};

async function loadTokenLetter(rawToken: string) {
  if (!isAdminConfigured()) {
    throw new Error(
      "Server is missing SUPABASE_SERVICE_ROLE_KEY for private-link opens",
    );
  }

  const admin = createAdminClient();
  const tokenHash = hashAccessToken(rawToken);

  const { data: token, error: tokenError } = await admin
    .from("letter_access_tokens")
    .select("id, letter_id, revoked_at, expires_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (tokenError) throw new Error(tokenError.message);
  if (!token) throw new Error("Invitation not found");

  const tokenRow = token as TokenRow;
  if (tokenRow.revoked_at) throw new Error("This invitation was revoked");
  if (
    tokenRow.expires_at &&
    new Date(tokenRow.expires_at).getTime() < Date.now()
  ) {
    throw new Error("This invitation has expired");
  }

  const { data: letter, error: letterError } = await admin
    .from("letters")
    .select(
      "id, title, prompt, body, status, opens_at, sender_label, recipient_name, sender_timezone, deleted_at",
    )
    .eq("id", tokenRow.letter_id)
    .maybeSingle();

  if (letterError) throw new Error(letterError.message);
  if (!letter || (letter as LetterRow).deleted_at) {
    throw new Error("Letter not found");
  }

  return { token: tokenRow, letter: letter as LetterRow, admin };
}

/** Public envelope — never returns body. */
export async function getEnvelope(
  rawToken: string,
): Promise<OpenActionResult<EnvelopeView>> {
  try {
    const { letter } = await loadTokenLetter(rawToken);
    const openable = isLetterOpenable({
      status: letter.status,
      opensAt: letter.opens_at,
    });

    return {
      ok: true,
      data: {
        letterId: letter.id,
        title: letter.title,
        prompt: letter.prompt,
        senderLabel: letter.sender_label,
        opensAt: letter.opens_at,
        status: letter.status,
        openable,
        timezone: letter.sender_timezone,
      },
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not open invitation",
    };
  }
}

/** Reveal body only after server-side eligibility check. Records opening once. */
export async function revealLetter(
  rawToken: string,
): Promise<OpenActionResult<RevealedLetter>> {
  try {
    const { letter, admin } = await loadTokenLetter(rawToken);
    const openable = isLetterOpenable({
      status: letter.status,
      opensAt: letter.opens_at,
    });

    if (!openable) {
      return {
        ok: false,
        error: "This letter is not available to open yet",
      };
    }

    const openedAt = new Date().toISOString();

    if (letter.status !== "opened") {
      await admin
        .from("letters")
        .update({ status: "opened", opened_at: openedAt })
        .eq("id", letter.id)
        .in("status", ["available", "scheduled"]);

      // If scheduled but time passed, promote then mark opened
      if (letter.status === "scheduled") {
        await admin
          .from("letters")
          .update({ status: "opened", opened_at: openedAt })
          .eq("id", letter.id);
      }

      await admin.from("letter_events").insert({
        letter_id: letter.id,
        event_type: "opened",
        metadata: {},
      });

      trackEvent("letter_revealed", { firstOpen: true });
    }

    return {
      ok: true,
      data: {
        title: letter.title,
        prompt: letter.prompt,
        body: letter.body,
        senderLabel: letter.sender_label,
        recipientName: letter.recipient_name,
        opensAt: letter.opens_at,
        openedAt: letter.status === "opened" ? openedAt : openedAt,
      },
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not reveal letter",
    };
  }
}
