import { cookies } from "next/headers";
import {
  defaultTheme,
  isTheme,
  themeCookieName,
  type Theme,
} from "./config";

export async function getTheme(): Promise<Theme> {
  const jar = await cookies();
  const value = jar.get(themeCookieName)?.value;
  return isTheme(value) ? value : defaultTheme;
}
