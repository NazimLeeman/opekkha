import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { HeroLetter } from "@/components/landing/hero-letter";
import { FloatingMotifs } from "@/components/landing/floating-motifs";
import { MomentCards } from "@/components/landing/moment-cards";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  locale: Locale;
  dictionary: Dictionary;
};

export function LandingPage({ locale, dictionary }: Props) {
  const sampleLine =
    locale === "bn"
      ? "অনেকদিন পর তোমাকে লিখছি। মনে আছে, যখন তোমার মনে পড়ে আমাকে…"
      : "Open when you miss me — a letter waiting for the right moment.";

  return (
    <div className="relative min-h-full overflow-hidden">
      <div className="atmosphere pointer-events-none absolute inset-0" />
      <FloatingMotifs />
      <SiteHeader locale={locale} dictionary={dictionary} />

      <main>
        <section className="relative isolate px-5 pb-8 pt-4 sm:px-8 sm:pt-6">
          <div className="hero-stage relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
            <p
              className={`hero-fade hero-fade-1 ${
                locale === "bn" ? "font-brand-bn" : "font-brand-en"
              } text-[3.1rem] leading-[0.92] text-[var(--ink)] sm:text-[3.75rem] md:text-6xl`}
            >
              {dictionary.brand}
            </p>
            <p
              className={`hero-fade hero-fade-2 mt-2 text-[var(--ink-muted)] ${
                locale === "bn"
                  ? "font-brand-en text-[0.8rem] tracking-[0.22em]"
                  : "font-brand-bn text-base"
              }`}
            >
              {dictionary.brandLatin}
            </p>

            <h1 className="hero-fade hero-fade-3 mt-5 max-w-[22ch] text-balance text-[1.25rem] leading-snug text-[var(--ink)] sm:mt-6 sm:text-[1.65rem]">
              {dictionary.tagline}
            </h1>
            <p className="hero-fade hero-fade-4 mt-3 max-w-[38ch] text-pretty text-[0.95rem] leading-relaxed text-[var(--ink-muted)] sm:text-base">
              {dictionary.heroSupport}
            </p>

            <div className="hero-fade hero-fade-5 mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href="/letters/new" className="btn btn-glow">
                {dictionary.ctaWrite}
              </Link>
              <a href="#how" className="btn btn-outline">
                {dictionary.ctaHow}
              </a>
            </div>

            <div className="hero-fade hero-fade-6 relative mt-8 w-full sm:mt-10">
              <HeroLetter sampleLine={sampleLine} />
            </div>
          </div>
        </section>

        <section
          id="how"
          className="relative border-t border-[var(--ink)]/10 bg-[var(--paper-raised)]/55 px-5 py-16 backdrop-blur-[2px] sm:px-8"
        >
          <div className="mx-auto max-w-6xl">
            <h2
              className={`${
                locale === "bn" ? "font-brand-bn" : "font-brand-en"
              } text-center text-3xl text-[var(--ink)] sm:text-4xl`}
            >
              {dictionary.howTitle}
            </h2>
            <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {dictionary.howSteps.map((step, index) => (
                <li key={step.title} className="relative text-center sm:text-left">
                  <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#d46a6e,#9a3d42_70%,#5a2428)] text-sm text-[#fff6f0] shadow-[0_0_24px_-4px_rgba(196,91,95,0.65)] sm:mx-0">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-medium text-[var(--ink)]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <MomentCards
          locale={locale}
          title={dictionary.useCasesTitle}
          support={dictionary.useCasesSupport}
          moments={dictionary.useCases}
        />

        <section className="border-t border-[var(--ink)]/10 px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2
              className={`${
                locale === "bn" ? "font-brand-bn" : "font-brand-en"
              } text-2xl text-[var(--ink)] sm:text-3xl`}
            >
              {dictionary.privacyTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-[46ch] text-base leading-relaxed text-[var(--ink-muted)]">
              {dictionary.privacyBody}
            </p>
          </div>
        </section>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--ink)]/8 px-5 py-8 text-sm text-[var(--ink-muted)] sm:px-8">
        <p className={locale === "bn" ? "font-brand-bn" : "font-brand-en"}>
          {dictionary.brand}
        </p>
        <div className="flex gap-5">
          <span>{dictionary.footerPrivacy}</span>
          <span>{dictionary.footerTerms}</span>
          <span>{dictionary.footerContact}</span>
        </div>
      </footer>
    </div>
  );
}
