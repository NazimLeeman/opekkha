"use client";

import { useState, useTransition } from "react";
import {
  revealLetter,
  type RevealedLetter,
} from "@/app/actions/open-letter";
import { FormattedDate } from "@/components/formatted-date";
import { ReportLetter } from "@/components/letters/report-letter";
import type { EnvelopeView } from "@/lib/letters/opening";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  token: string;
  envelope: EnvelopeView;
  locale: Locale;
};

const copy = {
  bn: {
    sealed: "এই চিঠি এখনো সিল করা",
    opens: "খোলার সময়",
    open: "সিল ভেঙে খুলুন",
    from: "পক্ষ থেকে",
    opening: "খোলা হচ্ছে…",
    hold: "সিলটি স্পর্শ করে খুলুন",
  },
  en: {
    sealed: "This letter is still sealed",
    opens: "Opens at",
    open: "Break the seal",
    from: "From",
    opening: "Opening…",
    hold: "Touch the seal to open",
  },
} as const;

export function EnvelopeReveal({ token, envelope, locale }: Props) {
  const t = copy[locale];
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<RevealedLetter | null>(null);
  const [pressing, setPressing] = useState(false);

  function onOpen() {
    setError(null);
    startTransition(async () => {
      const result = await revealLetter(token);
      if (!result.ok) {
        setError(result.error);
        setPressing(false);
        return;
      }
      setRevealed(result.data);
    });
  }

  if (revealed) {
    return (
      <div>
        <article className="letter-reveal letter-sheet mx-auto max-w-xl overflow-hidden rounded-[0.7rem] px-7 py-10 sm:px-11">
          {revealed.senderLabel ? (
            <p className="letter-sheet-muted text-sm">
              {t.from} {revealed.senderLabel}
            </p>
          ) : null}
          <h1
            className={`${
              locale === "bn" ? "font-brand-bn" : "font-brand-en"
            } mt-2 text-3xl text-[var(--letter-ink)]`}
          >
            {revealed.title}
          </h1>
          {revealed.prompt && revealed.prompt !== revealed.title ? (
            <p className="letter-sheet-muted mt-2">{revealed.prompt}</p>
          ) : null}
          <div className="mt-8 whitespace-pre-wrap text-lg leading-8 text-[var(--letter-ink)]/85">
            {revealed.body}
          </div>
        </article>
        <ReportLetter letterId={envelope.letterId} locale={locale} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md text-center">
      <div className="relative mx-auto aspect-[3/4] w-full max-w-sm">
        <div className="absolute inset-[8%] translate-x-2 translate-y-2 rotate-[3deg] rounded-[0.4rem] bg-[var(--letter-sheet-deep)] opacity-80" />
        <div className="letter-sheet absolute inset-[3%] overflow-hidden rounded-[0.55rem]">
          <div className="flex h-full flex-col px-7 pb-8 pt-10">
            <p className="font-brand-en text-[0.68rem] tracking-[0.22em] text-[var(--letter-muted)]">
              OPEN WHEN
            </p>
            <h1
              className={`${
                locale === "bn" ? "font-brand-bn" : "font-brand-en"
              } mt-5 text-[1.45rem] leading-snug text-[var(--letter-ink)]`}
            >
              {envelope.title}
            </h1>
            {envelope.senderLabel ? (
              <p className="letter-sheet-muted mt-3 text-sm">
                {t.from} {envelope.senderLabel}
              </p>
            ) : null}

            <div className="mt-auto flex flex-col items-center gap-3">
              {envelope.openable ? (
                <>
                  <p className="letter-sheet-muted text-xs">{t.hold}</p>
                  <button
                    type="button"
                    disabled={pending}
                    aria-label={t.open}
                    onClick={() => {
                      if (!pending) onOpen();
                    }}
                    onPointerDown={() => setPressing(true)}
                    onPointerUp={() => setPressing(false)}
                    onPointerLeave={() => setPressing(false)}
                    className={`relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full transition duration-200 ${
                      pressing || pending ? "scale-95" : "scale-100"
                    }`}
                  >
                    <span className="absolute inset-0 rounded-full bg-[var(--seal)]/25 blur-md" />
                    <span className="relative flex h-full w-full items-center justify-center rounded-full bg-[radial-gradient(circle_at_32%_28%,#b85a5e,#7a3438_58%,#4f2326)] shadow-[0_12px_28px_-10px_rgba(79,35,38,0.9)] ring-1 ring-white/25">
                      <span className="font-brand-bn text-xl text-[#f7f4ef]">
                        অ
                      </span>
                    </span>
                  </button>
                  <span className="text-sm text-[var(--letter-ink)]/80">
                    {pending ? t.opening : t.open}
                  </span>
                </>
              ) : (
                <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-[radial-gradient(circle_at_32%_28%,#b85a5e,#7a3438_58%,#4f2326)] opacity-90 ring-1 ring-white/20">
                  <span className="font-brand-bn text-xl text-[#f7f4ef]">অ</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {!envelope.openable ? (
        <div className="mt-8 space-y-2">
          <p className="text-[var(--ink)]">{t.sealed}</p>
          {envelope.opensAt ? (
            <p className="text-sm text-[var(--ink-muted)]">
              {t.opens}:{" "}
              <FormattedDate
                value={envelope.opensAt}
                locale={locale}
                timeZone={envelope.timezone || "Asia/Dhaka"}
              />
            </p>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="mt-4 text-sm text-[var(--seal)]">
          {error}
        </p>
      ) : null}

      <ReportLetter letterId={envelope.letterId} locale={locale} />
    </div>
  );
}
