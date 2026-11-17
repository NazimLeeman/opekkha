import { isEmailConfigured, sendEmail } from "@/lib/email/provider";
import { letterAvailableEmail } from "@/lib/email/templates";
import { captureError, trackEvent } from "@/lib/monitoring/events";
import { createAdminClient } from "@/lib/supabase/admin";

export type ProcessResult = {
  processed: number;
  sent: number;
  failed: number;
  skipped: number;
  errors: string[];
};

type JobPayload = {
  inviteUrl?: string;
  locale?: "bn" | "en";
  recipientName?: string | null;
  notifyEmail?: string | null;
};

/**
 * Claim and process pending notification jobs.
 * Sends email when Resend is configured; never includes letter body.
 */
export async function processNotificationJobs(
  limit = 20,
): Promise<ProcessResult> {
  const admin = createAdminClient();
  const now = new Date().toISOString();
  const result: ProcessResult = {
    processed: 0,
    sent: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  const { data: jobs, error } = await admin
    .from("notification_jobs")
    .select("*")
    .eq("status", "pending")
    .lte("scheduled_for", now)
    .order("scheduled_for", { ascending: true })
    .limit(limit);

  if (error) {
    result.errors.push(error.message);
    captureError(error, { area: "notification_jobs_list" });
    return result;
  }

  for (const job of jobs ?? []) {
    result.processed += 1;

    const { error: claimError } = await admin
      .from("notification_jobs")
      .update({
        status: "processing",
        attempt_count: (job.attempt_count ?? 0) + 1,
      })
      .eq("id", job.id)
      .eq("status", "pending");

    if (claimError) {
      result.failed += 1;
      result.errors.push(claimError.message);
      continue;
    }

    if (job.event_type === "letter_available") {
      await admin
        .from("letters")
        .update({ status: "available" })
        .eq("id", job.letter_id)
        .eq("status", "scheduled")
        .lte("opens_at", now);
    }

    try {
      const outcome = await deliverJob(admin, job);
      if (outcome === "sent") {
        await admin
          .from("notification_jobs")
          .update({ status: "sent", last_error: null })
          .eq("id", job.id);
        result.sent += 1;
      } else if (outcome === "skipped") {
        await admin
          .from("notification_jobs")
          .update({
            status: "sent",
            last_error: "Skipped — no recipient email or provider not configured",
          })
          .eq("id", job.id);
        result.skipped += 1;
        result.sent += 1;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "send failed";
      await admin
        .from("notification_jobs")
        .update({ status: "failed", last_error: message.slice(0, 500) })
        .eq("id", job.id);
      result.failed += 1;
      result.errors.push(message);
      captureError(err, { area: "notification_job", jobId: job.id });
    }
  }

  trackEvent("job_processed", {
    processed: result.processed,
    sent: result.sent,
    failed: result.failed,
    skipped: result.skipped,
  });

  return result;
}

async function deliverJob(
  admin: ReturnType<typeof createAdminClient>,
  job: {
    id: string;
    letter_id: string;
    recipient_id: string | null;
    event_type: string;
    idempotency_key: string;
    payload?: JobPayload | null;
  },
): Promise<"sent" | "skipped"> {
  if (job.event_type !== "letter_available") {
    return "skipped";
  }

  const payload = (job.payload ?? {}) as JobPayload;
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";

  let to = payload.notifyEmail?.trim() || null;

  if (!to && job.recipient_id) {
    const { data } = await admin.auth.admin.getUserById(job.recipient_id);
    to = data.user?.email ?? null;
  }

  if (!to) {
    return "skipped";
  }

  if (!isEmailConfigured()) {
    return "skipped";
  }

  const locale = payload.locale === "en" ? "en" : "bn";
  const template = letterAvailableEmail({
    locale,
    appUrl,
    openUrl: payload.inviteUrl || null,
    recipientName: payload.recipientName ?? null,
  });

  const sent = await sendEmail({
    to,
    subject: template.subject,
    text: template.text,
    html: template.html,
    idempotencyKey: job.idempotency_key,
    tags: [
      { name: "event", value: "letter_available" },
      { name: "locale", value: locale },
    ],
  });

  if (!sent.ok) {
    if (sent.skipped) return "skipped";
    throw new Error(sent.error);
  }

  return "sent";
}

export async function enqueueLetterAvailableJob(args: {
  letterId: string;
  recipientId: string | null;
  scheduledFor: string;
  actorId: string;
  inviteUrl?: string | null;
  locale?: "bn" | "en";
  recipientName?: string | null;
  notifyEmail?: string | null;
}) {
  const admin = createAdminClient();
  const idempotencyKey = `letter_available:${args.letterId}:${args.scheduledFor}`;

  const payload: JobPayload = {
    inviteUrl: args.inviteUrl || undefined,
    locale: args.locale || "bn",
    recipientName: args.recipientName ?? null,
    notifyEmail: args.notifyEmail ?? null,
  };

  await admin.from("notification_jobs").upsert(
    {
      letter_id: args.letterId,
      recipient_id: args.recipientId,
      channel: "email",
      event_type: "letter_available",
      scheduled_for: args.scheduledFor,
      status: "pending",
      idempotency_key: idempotencyKey,
      payload,
    },
    { onConflict: "idempotency_key", ignoreDuplicates: true },
  );
}
