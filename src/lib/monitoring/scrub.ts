const SENSITIVE_KEYS = new Set([
  "body",
  "letter_body",
  "letterBody",
  "token",
  "rawToken",
  "access_token",
  "inviteUrl",
  "invite_url",
  "email",
  "password",
  "authorization",
  "cookie",
]);

/** Deep-clone props and redact sensitive keys / token-looking strings. */
export function scrubProps(
  input: Record<string, unknown> | undefined,
): Record<string, unknown> {
  if (!input) return {};
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (SENSITIVE_KEYS.has(key) || /token|password|secret|email/i.test(key)) {
      out[key] = "[redacted]";
      continue;
    }
    if (typeof value === "string") {
      out[key] = scrubString(value);
      continue;
    }
    if (value && typeof value === "object" && !Array.isArray(value)) {
      out[key] = scrubProps(value as Record<string, unknown>);
      continue;
    }
    out[key] = value;
  }
  return out;
}

export function scrubString(value: string) {
  return value
    .replace(/\/open\/[A-Za-z0-9_-]{16,}/g, "/open/[redacted]")
    .replace(
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
      "[redacted-email]",
    );
}
