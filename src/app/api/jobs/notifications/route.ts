import { NextResponse } from "next/server";
import { processNotificationJobs } from "@/lib/jobs/notifications";
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
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Admin Supabase client not configured" },
      { status: 503 },
    );
  }

  const result = await processNotificationJobs(25);
  return NextResponse.json({ ok: true, ...result });
}

export async function GET(request: Request) {
  return POST(request);
}
