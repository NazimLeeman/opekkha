import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitcherGate } from "@/components/theme-switcher-gate";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  locale: Locale;
  dictionary: Dictionary;
  title: string;
  support: string;
  children: React.ReactNode;
};

export function AuthShell({
  locale,
  dictionary,
  title,
  support,
  children,
}: Props) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <div className="atmosphere pointer-events-none absolute inset-0" />
      <header className="relative z-10 flex items-center justify-between gap-3 px-5 py-5 sm:px-8">
        <BrandMark
          locale={locale}
          brand={dictionary.brand}
          brandLatin={dictionary.brandLatin}
          showSecondary={false}
        />
        <div className="flex items-center gap-2">
          <ThemeSwitcherGate
            label={dictionary.theme}
            darkLabel={dictionary.themeDark}
            lightLabel={dictionary.themeLight}
          />
          <LanguageSwitcher locale={locale} label={dictionary.language} />
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 pb-16">
        <div className="paper-surface rounded-[1.6rem] px-6 py-8 sm:px-8">
          <h1
            className={`${
              locale === "bn" ? "font-brand-bn" : "font-brand-en"
            } text-3xl text-[var(--ink)]`}
          >
            {title}
          </h1>
          <p className="mt-2 text-[var(--ink-muted)]">{support}</p>
          <div className="mt-7 space-y-4">{children}</div>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-[var(--ink-muted)]">
          {dictionary.authNote}
        </p>
        <p className="mt-3 text-sm text-[var(--ink-muted)]">
          <Link href="/" className="underline underline-offset-4 hover:text-[var(--ink)]">
            ← {dictionary.brand}
          </Link>
        </p>
      </main>
    </div>
  );
}
