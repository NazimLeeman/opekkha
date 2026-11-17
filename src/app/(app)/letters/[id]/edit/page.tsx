import Link from "next/link";
import { getOwnLetter } from "@/app/actions/letters";
import { BrandMark } from "@/components/brand-mark";
import { LetterEditor } from "@/components/letters/letter-editor";
import { LocaleGate } from "@/components/locale-gate";
import { ThemeSwitcherGate } from "@/components/theme-switcher-gate";

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditLetterPage({ params }: Props) {
  return (
    <LocaleGate
      fallback={
        <div className="mx-auto max-w-2xl px-5 py-16">
          <div className="h-8 w-40 animate-pulse rounded bg-[var(--paper-deep)]" />
        </div>
      }
    >
      {({ locale, dictionary }) => (
        <EditLetterInner
          params={params}
          locale={locale}
          brand={dictionary.brand}
          brandLatin={dictionary.brandLatin}
          dashboard={dictionary.navDashboard}
          write={dictionary.ctaWrite}
          themeLabel={dictionary.theme}
          themeDark={dictionary.themeDark}
          themeLight={dictionary.themeLight}
        />
      )}
    </LocaleGate>
  );
}

async function EditLetterInner({
  params,
  locale,
  brand,
  brandLatin,
  dashboard,
  write,
  themeLabel,
  themeDark,
  themeLight,
}: {
  params: Promise<{ id: string }>;
  locale: "bn" | "en";
  brand: string;
  brandLatin: string;
  dashboard: string;
  write: string;
  themeLabel: string;
  themeDark: string;
  themeLight: string;
}) {
  const { id } = await params;
  const result = await getOwnLetter(id);

  return (
    <div className="relative min-h-full">
      <div className="atmosphere pointer-events-none absolute inset-0" />
      <header className="relative z-10 flex items-center justify-between gap-3 px-5 py-5 sm:px-8">
        <BrandMark
          locale={locale}
          brand={brand}
          brandLatin={brandLatin}
          showSecondary={false}
        />
        <div className="flex items-center gap-2">
          <ThemeSwitcherGate
            label={themeLabel}
            darkLabel={themeDark}
            lightLabel={themeLight}
          />
          <Link href="/dashboard" className="btn btn-ghost min-h-10 px-3">
            {dashboard}
          </Link>
        </div>
      </header>
      <main className="relative z-10 px-5 pb-20 pt-4 sm:px-8">
        <h1
          suppressHydrationWarning
          className={`${
            locale === "bn" ? "font-brand-bn" : "font-brand-en"
          } mb-8 text-3xl text-[var(--ink)]`}
        >
          {write}
        </h1>
        {!result.ok ? (
          <p className="text-[var(--seal)]">{result.error}</p>
        ) : (
          <LetterEditor locale={locale} letter={result.data} />
        )}
      </main>
    </div>
  );
}
