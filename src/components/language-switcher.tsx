"use client";

import { setLocale } from "@/app/actions/locale";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  locale: Locale;
  label: string;
};

export function LanguageSwitcher({ locale, label }: Props) {
  return (
    <div
      className="inline-flex items-center rounded-full border border-[var(--ink)]/12 bg-[var(--paper-raised)]/80 p-0.5 text-sm"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => setLocale("bn")}
        className={`rounded-full px-2.5 py-1.5 transition ${
          locale === "bn"
            ? "bg-[var(--ink)] text-[var(--on-ink)]"
            : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
        }`}
        aria-pressed={locale === "bn"}
      >
        বাং
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`rounded-full px-2.5 py-1.5 transition ${
          locale === "en"
            ? "bg-[var(--ink)] text-[var(--on-ink)]"
            : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
        }`}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
    </div>
  );
}
