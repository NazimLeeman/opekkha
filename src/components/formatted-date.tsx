"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  value: string;
  locale: Locale;
  timeZone?: string;
  className?: string;
};

/** Client-only date text — avoids Cache Components / hydration issues from `new Date()` + `toLocaleString` during SSR. */
export function FormattedDate({
  value,
  locale,
  timeZone = "Asia/Dhaka",
  className,
}: Props) {
  const [text, setText] = useState("");

  useEffect(() => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      setText(value);
      return;
    }
    setText(
      date.toLocaleString(locale === "bn" ? "bn-BD" : "en-GB", {
        timeZone,
        dateStyle: "medium",
        timeStyle: "short",
      }),
    );
  }, [value, locale, timeZone]);

  return (
    <time dateTime={value} className={className} suppressHydrationWarning>
      {text || "…"}
    </time>
  );
}
