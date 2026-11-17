import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getEnvelope } from "@/app/actions/open-letter";
import { EnvelopeReveal } from "@/components/letters/envelope-reveal";
import { getLocale } from "@/lib/i18n/locale";

type Props = {
  params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "Private letter",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Opekkha — a private letter for you",
    description: "Someone wrote you a letter on Opekkha.",
  },
};

export default function OpenLetterPage({ params }: Props) {
  return (
    <div className="relative min-h-full">
      <div className="atmosphere pointer-events-none absolute inset-0" />
      <header className="relative z-10 px-5 py-5 sm:px-8">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]"
        >
          অপেক্ষা
        </Link>
      </header>
      <main className="relative z-10 px-5 pb-20 pt-6 sm:px-8">
        <Suspense
          fallback={
            <div className="mx-auto aspect-[4/5] max-w-sm animate-pulse rounded-[1.5rem] bg-[var(--paper-deep)]" />
          }
        >
          <OpenLetterInner params={params} />
        </Suspense>
      </main>
    </div>
  );
}

async function OpenLetterInner({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const locale = await getLocale();
  const result = await getEnvelope(token);

  if (!result.ok) {
    return (
      <div className="mx-auto max-w-md text-center">
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          {locale === "bn" ? "লিংকটি কাজ করছে না" : "This link isn’t valid"}
        </h1>
        <p className="mt-3 text-[var(--ink-muted)]">{result.error}</p>
      </div>
    );
  }

  return (
    <EnvelopeReveal token={token} envelope={result.data} locale={locale} />
  );
}
