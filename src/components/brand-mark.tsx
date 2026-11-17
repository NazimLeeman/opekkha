import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  locale: Locale;
  brand: string;
  brandLatin: string;
  href?: string;
  size?: "sm" | "lg";
  showSecondary?: boolean;
};

export function BrandMark({
  locale,
  brand,
  brandLatin,
  href = "/",
  size = "sm",
  showSecondary = true,
}: Props) {
  const primaryClass =
    locale === "bn"
      ? "font-brand-bn"
      : "font-brand-en";

  return (
    <Link href={href} className="group inline-flex flex-col leading-none">
      <span
        suppressHydrationWarning
        className={`${primaryClass} tracking-tight text-[var(--ink)] ${
          size === "lg" ? "text-5xl sm:text-6xl md:text-7xl" : "text-2xl sm:text-[1.7rem]"
        }`}
      >
        {brand}
      </span>
      {showSecondary ? (
        <span
          suppressHydrationWarning
          className={`mt-1.5 text-[var(--ink-muted)] transition group-hover:text-[var(--ink-soft)] ${
            size === "lg" ? "text-sm" : "text-[0.72rem]"
          } ${locale === "bn" ? "font-brand-en tracking-[0.14em]" : "font-brand-bn"}`}
        >
          {brandLatin}
        </span>
      ) : null}
    </Link>
  );
}
