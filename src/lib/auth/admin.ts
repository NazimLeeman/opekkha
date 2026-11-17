import { getSessionUser } from "@/lib/auth/session";

/**
 * Admin gate via env allowlist and/or Supabase app_metadata.role.
 * Prefer app_metadata (not user_metadata) for role claims.
 */
export function getAdminEmailAllowlist(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function getAdminUser() {
  const user = await getSessionUser();
  if (!user?.email) return null;

  const email = user.email.toLowerCase();
  const allowlist = getAdminEmailAllowlist();
  const role = (user.app_metadata as { role?: string } | undefined)?.role;
  const isAdmin =
    role === "admin" || (allowlist.length > 0 && allowlist.includes(email));

  if (!isAdmin) return null;
  return user;
}

export async function requireAdmin() {
  const admin = await getAdminUser();
  if (!admin) {
    throw new Error("Admin access required");
  }
  return admin;
}
