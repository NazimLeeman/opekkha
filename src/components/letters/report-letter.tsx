"use client";

import { useState, useTransition } from "react";
import { reportLetterByToken } from "@/app/actions/abuse";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  letterId: string;
  locale: Locale;
};

const reasons = {
  bn: [
    "অশালীন বিষয়বস্তু",
    "হয়রানি / হুমকি",
    "স্প্যাম",
    "অন্যান্য",
  ],
  en: ["Inappropriate content", "Harassment / threats", "Spam", "Other"],
} as const;

export function ReportLetter({ letterId, locale }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (done) {
    return (
      <p className="mt-6 text-center text-sm text-[var(--ink-muted)]">
        {locale === "bn" ? "রিপোর্ট জমা হয়েছে। ধন্যবাদ।" : "Report submitted. Thank you."}
      </p>
    );
  }

  if (!open) {
    return (
      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-sm text-[var(--ink-muted)] underline-offset-4 hover:text-[var(--ink)] hover:underline"
        >
          {locale === "bn" ? "এই চিঠি রিপোর্ট করুন" : "Report this letter"}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 max-w-md rounded-[1.1rem] border border-[var(--ink)]/10 bg-[var(--paper-raised)]/80 p-4">
      <p className="text-sm text-[var(--ink)]">
        {locale === "bn" ? "রিপোর্টের কারণ" : "Reason for report"}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {reasons[locale].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setReason(item)}
            className={`rounded-full px-3 py-1.5 text-xs transition ${
              reason === item
                ? "bg-[var(--seal)]/15 text-[var(--seal-bright)]"
                : "text-[var(--ink-muted)] hover:bg-[var(--paper-deep)]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <label className="mt-3 block space-y-1.5">
        <span className="text-xs text-[var(--ink-muted)]">
          {locale === "bn" ? "বিস্তারিত (ঐচ্ছিক)" : "Details (optional)"}
        </span>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={3}
          className="field text-sm"
          maxLength={500}
        />
      </label>
      {error ? (
        <p className="mt-2 text-xs text-[var(--seal)]" role="alert">
          {error}
        </p>
      ) : null}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          disabled={pending || !reason}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await reportLetterByToken({
                letterId,
                reason,
                details,
              });
              if (!result.ok) {
                setError(result.error);
                return;
              }
              setDone(true);
            });
          }}
          className="btn btn-seal min-h-10 px-4 py-2"
        >
          {pending
            ? locale === "bn"
              ? "জমা হচ্ছে…"
              : "Submitting…"
            : locale === "bn"
              ? "জমা দিন"
              : "Submit"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="btn btn-ghost min-h-10 px-3"
        >
          {locale === "bn" ? "বন্ধ" : "Cancel"}
        </button>
      </div>
    </div>
  );
}
