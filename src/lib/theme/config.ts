export const themes = ["dark", "light"] as const;

export type Theme = (typeof themes)[number];

export const defaultTheme: Theme = "dark";

export const themeCookieName = "opekkha_theme";

export function isTheme(value: string | undefined | null): value is Theme {
  return value === "dark" || value === "light";
}
