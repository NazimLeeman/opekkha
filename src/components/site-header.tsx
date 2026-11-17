import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitcherGate } from "@/components/theme-switcher-gate";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  locale: Locale;
  dictionary: Dictionary;
};

export function SiteHeader({ locale, dictionary }: Props) {
  return (
    <header className="relative z-20 flex items-center justify-between gap-4 px-5 py-5 sm:px-8">
      <BrandMark
        locale={locale}
        brand={dictionary.brand}
        brandLatin={dictionary.brandLatin}
        showSecondary={false}
      />

      <nav className="flex items-center gap-2 sm:gap-3" aria-label="Primary">
        <ThemeSwitcherGate
          label={dictionary.theme}
          darkLabel={dictionary.themeDark}
          lightLabel={dictionary.themeLight}
        />
        <LanguageSwitcher locale={locale} label={dictionary.language} />
        <Link
          href="/login"
          className="btn btn-ghost hidden min-h-10 px-3 py-2 sm:inline-flex"
        >
          {dictionary.navLogin}
        </Link>
        <Link href="/signup" className="btn btn-glow min-h-10 px-4 py-2">
          {dictionary.navSignup}
        </Link>
      </nav>
    </header>
  );
}
