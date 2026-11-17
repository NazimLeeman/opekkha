import { LandingPage } from "@/components/landing/landing-page";
import { LocaleGate } from "@/components/locale-gate";

function LandingFallback() {
  return (
    <div className="relative min-h-full">
      <div className="atmosphere absolute inset-0" />
      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="h-14 w-48 animate-pulse rounded bg-[var(--paper-deep)]" />
          <div className="h-8 w-full max-w-md animate-pulse rounded bg-[var(--paper-deep)]" />
          <div className="h-20 w-full max-w-sm animate-pulse rounded bg-[var(--paper-deep)]" />
        </div>
        <div className="mx-auto aspect-[4/5] w-full max-w-md animate-pulse rounded-[1.4rem] bg-[var(--paper-deep)]" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <LocaleGate fallback={<LandingFallback />}>
      {({ locale, dictionary }) => (
        <LandingPage locale={locale} dictionary={dictionary} />
      )}
    </LocaleGate>
  );
}
