import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { LocaleGate } from "@/components/locale-gate";

function AuthFallback() {
  return (
    <div className="relative min-h-full flex-1">
      <div className="atmosphere absolute inset-0" />
      <div className="relative mx-auto max-w-md px-5 py-24">
        <div className="h-10 w-48 animate-pulse rounded bg-[var(--paper-deep)]" />
        <div className="mt-4 h-4 w-64 animate-pulse rounded bg-[var(--paper-deep)]" />
        <div className="mt-8 h-40 animate-pulse rounded-2xl bg-[var(--paper-deep)]" />
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <LocaleGate fallback={<AuthFallback />}>
      {({ locale, dictionary }) => (
        <AuthShell
          locale={locale}
          dictionary={dictionary}
          title={dictionary.signupTitle}
          support={dictionary.signupSupport}
        >
          <AuthForm mode="signup" dictionary={dictionary} />
          <p className="text-sm text-[var(--ink-muted)]">
            <Link href="/login" className="underline underline-offset-4">
              {dictionary.navLogin}
            </Link>
          </p>
        </AuthShell>
      )}
    </LocaleGate>
  );
}
