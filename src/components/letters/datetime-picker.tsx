"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  locale: Locale;
  value: string;
  onChange: (value: string) => void;
  label: string;
};

const WEEKDAYS_BN = ["র", "সো", "ম", "বু", "বৃ", "শু", "শ"];
const WEEKDAYS_EN = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const MONTHS_BN = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

const MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toLocalValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function parseLocal(value: string): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDisplay(date: Date, locale: Locale) {
  const months = locale === "bn" ? MONTHS_BN : MONTHS_EN;
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  if (locale === "bn") return `${day} ${month} ${year} · ${time}`;
  return `${month} ${day}, ${year} · ${time}`;
}

export function DateTimePicker({ locale, value, onChange, label }: Props) {
  const selected = parseLocal(value);
  /** null until mount — avoids Cache Components `new Date()` during SSR. */
  const [today, setToday] = useState<Date | null>(null);
  const [view, setView] = useState(() =>
    startOfMonth(selected ?? new Date(Date.UTC(2026, 0, 1))),
  );
  const [hour, setHour] = useState(() => selected?.getHours() ?? 9);
  const [minute, setMinute] = useState(() => {
    const m = selected?.getMinutes() ?? 0;
    return Math.round(m / 5) * 5;
  });

  useEffect(() => {
    const now = new Date();
    setToday(now);
    if (!selected) setView(startOfMonth(now));
  }, [selected]);

  const weekdays = locale === "bn" ? WEEKDAYS_BN : WEEKDAYS_EN;
  const months = locale === "bn" ? MONTHS_BN : MONTHS_EN;

  const cells = useMemo(() => {
    const first = startOfMonth(view);
    const startPad = first.getDay();
    const daysInMonth = new Date(
      view.getFullYear(),
      view.getMonth() + 1,
      0,
    ).getDate();
    const items: Array<{ date: Date; inMonth: boolean } | null> = [];
    for (let i = 0; i < startPad; i++) items.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      items.push({
        date: new Date(view.getFullYear(), view.getMonth(), day),
        inMonth: true,
      });
    }
    while (items.length % 7 !== 0) items.push(null);
    return items;
  }, [view]);

  function applyDate(day: Date) {
    const next = new Date(day);
    next.setHours(hour, minute, 0, 0);
    onChange(toLocalValue(next));
  }

  function applyTime(nextHour: number, nextMinute: number) {
    setHour(nextHour);
    setMinute(nextMinute);
    const base = selected ?? today ?? new Date();
    const next = new Date(base);
    next.setHours(nextHour, nextMinute, 0, 0);
    onChange(toLocalValue(next));
  }

  function shiftMonth(delta: number) {
    setView(new Date(view.getFullYear(), view.getMonth() + delta, 1));
  }

  function quickPick(daysFromNow: number) {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    d.setHours(hour, minute, 0, 0);
    setView(startOfMonth(d));
    onChange(toLocalValue(d));
  }

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  return (
    <div className="datetime-picker space-y-3 pt-1">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-sm text-[var(--ink-soft)]">{label}</p>
          <p className="mt-1 font-brand-en text-[1.05rem] text-[var(--ink)]">
            {selected
              ? formatDisplay(selected, locale)
              : locale === "bn"
                ? "তারিখ ও সময় বেছে নিন"
                : "Pick a date & time"}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              [1, locale === "bn" ? "কাল" : "Tomorrow"],
              [7, locale === "bn" ? "১ সপ্তাহ" : "1 week"],
              [30, locale === "bn" ? "১ মাস" : "1 month"],
              [365, locale === "bn" ? "১ বছর" : "1 year"],
            ] as const
          ).map(([days, text]) => (
            <button
              key={days}
              type="button"
              onClick={() => quickPick(days)}
              className="rounded-full border border-[var(--ink)]/12 bg-[var(--paper-raised)] px-2.5 py-1 text-[0.72rem] text-[var(--ink-muted)] transition hover:border-[var(--seal)]/35 hover:text-[var(--ink)]"
            >
              {text}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.15rem] border border-[var(--ink)]/10 bg-[var(--paper-raised)] shadow-[0_18px_40px_-28px_rgba(0,0,0,0.55)]">
        <div className="flex items-center justify-between border-b border-[var(--ink)]/8 px-3 py-2.5">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--ink-muted)] transition hover:bg-[var(--paper-deep)] hover:text-[var(--ink)]"
            aria-label={locale === "bn" ? "আগের মাস" : "Previous month"}
          >
            ‹
          </button>
          <p className="text-sm font-medium text-[var(--ink)]">
            {months[view.getMonth()]} {view.getFullYear()}
          </p>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--ink-muted)] transition hover:bg-[var(--paper-deep)] hover:text-[var(--ink)]"
            aria-label={locale === "bn" ? "পরের মাস" : "Next month"}
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 gap-y-1 px-2.5 pb-1 pt-2.5 text-center">
          {weekdays.map((d) => (
            <span
              key={d}
              className="pb-1 text-[0.68rem] font-medium tracking-wide text-[var(--ink-muted)]"
            >
              {d}
            </span>
          ))}
          {cells.map((cell, index) => {
            if (!cell) {
              return <span key={`empty-${index}`} className="h-10" />;
            }
            const isSelected = selected ? sameDay(cell.date, selected) : false;
            const isToday = today ? sameDay(cell.date, today) : false;
            const isPast = today
              ? cell.date <
                new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate(),
                )
              : false;

            return (
              <button
                key={cell.date.toISOString()}
                type="button"
                disabled={isPast}
                onClick={() => applyDate(cell.date)}
                className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm transition ${
                  isSelected
                    ? "bg-[radial-gradient(circle_at_32%_28%,#e07a7e,#9a3d42_70%,#5a2428)] text-[#fff6f0] shadow-[0_0_18px_-4px_rgba(224,91,98,0.7)]"
                    : isToday
                      ? "ring-1 ring-[var(--seal)]/45 text-[var(--ink)] hover:bg-[var(--paper-deep)]"
                      : isPast
                        ? "cursor-not-allowed text-[var(--ink-muted)]/35"
                        : "text-[var(--ink-soft)] hover:bg-[var(--paper-deep)] hover:text-[var(--ink)]"
                }`}
              >
                {cell.date.getDate()}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-[var(--ink)]/8 bg-[var(--paper)]/55 px-3 py-3">
          <p className="text-xs text-[var(--ink-muted)]">
            {locale === "bn" ? "সময়" : "Time"}
          </p>
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="opekkha-hour">
              {locale === "bn" ? "ঘণ্টা" : "Hour"}
            </label>
            <select
              id="opekkha-hour"
              value={hour}
              onChange={(e) => applyTime(Number(e.target.value), minute)}
              className="datetime-select"
            >
              {hours.map((h) => (
                <option key={h} value={h}>
                  {pad(h)}
                </option>
              ))}
            </select>
            <span className="text-[var(--ink-muted)]">:</span>
            <label className="sr-only" htmlFor="opekkha-minute">
              {locale === "bn" ? "মিনিট" : "Minute"}
            </label>
            <select
              id="opekkha-minute"
              value={minute}
              onChange={(e) => applyTime(hour, Number(e.target.value))}
              className="datetime-select"
            >
              {minutes.map((m) => (
                <option key={m} value={m}>
                  {pad(m)}
                </option>
              ))}
            </select>
          </div>
          <div className="ml-auto flex gap-1.5">
            {[9, 12, 18, 21].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => applyTime(h, 0)}
                className={`rounded-full px-2.5 py-1 text-[0.7rem] transition ${
                  hour === h && minute === 0
                    ? "bg-[var(--seal)]/15 text-[var(--seal-bright)]"
                    : "text-[var(--ink-muted)] hover:bg-[var(--paper-deep)] hover:text-[var(--ink)]"
                }`}
              >
                {pad(h)}:00
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
