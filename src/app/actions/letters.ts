"use server";

import { revalidatePath } from "next/cache";
import { assertRateLimit } from "@/lib/abuse/rate-limit";
import { requireUser } from "@/lib/auth/session";
import { enqueueLetterAvailableJob } from "@/lib/jobs/notifications";
import { trackEvent } from "@/lib/monitoring/events";
import { computeOpening } from "@/lib/letters/opening";
import {
  draftLetterSchema,
  scheduleLetterSchema,
} from "@/lib/letters/schemas";
import { generateAccessToken, hashAccessToken } from "@/lib/letters/tokens";
import { isAdminConfigured } from "@/lib/supabase/admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Letter } from "@/types/database";

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function ensureDb(): ActionResult {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error:
        "Supabase is not configured. Add credentials to .env.local and run the migration.",
    };
  }
  return { ok: true, data: undefined };
}

export async function createDraftLetter(
  raw: unknown,
): Promise<ActionResult<{ id: string }>> {
  const ready = ensureDb();
  if (!ready.ok) return ready;

  try {
    const user = await requireUser();
    const parsed = draftLetterSchema.parse(raw);
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("letters")
      .insert({
        sender_id: user.id,
        title: parsed.title,
        prompt: parsed.prompt ?? null,
        body: parsed.body,
        recipient_name: parsed.recipientName ?? null,
        sender_label: parsed.senderLabel ?? null,
        theme_id: parsed.themeId ?? null,
        allow_acknowledgement: parsed.allowAcknowledgement ?? false,
        status: "draft",
        opening_rule: "immediate",
      })
      .select("id")
      .single();

    if (error) return { ok: false, error: error.message };

    revalidatePath("/dashboard");
    return { ok: true, data: { id: data.id as string } };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not create draft",
    };
  }
}

export async function updateDraftLetter(
  id: string,
  raw: unknown,
): Promise<ActionResult<{ id: string }>> {
  const ready = ensureDb();
  if (!ready.ok) return ready;

  try {
    const user = await requireUser();
    const parsed = draftLetterSchema.parse(raw);
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("letters")
      .update({
        title: parsed.title,
        prompt: parsed.prompt ?? null,
        body: parsed.body,
        recipient_name: parsed.recipientName ?? null,
        sender_label: parsed.senderLabel ?? null,
        theme_id: parsed.themeId ?? null,
        allow_acknowledgement: parsed.allowAcknowledgement ?? false,
      })
      .eq("id", id)
      .eq("sender_id", user.id)
      .eq("status", "draft")
      .select("id")
      .single();

    if (error) return { ok: false, error: error.message };

    revalidatePath("/dashboard");
    revalidatePath(`/letters/${id}/edit`);
    return { ok: true, data: { id: data.id as string } };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not update draft",
    };
  }
}

