import { trackEvent } from "@/lib/monitoring/events";

export type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  /** Resend / provider idempotency key */
  idempotencyKey?: string;
  tags?: Array<{ name: string; value: string }>;
};

export type SendEmailResult =
  | { ok: true; id: string }
  | { ok: false; error: string; skipped?: boolean };

export function isEmailConfigured() {
  return Boolean(
    process.env.EMAIL_PROVIDER_API_KEY?.trim() &&
      process.env.EMAIL_FROM?.trim(),
  );
}

/**
 * Transactional email via Resend HTTP API (no SDK required).
 * Never include letter body or private title in subject/body.
 */
export async function sendEmail(
  input: SendEmailInput,
): Promise<SendEmailResult> {
  const apiKey = process.env.EMAIL_PROVIDER_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();

  if (!apiKey || !from) {
    return {
      ok: false,
      skipped: true,
      error: "Email provider not configured",
    };
  }

  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };
    if (input.idempotencyKey) {
      headers["Idempotency-Key"] = input.idempotencyKey.slice(0, 256);
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers,
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        text: input.text,
        html: input.html ?? undefined,
        tags: input.tags,
      }),
    });

    const body = (await response.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
      name?: string;
    };

    if (!response.ok) {
      const error =
        body.message || body.name || `Email provider HTTP ${response.status}`;
      trackEvent("email_send_failed", { status: response.status });
      return { ok: false, error };
    }

    trackEvent("email_sent", { provider: "resend" });
    return { ok: true, id: body.id || "unknown" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Email send failed";
    trackEvent("email_send_failed", { reason: "exception" });
    return { ok: false, error: message };
  }
}
