"use client";

import { useEffect, useState, useTransition } from "react";
import { setTheme } from "@/app/actions/theme";
import { defaultTheme, type Theme } from "@/lib/theme/config";

type Props = {
  label: string;
  darkLabel: string;
  lightLabel: string;
  /** Server-resolved cookie theme — keeps SSR/client markup aligned. */
  initialTheme?: Theme;
};

function readTheme(): Theme {
  const value = document.documentElement.getAttribute("data-theme");
  return value === "light" ? "light" : "dark";
}

export function ThemeSwitcher({
  label,
  darkLabel,
  lightLabel,
  initialTheme = defaultTheme,
}: Props) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const fromDom = readTheme();
    if (fromDom !== theme) setThemeState(fromDom);
    // Sync once after mount if the boot script and cookie SSR diverge.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional mount-only sync
  }, []);

  function apply(next: Theme) {
    document.documentElement.setAttribute("data-theme", next);
    setThemeState(next);
    startTransition(async () => {
      await setTheme(next);
    });
  }

  return (
    <div
      className="inline-flex items-center rounded-full border border-[var(--ink)]/12 bg-[var(--paper-raised)]/70 p-0.5 text-sm"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        disabled={pending}
        onClick={() => apply("dark")}
        className={`rounded-full px-2.5 py-1.5 transition ${
          theme === "dark"
            ? "bg-[var(--ink)] text-[var(--on-ink)]"
            : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
        }`}
        aria-pressed={theme === "dark"}
        title={darkLabel}
      >
        {darkLabel}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => apply("light")}
        className={`rounded-full px-2.5 py-1.5 transition ${
          theme === "light"
            ? "bg-[var(--ink)] text-[var(--on-ink)]"
            : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
        }`}
        aria-pressed={theme === "light"}
        title={lightLabel}
      >
        {lightLabel}
      </button>
    </div>
  );
}
