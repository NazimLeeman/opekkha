import { cookies } from "next/headers";
import {
  defaultLocale,
  isLocale,
  localeCookieName,
  type Locale,
} from "./config";
import { getDictionary, type Dictionary } from "./dictionaries";

export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  const value = jar.get(localeCookieName)?.value;
  return isLocale(value) ? value : defaultLocale;
}

export async function getLocaleDictionary(): Promise<{
  locale: Locale;
  dictionary: Dictionary;
}> {
  const locale = await getLocale();
  return { locale, dictionary: getDictionary(locale) };
}
