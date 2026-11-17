import Link from "next/link";
import { redirect } from "next/navigation";
import { listAdminReports } from "@/app/actions/admin-reports";
import { ReportReviewActions } from "@/components/admin/report-review-actions";
import { BrandMark } from "@/components/brand-mark";
import { FormattedDate } from "@/components/formatted-date";
import { LocaleGate } from "@/components/locale-gate";
import { getAdminUser } from "@/lib/auth/admin";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  searchParams: Promise<{ all?: string }>;
};

export default function AdminReportsPage({ searchParams }: Props) {
  return (
    <LocaleGate
      fallback={
        <div className="mx-auto max-w-3xl px-5 py-16">
          <div className="h-8 w-48 animate-pulse rounded bg-[var(--paper-deep)]" />
        </div>
      }
    >
      {({ locale, dictionary }) => (
        <AdminReportsInner
          locale={locale}
          dictionary={dictionary}
          searchParams={searchParams}
        />
      )}
    </LocaleGate>
  );
}

async function AdminReportsInner({
  locale,
  dictionary,
  searchParams,
}: {
  locale: Locale;
  dictionary: Dictionary;
  searchParams: Promise<{ all?: string }>;
}) {
  const admin = await getAdminUser();
  if (!admin) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const showAll = params.all === "1";
  const result = await listAdminReports(showAll ? "all" : "open");
  const copy =
    locale === "bn"
      ? {
          title: "রিপোর্ট রিভিউ",
          empty: "কোনো খোলা রিপোর্ট নেই।",
          error: "লোড করা যায়নি",
          letter: "চিঠি",
          reason: "কারণ",
          details: "বিস্তারিত",
          status: "স্থিতি",
          all: "সব দেখুন",
          openOnly: "শুধু খোলা",
        }
      : {
          title: "Report review",
          empty: "No open reports.",
          error: "Could not load reports",
          letter: "Letter",
          reason: "Reason",
          details: "Details",
          status: "Status",
          all: "Show all",
          openOnly: "Open only",
        };

  return (
    <div className="relative min-h-full">
      <div className="atmosphere pointer-events-none absolute inset-0" />
      <header className="relative z-10 flex items-center justify-between gap-3 px-5 py-5 sm:px-8">
        <BrandMark
          locale={locale}
          brand={dictionary.brand}
          brandLatin={dictionary.brandLatin}
          showSecondary={false}
        />
        <Link href="/dashboard" className="btn btn-ghost min-h-10 px-3">
          {dictionary.navDashboard}
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-5 pb-20 pt-4 sm:px-8">
        <h1
          suppressHydrationWarning
          className={`${
            locale === "bn" ? "font-brand-bn" : "font-brand-en"
          } text-3xl text-[var(--ink)]`}
        >
          {copy.title}
        </h1>

        {!result.ok ? (
          <p className="mt-6 text-[var(--seal)]" role="alert">
            {copy.error}: {result.error}
          </p>
        ) : result.data.length === 0 ? (
          <p className="mt-8 text-[var(--ink-muted)]">{copy.empty}</p>
        ) : (
          <ul className="mt-8 space-y-4">
            {result.data.map((report) => (
              <li
                key={report.id}
                className="rounded-[1.2rem] border border-[var(--ink)]/10 bg-[var(--paper-raised)]/85 p-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm text-[var(--ink)]">
                    <span className="text-[var(--ink-muted)]">{copy.reason}: </span>
                    {report.reason}
                  </p>
                  <p className="text-xs text-[var(--ink-muted)]">
                    {copy.status}: {report.status} ·{" "}
                    <FormattedDate value={report.created_at} locale={locale} />
                  </p>
                </div>
                {report.details ? (
                  <p className="mt-2 text-sm text-[var(--ink-soft)]">
                    <span className="text-[var(--ink-muted)]">
                      {copy.details}:{" "}
                    </span>
                    {report.details}
                  </p>
                ) : null}
                {report.letter_id ? (
                  <p className="mt-2 font-mono text-xs text-[var(--ink-muted)]">
                    {copy.letter}: {report.letter_id}
                  </p>
                ) : null}
                {report.status === "open" || report.status === "reviewing" ? (
                  <ReportReviewActions reportId={report.id} locale={locale} />
                ) : null}
              </li>
            ))}
          </ul>
        )}

        <p className="mt-8">
          <Link
            href={showAll ? "/admin/reports" : "/admin/reports?all=1"}
            className="text-sm text-[var(--ink-muted)] underline-offset-4 hover:text-[var(--ink)] hover:underline"
          >
            {showAll ? copy.openOnly : copy.all}
          </Link>
        </p>
      </main>
    </div>
  );
}
