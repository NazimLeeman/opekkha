import { createHash, randomBytes } from "crypto";

/** High-entropy raw token for invitation URLs. Returned once; store only the hash. */
export function generateAccessToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashAccessToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}
