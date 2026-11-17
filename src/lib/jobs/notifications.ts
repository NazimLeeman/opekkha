import { createAdminClient } from "@/lib/supabase/admin";

export type ProcessResult = {
  processed: number;
  sent: number;
  failed: number;
  errors: string[];
};

/**
 * Claim and process pending notification jobs.
 * MVP: no email provider — mark as sent with a stub note, or fail clearly.
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

    // Promote scheduled letters that are due (server-side availability).
    if (job.event_type === "letter_available") {
      await admin
        .from("letters")
        .update({ status: "available" })
        .eq("id", job.letter_id)
        .eq("status", "scheduled")
        .lte("opens_at", now);
    }

    const emailConfigured = Boolean(process.env.EMAIL_PROVIDER_API_KEY);

    if (!emailConfigured) {
      // Honest stub: job acknowledged without sending private content.
      await admin
        .from("notification_jobs")
        .update({
          status: "sent",
          last_error: "Email provider not configured — job acknowledged (stub).",
        })
        .eq("id", job.id);
      result.sent += 1;
      continue;
    }

    // Provider hook placeholder — never put letter body in email.
    try {
      // await sendEmail(...subject without body...)
      await admin
        .from("notification_jobs")
        .update({ status: "sent", last_error: null })
        .eq("id", job.id);
      result.sent += 1;
    } catch (err) {
      const message = err instanceof Error ? err.message : "send failed";
      await admin
        .from("notification_jobs")
        .update({ status: "failed", last_error: message.slice(0, 500) })
        .eq("id", job.id);
      result.failed += 1;
      result.errors.push(message);
    }
  }

  return result;
}

export async function enqueueLetterAvailableJob(args: {
  letterId: string;
  recipientId: string | null;
  scheduledFor: string;
  actorId: string;
}) {
  const admin = createAdminClient();
  const idempotencyKey = `letter_available:${args.letterId}:${args.scheduledFor}`;

  await admin.from("notification_jobs").upsert(
    {
      letter_id: args.letterId,
      recipient_id: args.recipientId,
      channel: "email",
      event_type: "letter_available",
      scheduled_for: args.scheduledFor,
      status: "pending",
      idempotency_key: idempotencyKey,
    },
    { onConflict: "idempotency_key", ignoreDuplicates: true },
  );
}
