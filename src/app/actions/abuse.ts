"use server";

import { revalidatePath } from "next/cache";
import { assertRateLimit } from "@/lib/abuse/rate-limit";
import { requireUser } from "@/lib/auth/session";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function reportLetter(args: {
  letterId: string;
  reason: string;
  details?: string;
}): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured" };
  }

  const reason = args.reason.trim();
  if (reason.length < 3 || reason.length > 200) {
    return { ok: false, error: "Please provide a short reason" };
  }

  try {
    const user = await requireUser();
    const limited = await assertRateLimit({
      userId: user.id,
      action: "report",
      limit: 8,
      windowMinutes: 60,
    });
    if (!limited.ok) return limited;

    const supabase = await createClient();
    const { data: letter } = await supabase
      .from("letters")
      .select("id, sender_id")
      .eq("id", args.letterId)
      .maybeSingle();

    const { error } = await supabase.from("reports").insert({
      reporter_id: user.id,
      letter_id: args.letterId,
      reported_user_id: letter?.sender_id ?? null,
      reason,
      details: args.details?.trim() || null,
      status: "open",
    });

    if (error) return { ok: false, error: error.message };
    return { ok: true, data: undefined };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not submit report",
    };
  }
}

/** Anonymous / token-path report when user may not be signed in — uses optional session. */
export async function reportLetterByToken(args: {
  letterId: string;
  reason: string;
  details?: string;
}): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured" };
  }

  const reason = args.reason.trim();
  if (reason.length < 3 || reason.length > 200) {
    return { ok: false, error: "Please provide a short reason" };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const limited = await assertRateLimit({
        userId: user.id,
        action: "report",
        limit: 8,
        windowMinutes: 60,
      });
      if (!limited.ok) return limited;
    }

    const { error } = await supabase.from("reports").insert({
      reporter_id: user?.id ?? null,
      letter_id: args.letterId,
      reported_user_id: null,
      reason,
      details: args.details?.trim() || null,
      status: "open",
    });

    // RLS requires reporter_id = auth.uid() — so anonymous reports need a policy tweak.
    // If insert fails for anon, ask them to sign in.
    if (error) {
      if (!user) {
        return {
          ok: false,
          error: "Sign in to report this letter",
        };
      }
      return { ok: false, error: error.message };
    }
    return { ok: true, data: undefined };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not submit report",
    };
  }
}

export async function blockUser(blockedId: string): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured" };
  }

  try {
    const user = await requireUser();
    if (user.id === blockedId) {
      return { ok: false, error: "You cannot block yourself" };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("blocks").upsert(
      {
        blocker_id: user.id,
        blocked_id: blockedId,
      },
      { onConflict: "blocker_id,blocked_id" },
    );

    if (error) return { ok: false, error: error.message };
    revalidatePath("/dashboard");
    return { ok: true, data: undefined };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not block user",
    };
  }
}
