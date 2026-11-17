import { scrubProps, scrubString } from "@/lib/monitoring/scrub";

export type AnalyticsEvent =
  | "signup_completed"
  | "letter_draft_created"
  | "letter_sent"
  | "letter_revealed"
  | "share_card_saved"
  | "invite_copied"
  | "report_submitted"
  | "report_reviewed"
  | "rate_limit_hit"
  | "job_processed"
  | "email_sent"
  | "email_send_failed"
  | "error";

/**
 * Privacy-conscious product analytics.
 * Never pass letter body, private title, recipient email, or raw invite tokens.
 */
export function trackEvent(
  name: AnalyticsEvent | (string & {}),
  props?: Record<string, unknown>,
) {
  const payload = {
    name,
    ts: new Date().toISOString(),
    props: scrubProps(props),
  };

  if (process.env.NODE_ENV !== "production") {
    console.info("[opekkha:event]", payload.name, payload.props);
  }

  const webhook = process.env.MONITORING_WEBHOOK_URL?.trim();
  if (!webhook) return;

  // Fire-and-forget; never block the request path on analytics.
  void fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "event", ...payload }),
  }).catch(() => {
    /* ignore webhook failures */
  });
}

export function captureError(
  error: unknown,
  context?: Record<string, unknown>,
) {
  const message =
    error instanceof Error ? scrubString(error.message) : "Unknown error";

  const payload = {
    type: "error",
    message,
    ts: new Date().toISOString(),
    context: scrubProps(context),
  };

  console.error("[opekkha:error]", payload.message, payload.context);

  const webhook = process.env.MONITORING_WEBHOOK_URL?.trim();
  if (!webhook) return;

  void fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {
    /* ignore */
  });

  trackEvent("error", { message: payload.message, ...payload.context });
}
