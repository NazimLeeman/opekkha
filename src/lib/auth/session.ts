import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";

export async function getSessionUser() {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("You must be signed in");
  }
  return user;
}
