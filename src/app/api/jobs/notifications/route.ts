import { NextResponse } from "next/server";
import { processNotificationJobs } from "@/lib/jobs/notifications";
import { captureError } from "@/lib/monitoring/events";
import { isAdminConfigured } from "@/lib/supabase/admin";

/**
 * Cron/worker endpoint for pending notification jobs.
 * Protect with CRON_SECRET header: Authorization: Bearer <CRON_SECRET>
 */
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET is not configured" },
      { status: 503 },
    );
  }

  const auth = request.headers.get("authorization") || "";
  const cronHeader = request.headers.get("x-cron-secret") || "";
  const vercelCron = request.headers.get("x-vercel-cron") === "1";
  const authorized =
    auth === `Bearer ${secret}` ||
    cronHeader === secret ||
    (vercelCron && Boolean(secret));
  if (!authorized) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Admin Supabase client not configured" },
      { status: 503 },
    );
  }

  try {
    const result = await processNotificationJobs(25);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    captureError(err, { area: "jobs_notifications_route" });
    return NextResponse.json(
      { ok: false, error: "Job processing failed" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  return POST(request);
}
