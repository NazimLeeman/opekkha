"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { trackEvent } from "@/lib/monitoring/events";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type AdminReport = {
  id: string;
  reason: string;
  details: string | null;
  status: "open" | "reviewing" | "resolved" | "dismissed";
  letter_id: string | null;
  reporter_id: string | null;
  reported_user_id: string | null;
  created_at: string;
  resolved_at: string | null;
  review_note: string | null;
  reviewed_by: string | null;
};

export async function listAdminReports(
  status: "open" | "all" = "open",
): Promise<ActionResult<AdminReport[]>> {
  if (!isAdminConfigured()) {
    return { ok: false, error: "Admin Supabase client not configured" };
  }

  try {
    await requireAdmin();
    const admin = createAdminClient();
    let query = admin
      .from("reports")
      .select(
        "id, reason, details, status, letter_id, reporter_id, reported_user_id, created_at, resolved_at, review_note, reviewed_by",
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (status === "open") {
      query = query.in("status", ["open", "reviewing"]);
    }

    const { data, error } = await query;
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: (data ?? []) as AdminReport[] };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not load reports",
    };
  }
}

export async function reviewReport(args: {
  reportId: string;
  status: "reviewing" | "resolved" | "dismissed";
  note?: string;
}): Promise<ActionResult> {
  if (!isAdminConfigured()) {
    return { ok: false, error: "Admin Supabase client not configured" };
  }

  try {
    const user = await requireAdmin();
    const admin = createAdminClient();
    const resolved =
      args.status === "resolved" || args.status === "dismissed"
        ? new Date().toISOString()
        : null;

    const { error } = await admin
      .from("reports")
      .update({
        status: args.status,
        review_note: args.note?.trim() || null,
        reviewed_by: user.id,
        resolved_at: resolved,
      })
      .eq("id", args.reportId);

    if (error) return { ok: false, error: error.message };

    trackEvent("report_reviewed", { status: args.status });
    revalidatePath("/admin/reports");
    return { ok: true, data: undefined };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not update report",
    };
  }
}
