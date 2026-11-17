"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { isSupabaseConfigured } from "@/lib/supabase/client";

type Mode = "login" | "signup";

type Props = {
  mode: Mode;
  dictionary: Dictionary;
};

export function AuthForm({ mode, dictionary }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const displayName = String(form.get("display_name") ?? "");

    if (!isSupabaseConfigured()) {
      setError(
        "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local",
      );
      setPending(false);
      return;
    }

    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
              preferred_locale: document.documentElement.lang || "bn",
            },
          },
        });
        if (signUpError) throw signUpError;
        window.location.href = "/dashboard";
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {mode === "signup" ? (
        <label className="block space-y-1.5 text-sm">
          <span className="text-[var(--ink-soft)]">
            {dictionary.displayNameLabel}
          </span>
          <input name="display_name" required className="field" />
        </label>
      ) : null}

      <label className="block space-y-1.5 text-sm">
        <span className="text-[var(--ink-soft)]">{dictionary.emailLabel}</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="field"
        />
      </label>

      <label className="block space-y-1.5 text-sm">
        <span className="text-[var(--ink-soft)]">{dictionary.passwordLabel}</span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          className="field"
        />
      </label>

      {error ? (
        <p
          role="alert"
          className="rounded-[0.9rem] bg-[var(--seal)]/10 px-3 py-2 text-sm text-[var(--seal)]"
        >
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="btn btn-primary w-full">
        {mode === "login" ? dictionary.submitLogin : dictionary.submitSignup}
      </button>
    </form>
  );
}
