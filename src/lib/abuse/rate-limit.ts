import { createClient } from "@/lib/supabase/server";

/** Soft rate limits for abuse-sensitive actions (MVP, DB-backed). */
export async function assertRateLimit(args: {
  userId: string;
  action: "report" | "share_card" | "send_letter";
  limit: number;
  windowMinutes: number;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const since = new Date(
    Date.now() - args.windowMinutes * 60_000,
  ).toISOString();

  if (args.action === "report") {
    const { count, error } = await supabase
      .from("reports")
      .select("id", { count: "exact", head: true })
      .eq("reporter_id", args.userId)
      .gte("created_at", since);
    if (error) return { ok: false, error: error.message };
    if ((count ?? 0) >= args.limit) {
      return {
        ok: false,
        error: "Too many reports. Please try again later.",
      };
    }
    return { ok: true };
  }

  if (args.action === "share_card") {
    const { count, error } = await supabase
      .from("share_cards")
      .select("id", { count: "exact", head: true })
      .eq("user_id", args.userId)
      .gte("created_at", since);
    if (error) return { ok: false, error: error.message };
    if ((count ?? 0) >= args.limit) {
      return {
        ok: false,
        error: "Share card limit reached. Please try again later.",
      };
    }
    return { ok: true };
  }

  const { count, error } = await supabase
    .from("letter_events")
    .select("id", { count: "exact", head: true })
    .eq("actor_id", args.userId)
    .in("event_type", ["invited", "scheduled"])
    .gte("created_at", since);
  if (error) return { ok: false, error: error.message };
  if ((count ?? 0) >= args.limit) {
    return {
      ok: false,
      error: "Send limit reached. Please try again later.",
    };
  }
  return { ok: true };
}
