import type { CSSProperties } from "react";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

type Moment = Dictionary["useCases"][number];

type Props = {
  locale: Locale;
  title: string;
  support: string;
  moments: Moment[];
};

const accents: Record<
  Moment["id"],
  { glow: string; chip: string; ring: string }
> = {
  miss: {
    glow: "rgba(140,110,200,0.35)",
    chip: "linear-gradient(145deg,#3d2a5c,#1a1228)",
    ring: "rgba(180,150,230,0.35)",
  },
  sad: {
    glow: "rgba(90,140,190,0.35)",
    chip: "linear-gradient(145deg,#24364a,#121820)",
    ring: "rgba(140,180,220,0.35)",
  },
  birthday: {
    glow: "rgba(224,91,98,0.4)",
    chip: "linear-gradient(145deg,#5a2428,#2a1214)",
    ring: "rgba(240,140,150,0.4)",
  },
  exam: {
    glow: "rgba(232,184,109,0.32)",
    chip: "linear-gradient(145deg,#4a3a20,#1c160c)",
    ring: "rgba(232,184,109,0.4)",
  },
  meet: {
    glow: "rgba(120,160,140,0.32)",
    chip: "linear-gradient(145deg,#243830,#121a16)",
    ring: "rgba(150,190,170,0.35)",
  },
  year: {
    glow: "rgba(200,160,120,0.32)",
    chip: "linear-gradient(145deg,#3a2e24,#16120e)",
    ring: "rgba(210,170,130,0.35)",
  },
};

function MomentMotif({ id }: { id: Moment["id"] }) {
  if (id === "miss") {
    return (
      <svg viewBox="0 0 48 48" className="moment-motif moment-motif-miss" aria-hidden>
        <circle cx="30" cy="18" r="10" fill="currentColor" opacity="0.85" />
        <circle cx="25" cy="16" r="9" fill="var(--paper-raised)" opacity="0.95" />
        <circle cx="14" cy="34" r="1.4" fill="currentColor" opacity="0.7" />
        <circle cx="22" cy="38" r="1" fill="currentColor" opacity="0.55" />
        <circle cx="10" cy="28" r="0.9" fill="currentColor" opacity="0.45" />
      </svg>
    );
  }
  if (id === "sad") {
    return (
      <svg viewBox="0 0 48 48" className="moment-motif moment-motif-sad" aria-hidden>
        <path
          d="M24 8c0 0-10 11-10 18a10 10 0 0020 0C34 19 24 8 24 8Z"
          fill="currentColor"
          opacity="0.75"
        />
        <path
          d="M16 12c0 0-6 7-6 12a6 6 0 0012 0C22 19 16 12 16 12Z"
          fill="currentColor"
          opacity="0.4"
        />
      </svg>
    );
  }
  if (id === "birthday") {
    return (
      <svg viewBox="0 0 48 48" className="moment-motif moment-motif-birthday" aria-hidden>
        <rect x="10" y="22" width="28" height="16" rx="3" fill="currentColor" opacity="0.75" />
        <rect x="14" y="18" width="20" height="6" rx="2" fill="currentColor" opacity="0.45" />
        <rect x="22" y="11" width="4" height="8" rx="1" fill="currentColor" opacity="0.7" />
        <path d="M24 7c2 2 2 4 0 5-2-1-2-3 0-5Z" fill="#e8b86d" className="moment-flame" />
      </svg>
    );
  }
  if (id === "exam") {
    return (
      <svg viewBox="0 0 48 48" className="moment-motif moment-motif-exam" aria-hidden>
        <rect x="12" y="8" width="24" height="32" rx="3" fill="currentColor" opacity="0.7" />
        <path d="M18 16h12M18 22h12M18 28h8" stroke="var(--paper-raised)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="34" cy="34" r="7" fill="#e8b86d" opacity="0.9" />
        <path d="M31.5 34l1.8 1.8 3.4-3.8" stroke="#1c160c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "meet") {
    return (
      <svg viewBox="0 0 48 48" className="moment-motif moment-motif-meet" aria-hidden>
        <path
          d="M10 38V18l14-8 14 8v20H10Z"
          fill="currentColor"
          opacity="0.55"
        />
        <rect x="20" y="26" width="8" height="12" rx="1" fill="var(--paper-raised)" opacity="0.9" />
        <circle cx="26" cy="32" r="0.9" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" className="moment-motif moment-motif-year" aria-hidden>
      <circle cx="24" cy="24" r="14" fill="none" stroke="currentColor" strokeWidth="2.2" opacity="0.55" />
      <circle cx="24" cy="24" r="2.2" fill="currentColor" />
      <path d="M24 24 L24 14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="moment-hand-hour" />
      <path d="M24 24 L32 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="moment-hand-min" />
    </svg>
  );
}

export function MomentCards({ locale, title, support, moments }: Props) {
  return (
    <section className="relative px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2
            className={`${
              locale === "bn" ? "font-brand-bn" : "font-brand-en"
            } text-3xl text-[var(--ink)] sm:text-4xl`}
          >
            {title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--ink-muted)]">
            {support}
          </p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {moments.map((moment, index) => {
            const accent = accents[moment.id];
            return (
              <li
                key={moment.id}
                className="moment-card"
                style={
                  {
                    "--moment-glow": accent.glow,
                    "--moment-ring": accent.ring,
                    animationDelay: `${index * 70}ms`,
                  } as CSSProperties
                }
              >
                <Link
                  href={`/letters/new?prompt=${encodeURIComponent(moment.title)}`}
                  className="moment-card-link group"
                >
                  <span
                    className="moment-card-chip"
                    style={{ background: accent.chip }}
                    aria-hidden
                  >
                    <MomentMotif id={moment.id} />
                    <span className="moment-card-emoji" aria-hidden>
                      {moment.emoji}
                    </span>
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-[1.02rem] leading-snug text-[var(--ink)] ${
                        locale === "bn" ? "font-brand-bn" : "font-medium"
                      }`}
                    >
                      {moment.title}
                    </span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-[var(--ink-muted)]">
                      {moment.body}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
