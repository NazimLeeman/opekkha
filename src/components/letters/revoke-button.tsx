"use client";

import { useState, useTransition } from "react";
import { revokeLetterAccess } from "@/app/actions/letters";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  letterId: string;
  locale: Locale;
};

export function RevokeButton({ letterId, locale }: Props) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const label =
    locale === "bn"
      ? done
        ? "বাতিল হয়েছে"
        : "লিংক বাতিল"
      : done
        ? "Revoked"
        : "Revoke link";

  function onRevoke() {
    const ok = window.confirm(
      locale === "bn"
        ? "এই চিঠির আমন্ত্রণ লিংক বাতিল করবেন? প্রাপক আর খুলতে পারবেন না।"
        : "Revoke this invite link? The recipient will no longer be able to open it.",
    );
    if (!ok) return;

    setError(null);
    startTransition(async () => {
      const result = await revokeLetterAccess(letterId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setDone(true);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={pending || done}
        onClick={onRevoke}
        className="rounded-full border border-[var(--seal)]/30 px-3 py-1.5 text-xs text-[var(--seal-bright)] transition hover:bg-[var(--seal)]/10 disabled:opacity-50"
      >
        {pending ? (locale === "bn" ? "বাতিল হচ্ছে…" : "Revoking…") : label}
      </button>
      {error ? (
        <p className="max-w-[12rem] text-right text-[0.65rem] text-[var(--seal)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
