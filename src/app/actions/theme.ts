"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  isTheme,
  themeCookieName,
  type Theme,
} from "@/lib/theme/config";

export async function setTheme(theme: Theme) {
  if (!isTheme(theme)) return;

  const jar = await cookies();
  jar.set(themeCookieName, theme, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  revalidatePath("/", "layout");
}
