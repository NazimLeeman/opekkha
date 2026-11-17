"use client";

import { useState, useTransition } from "react";
import { reviewReport } from "@/app/actions/admin-reports";

type Props = {
  reportId: string;
  locale: "bn" | "en";
};

export function ReportReviewActions({ reportId, locale }: Props) {
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function act(status: "reviewing" | "resolved" | "dismissed") {
    setError(null);
    startTransition(async () => {
      const result = await reviewReport({
        reportId,
        status,
        note,
      });
      if (!result.ok) setError(result.error);
    });
  }

  const t =
    locale === "bn"
      ? {
          note: "নোট (ঐচ্ছিক)",
          reviewing: "রিভিউতে",
          resolve: "সমাধান",
          dismiss: "খারিজ",
        }
      : {
          note: "Note (optional)",
          reviewing: "Mark reviewing",
          resolve: "Resolve",
          dismiss: "Dismiss",
        };

  return (
    <div className="mt-3 space-y-2">
      <label className="block space-y-1">
        <span className="text-xs text-[var(--ink-muted)]">{t.note}</span>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="field text-sm"
          maxLength={400}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => act("reviewing")}
          className="btn btn-ghost min-h-9 border border-[var(--ink)]/12 px-3 py-1.5 text-sm"
        >
          {t.reviewing}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => act("resolved")}
          className="btn btn-primary min-h-9 px-3 py-1.5 text-sm"
        >
          {t.resolve}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => act("dismissed")}
          className="btn btn-outline min-h-9 px-3 py-1.5 text-sm"
        >
          {t.dismiss}
        </button>
      </div>
      {error ? (
        <p className="text-xs text-[var(--seal)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
