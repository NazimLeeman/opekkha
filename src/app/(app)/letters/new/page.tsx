import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { LetterEditor } from "@/components/letters/letter-editor";
import { LocaleGate } from "@/components/locale-gate";
import { ThemeSwitcherGate } from "@/components/theme-switcher-gate";

type Props = {
  searchParams: Promise<{ prompt?: string }>;
};

export default function NewLetterPage({ searchParams }: Props) {
  return (
    <LocaleGate
      fallback={
        <div className="mx-auto max-w-2xl px-5 py-16">
          <div className="h-8 w-40 animate-pulse rounded bg-[var(--paper-deep)]" />
        </div>
      }
    >
      {({ locale, dictionary }) => (
        <NewLetterInner
          locale={locale}
          dictionary={dictionary}
          searchParams={searchParams}
        />
      )}
    </LocaleGate>
  );
}

async function NewLetterInner({
  locale,
  dictionary,
  searchParams,
}: {
  locale: "bn" | "en";
  dictionary: {
    brand: string;
    brandLatin: string;
    theme: string;
    themeDark: string;
    themeLight: string;
    navDashboard: string;
    ctaWrite: string;
  };
  searchParams: Promise<{ prompt?: string }>;
}) {
  const params = await searchParams;
  const initialTitle = params.prompt?.trim() || undefined;

  return (
    <div className="relative min-h-full">
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
          <Link href="/dashboard" className="btn btn-ghost min-h-10 px-3">
            {dictionary.navDashboard}
          </Link>
        </div>
      </header>
      <main className="relative z-10 px-5 pb-20 pt-4 sm:px-8">
        <h1
          className={`${
            locale === "bn" ? "font-brand-bn" : "font-brand-en"
          } mb-8 text-3xl text-[var(--ink)]`}
        >
          {dictionary.ctaWrite}
        </h1>
        <LetterEditor locale={locale} initialTitle={initialTitle} />
      </main>
    </div>
  );
}
