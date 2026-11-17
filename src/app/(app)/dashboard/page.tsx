import Link from "next/link";
import { Suspense } from "react";
import { listOwnLetters } from "@/app/actions/letters";
import { getSessionUser } from "@/lib/auth/session";
import { BrandMark } from "@/components/brand-mark";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LocaleGate } from "@/components/locale-gate";
import { ThemeSwitcherGate } from "@/components/theme-switcher-gate";
import { FormattedDate } from "@/components/formatted-date";
import { RevokeButton } from "@/components/letters/revoke-button";
import type { Locale } from "@/lib/i18n/config";
import type { Letter } from "@/types/database";

function DashboardFallback() {
  return (
    <div className="relative min-h-full">
      <div className="atmosphere absolute inset-0" />
      <div className="relative mx-auto max-w-3xl px-5 py-16">
        <div className="h-10 w-56 animate-pulse rounded bg-[var(--paper-deep)]" />
        <div className="mt-4 h-4 w-80 animate-pulse rounded bg-[var(--paper-deep)]" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <LocaleGate fallback={<DashboardFallback />}>
      {({ locale, dictionary }) => (
        <div className="relative min-h-full">
          <div className="atmosphere pointer-events-none absolute inset-0" />
          <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8">
            <BrandMark
              locale={locale}
              brand={dictionary.brand}
              brandLatin={dictionary.brandLatin}
              showSecondary={false}
            />
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeSwitcherGate
                label={dictionary.theme}
                darkLabel={dictionary.themeDark}
                lightLabel={dictionary.themeLight}
              />
              <LanguageSwitcher locale={locale} label={dictionary.language} />
              <Link href="/letters/new" className="btn btn-primary min-h-10 px-4 py-2">
                {dictionary.ctaWrite}
              </Link>
            </div>
          </header>

          <main className="relative z-10 mx-auto max-w-3xl px-5 pb-20 pt-6 sm:px-8">
            <h1
              className={`${
                locale === "bn" ? "font-brand-bn" : "font-brand-en"
              } text-3xl text-[var(--ink)] sm:text-4xl`}
            >
              {dictionary.dashboardTitle}
            </h1>
            <Suspense
              fallback={
                <p className="mt-6 text-[var(--ink-muted)]">
                  {dictionary.dashboardEmpty}
                </p>
              }
            >
              <DashboardLetters empty={dictionary.dashboardEmpty} locale={locale} />
            </Suspense>
          </main>
        </div>
      )}
    </LocaleGate>
  );
}

async function DashboardLetters({
  empty,
  locale,
}: {
  empty: string;
  locale: Locale;
}) {
  const [result, user] = await Promise.all([listOwnLetters(), getSessionUser()]);

  if (!result.ok) {
    return (
      <div className="mt-8 rounded-[1.4rem] border border-dashed border-[var(--ink)]/20 bg-[var(--paper-raised)]/80 p-6">
        <p className="text-[var(--ink-muted)]">{empty}</p>
        <p className="mt-3 text-sm text-[var(--seal)]">{result.error}</p>
        <Link href="/letters/new" className="btn btn-ghost mt-4 px-0">
          Write a letter
        </Link>
      </div>
    );
  }

  const letters = result.data;
  if (letters.length === 0) {
    return (
      <div className="mt-8 rounded-[1.4rem] border border-dashed border-[var(--ink)]/20 bg-[var(--paper-raised)]/80 p-6">
        <p className="text-[var(--ink-muted)]">{empty}</p>
        <Link href="/letters/new" className="btn btn-primary mt-4">
          Write a letter
        </Link>
      </div>
    );
  }

  const uid = user?.id ?? "";
  const mine = letters.filter((l) => l.sender_id === uid);
  const received = letters.filter(
    (l) => l.recipient_id === uid && l.sender_id !== uid,
  );

  const groups: {
    key: string;
    label: string;
    items: Letter[];
    showRevoke?: boolean;
    hrefFor: (letter: Letter) => string;
  }[] = [
    {
      key: "draft",
      label: locale === "bn" ? "খসড়া" : "Drafts",
      items: mine.filter((l) => l.status === "draft"),
      hrefFor: (l) => `/letters/${l.id}/edit`,
    },
    {
      key: "scheduled",
      label: locale === "bn" ? "নির্ধারিত" : "Scheduled",
      items: mine.filter((l) => l.status === "scheduled"),
      showRevoke: true,
      hrefFor: (l) => `/letters/${l.id}/edit`,
    },
    {
      key: "sent",
      label: locale === "bn" ? "পাঠানো / প্রস্তুত" : "Sent / ready",
      items: mine.filter((l) => ["available", "opened"].includes(l.status)),
      showRevoke: true,
      hrefFor: (l) => `/letters/${l.id}/edit`,
    },
    {
      key: "received",
      label: locale === "bn" ? "প্রাপ্ত" : "Received",
      items: received.filter((l) =>
        ["available", "opened", "scheduled"].includes(l.status),
      ),
      hrefFor: (l) => `/dashboard`,
    },
    {
      key: "revoked",
      label: locale === "bn" ? "বাতিল" : "Revoked",
      items: mine.filter((l) => l.status === "revoked"),
      hrefFor: (l) => `/letters/${l.id}/edit`,
    },
  ];

  return (
    <div className="mt-10 space-y-10">
      {groups.map((group) => (
        <section key={group.key}>
          <h2 className="text-sm text-[var(--ink-muted)]">{group.label}</h2>
          {group.items.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--ink-muted)]">—</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {group.items.map((letter) => (
                <li
                  key={letter.id}
                  className="flex items-center gap-3 rounded-[1.1rem] border border-[var(--ink)]/10 bg-[var(--paper-raised)]/85 px-4 py-3"
                >
                  <Link
                    href={group.hrefFor(letter)}
                    className="min-w-0 flex-1 transition hover:opacity-90"
                  >
                    <p className="truncate text-[var(--ink)]">{letter.title}</p>
                    <p className="text-xs text-[var(--ink-muted)]">
                      {letter.status}
                      {letter.opens_at ? (
                        <>
                          {" · "}
                          <FormattedDate
                            value={letter.opens_at}
                            locale={locale}
                          />
                        </>
                      ) : null}
                    </p>
                  </Link>
                  {group.showRevoke ? (
                    <RevokeButton letterId={letter.id} locale={locale} />
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
