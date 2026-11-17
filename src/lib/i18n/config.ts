export const locales = ["bn", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "bn";

export const localeCookieName = "opekkha_locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "bn" || value === "en";
}