export async function scheduleOrSendLetter(
  id: string,
  raw: unknown,
): Promise<ActionResult<{ id: string; inviteUrl?: string }>> {
  const ready = ensureDb();
  if (!ready.ok) return ready;

  try {
    const user = await requireUser();
    const limited = await assertRateLimit({
      userId: user.id,
      action: "send_letter",
      limit: 30,
      windowMinutes: 60,
    });
    if (!limited.ok) return limited;

    const parsed = scheduleLetterSchema.parse(raw);
    const opening = computeOpening({
      openingRule: parsed.openingRule,
      opensAtLocal: parsed.opensAtLocal,
      intervalDays: parsed.intervalDays,
      timezone: parsed.senderTimezone,
    });

    const supabase = await createClient();

    const { error: updateError } = await supabase
      .from("letters")
      .update({
        title: parsed.title,
        prompt: parsed.prompt ?? null,
        body: parsed.body,
        recipient_name: parsed.recipientName ?? null,
        sender_label: parsed.senderLabel ?? null,
        theme_id: parsed.themeId ?? null,
        allow_acknowledgement: parsed.allowAcknowledgement ?? false,
        opening_rule: opening.openingRule,
        opens_at: opening.opensAt,
        sender_timezone: parsed.senderTimezone,
        status: opening.status,
        access_mode: "private_link",
      })
      .eq("id", id)
      .eq("sender_id", user.id)
      .in("status", ["draft", "scheduled"]);

    if (updateError) return { ok: false, error: updateError.message };

    const rawToken = generateAccessToken();
    const tokenHash = hashAccessToken(rawToken);

    // Revoke previous tokens for this letter
    await supabase
      .from("letter_access_tokens")
      .update({ revoked_at: new Date().toISOString() })
      .eq("letter_id", id)
      .is("revoked_at", null);

    const { error: tokenError } = await supabase
      .from("letter_access_tokens")
      .insert({
        letter_id: id,
        token_hash: tokenHash,
      });

    if (tokenError) return { ok: false, error: tokenError.message };

    await supabase.from("letter_events").insert({
      letter_id: id,
      actor_id: user.id,
      event_type: opening.status === "available" ? "invited" : "scheduled",
      metadata: { opening_rule: opening.openingRule },
    });

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
      "http://localhost:3000";
    const inviteUrl = `${appUrl}/open/${rawToken}`;

    if (opening.opensAt && isAdminConfigured()) {
      try {
        await enqueueLetterAvailableJob({
          letterId: id,
          recipientId: null,
          scheduledFor: opening.opensAt,
          actorId: user.id,
          inviteUrl,
          recipientName: parsed.recipientName ?? null,
        });
      } catch {
        // Non-fatal: invite still works; jobs can be retried by cron.
      }
    }

    trackEvent("letter_sent", {
      openingRule: opening.openingRule,
      status: opening.status,
    });

    revalidatePath("/dashboard");
    revalidatePath(`/letters/${id}/edit`);

    return { ok: true, data: { id, inviteUrl } };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not send letter",
    };
  }
}

export async function getOwnLetter(
  id: string,
): Promise<ActionResult<Letter>> {
  const ready = ensureDb();
  if (!ready.ok) return ready;

  try {
    const user = await requireUser();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("letters")
      .select("*")
      .eq("id", id)
      .eq("sender_id", user.id)
      .is("deleted_at", null)
      .single();

    if (error) return { ok: false, error: error.message };
    return { ok: true, data: data as Letter };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not load letter",
    };
  }
}

export async function listOwnLetters(): Promise<ActionResult<Letter[]>> {
  const ready = ensureDb();
  if (!ready.ok) return ready;

  try {
    const user = await requireUser();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("letters")
      .select("*")
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .is("deleted_at", null)
      .order("updated_at", { ascending: false });

    if (error) return { ok: false, error: error.message };
    return { ok: true, data: (data ?? []) as Letter[] };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not list letters",
    };
  }
}

export async function deleteDraftLetter(
  id: string,
): Promise<ActionResult> {
  const ready = ensureDb();
  if (!ready.ok) return ready;

  try {
    const user = await requireUser();
    const supabase = await createClient();
    const { error } = await supabase
      .from("letters")
      .update({ deleted_at: new Date().toISOString(), status: "revoked" })
      .eq("id", id)
      .eq("sender_id", user.id);

    if (error) return { ok: false, error: error.message };
    revalidatePath("/dashboard");
    return { ok: true, data: undefined };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not delete letter",
    };
  }
}

/** Revoke all active invite links and mark the letter revoked. */
export async function revokeLetterAccess(
  id: string,
): Promise<ActionResult> {
  const ready = ensureDb();
  if (!ready.ok) return ready;

  try {
    const user = await requireUser();
    const supabase = await createClient();
    const now = new Date().toISOString();

    const { error: tokenError } = await supabase
      .from("letter_access_tokens")
      .update({ revoked_at: now })
      .eq("letter_id", id)
      .is("revoked_at", null);

    if (tokenError) return { ok: false, error: tokenError.message };

    const { error: letterError } = await supabase
      .from("letters")
      .update({ status: "revoked" })
      .eq("id", id)
      .eq("sender_id", user.id)
      .in("status", ["scheduled", "available", "opened"]);

    if (letterError) return { ok: false, error: letterError.message };

    await supabase.from("letter_events").insert({
      letter_id: id,
      actor_id: user.id,
      event_type: "revoked",
      metadata: {},
    });

    revalidatePath("/dashboard");
    revalidatePath(`/letters/${id}/edit`);
    return { ok: true, data: undefined };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not revoke link",
    };
  }
}
