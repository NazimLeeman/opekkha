"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createDraftLetter,
  scheduleOrSendLetter,
  updateDraftLetter,
} from "@/app/actions/letters";
import {
  LETTER_PROMPTS,
  LETTER_PROMPTS_BN,
} from "@/lib/letters/schemas";
import { DateTimePicker } from "@/components/letters/datetime-picker";
import { ShareInvitePanel } from "@/components/letters/share-invite-panel";
import type { Locale } from "@/lib/i18n/config";
import type { Letter } from "@/types/database";

type Props = {
  locale: Locale;
  letter?: Letter | null;
  initialTitle?: string;
};

type SaveStatus = "idle" | "dirty" | "saving" | "saved" | "error";

const copy = {
  bn: {
    title: "শিরোনাম / Open when…",
    body: "চিঠির মূল কথা",
    recipient: "প্রাপকের নাম (ঐচ্ছিক)",
    sender: "প্রেরকের নাম (ঐচ্ছিক)",
    prompts: "প্রম্পট বেছে নিন",
    rule: "কখন খোলা যাবে",
    immediate: "এখনই (থিম্যাটিক প্রম্পট)",
    datetime: "নির্দিষ্ট তারিখ/সময়",
    interval: "কয়েক দিন পর",
    days: "দিন সংখ্যা",
    when: "খোলার সময়",
    saveDraft: "খসড়া সংরক্ষণ",
    send: "পাঠান / আমন্ত্রণ তৈরি",
    saving: "সংরক্ষণ হচ্ছে…",
    back: "ড্যাশবোর্ড",
    statusDirty: "সংরক্ষণ হয়নি",
    statusSaving: "অটোসেভ…",
    statusSaved: "সংরক্ষিত",
  },
  en: {
    title: "Title / Open when…",
    body: "Letter body",
    recipient: "Recipient name (optional)",
    sender: "Sender label (optional)",
    prompts: "Starter prompts",
    rule: "When can it open",
    immediate: "Anytime (thematic prompt)",
    datetime: "On a date/time",
    interval: "After an interval",
    days: "Number of days",
    when: "Opens at",
    saveDraft: "Save draft",
    send: "Send / create invite",
    saving: "Saving…",
    back: "Dashboard",
    statusDirty: "Unsaved",
    statusSaving: "Autosaving…",
    statusSaved: "Saved",
  },
} as const;

export function LetterEditor({ locale, letter, initialTitle }: Props) {
  const t = copy[locale];
  const prompts = locale === "bn" ? LETTER_PROMPTS_BN : LETTER_PROMPTS;
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [letterId, setLetterId] = useState(letter?.id ?? "");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(
    letter?.id ? "saved" : "idle",
  );
  const letterIdRef = useRef(letter?.id ?? "");
  const skipAutosave = useRef(true);

  const [title, setTitle] = useState(letter?.title ?? initialTitle ?? "");
  const [body, setBody] = useState(letter?.body ?? "");
  const [recipientName, setRecipientName] = useState(
    letter?.recipient_name ?? "",
  );
  const [senderLabel, setSenderLabel] = useState(letter?.sender_label ?? "");
  const [openingRule, setOpeningRule] = useState<
    "immediate" | "at_datetime" | "after_interval"
  >("immediate");
  const [opensAtLocal, setOpensAtLocal] = useState("");
  const [intervalDays, setIntervalDays] = useState(7);

  const payload = useMemo(
    () => ({
      title,
      prompt: title,
      body,
      recipientName: recipientName || null,
      senderLabel: senderLabel || null,
      allowAcknowledgement: false,
    }),
    [title, body, recipientName, senderLabel],
  );

  useEffect(() => {
    letterIdRef.current = letterId;
  }, [letterId]);

  useEffect(() => {
    if (skipAutosave.current) {
      skipAutosave.current = false;
      return;
    }
    if (!title.trim() || inviteUrl) return;

    setSaveStatus("dirty");
    const timer = window.setTimeout(async () => {
      setSaveStatus("saving");
      const id = letterIdRef.current;
      const result = id
        ? await updateDraftLetter(id, payload)
        : await createDraftLetter(payload);

      if (!result.ok) {
        setSaveStatus("error");
        setError(result.error);
        return;
      }

      setLetterId(result.data.id);
      letterIdRef.current = result.data.id;
      setSaveStatus("saved");
      if (!id) {
        router.replace(`/letters/${result.data.id}/edit`);
      }
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [payload, inviteUrl, router, title]);

  function saveDraft() {
    setError(null);
    setSaveStatus("saving");
    startTransition(async () => {
      const result = letterId
        ? await updateDraftLetter(letterId, payload)
        : await createDraftLetter(payload);

      if (!result.ok) {
        setError(result.error);
        setSaveStatus("error");
        return;
      }

      setLetterId(result.data.id);
      letterIdRef.current = result.data.id;
      setSaveStatus("saved");
      if (!letterId) {
        router.replace(`/letters/${result.data.id}/edit`);
      }
    });
  }

  function sendLetter() {
    setError(null);
    startTransition(async () => {
      let id = letterId;
      if (!id) {
        const created = await createDraftLetter(payload);
        if (!created.ok) {
          setError(created.error);
          return;
        }
        id = created.data.id;
        setLetterId(id);
      } else {
        const updated = await updateDraftLetter(id, payload);
        if (!updated.ok) {
          setError(updated.error);
          return;
        }
      }

      const opensAtIso =
        openingRule === "at_datetime" && opensAtLocal
          ? new Date(opensAtLocal).toISOString()
          : null;

      const result = await scheduleOrSendLetter(id, {
        ...payload,
        openingRule,
        opensAtLocal: opensAtIso,
        intervalDays:
          openingRule === "after_interval" ? intervalDays : null,
        senderTimezone:
          Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Dhaka",
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (result.data.inviteUrl) {
        setInviteUrl(result.data.inviteUrl);
      }
      router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="paper-surface space-y-6 rounded-[1.6rem] p-5 sm:p-7">
        <div className="space-y-2">
          <p className="text-sm text-[var(--seal)]">{t.prompts}</p>
          <div className="flex flex-wrap gap-2">
            {prompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setTitle(prompt)}
                className="rounded-full border border-[var(--ink)]/12 bg-[var(--paper)] px-3 py-1.5 text-left text-sm text-[var(--ink-soft)] transition hover:border-[var(--ink)]/28 hover:text-[var(--ink)]"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <label className="block space-y-1.5">
          <span className="text-sm text-[var(--ink-soft)]">{t.title}</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="field text-lg"
            required
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm text-[var(--ink-soft)]">{t.body}</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={12}
            className="field resize-y leading-relaxed"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-sm text-[var(--ink-soft)]">{t.recipient}</span>
            <input
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="field"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm text-[var(--ink-soft)]">{t.sender}</span>
            <input
              value={senderLabel}
              onChange={(e) => setSenderLabel(e.target.value)}
              className="field"
            />
          </label>
        </div>

        <fieldset className="space-y-4 rounded-[1.1rem] border border-[var(--ink)]/10 bg-[var(--paper)]/80 p-4">
          <legend className="px-1 text-sm text-[var(--ink-soft)]">{t.rule}</legend>
          <div className="opening-rule" role="radiogroup" aria-label={t.rule}>
            {(
              [
                ["immediate", t.immediate],
                ["at_datetime", t.datetime],
                ["after_interval", t.interval],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={openingRule === value}
                data-active={openingRule === value}
                onClick={() => setOpeningRule(value)}
                className="opening-rule-option"
              >
                {label}
              </button>
            ))}
          </div>

          {openingRule === "at_datetime" ? (
            <DateTimePicker
              locale={locale}
              value={opensAtLocal}
              onChange={setOpensAtLocal}
              label={t.when}
            />
          ) : null}

          {openingRule === "after_interval" ? (
            <div className="space-y-2 pt-1">
              <p className="text-sm text-[var(--ink-soft)]">{t.days}</p>
              <div className="interval-stepper">
                <button
                  type="button"
                  aria-label={locale === "bn" ? "কমান" : "Decrease"}
                  onClick={() =>
                    setIntervalDays((d) => Math.max(1, d - 1))
                  }
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  value={intervalDays}
                  onChange={(e) =>
                    setIntervalDays(Math.max(1, Number(e.target.value) || 1))
                  }
                />
                <button
                  type="button"
                  aria-label={locale === "bn" ? "বাড়ান" : "Increase"}
                  onClick={() => setIntervalDays((d) => d + 1)}
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[3, 7, 14, 30, 365].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setIntervalDays(d)}
                    className={`rounded-full px-2.5 py-1 text-[0.72rem] transition ${
                      intervalDays === d
                        ? "bg-[var(--seal)]/15 text-[var(--seal-bright)]"
                        : "text-[var(--ink-muted)] hover:bg-[var(--paper-deep)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {locale === "bn"
                      ? d === 365
                        ? "১ বছর"
                        : `${d} দিন`
                      : d === 365
                        ? "1 year"
                        : `${d} days`}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </fieldset>

        {error ? (
          <p
            role="alert"
            className="rounded-[0.9rem] bg-[var(--seal)]/10 px-3 py-2 text-sm text-[var(--seal)]"
          >
            {error}
          </p>
        ) : null}

        {inviteUrl ? (
          <ShareInvitePanel
            locale={locale}
            inviteUrl={inviteUrl}
            title={title}
            letterId={letterId}
          />
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={pending || !title.trim()}
            onClick={saveDraft}
            className="btn btn-ghost border border-[var(--ink)]/15"
          >
            {pending ? t.saving : t.saveDraft}
          </button>
          <button
            type="button"
            disabled={pending || !title.trim()}
            onClick={sendLetter}
            className="btn btn-primary"
          >
            {pending ? t.saving : t.send}
          </button>
          <a href="/dashboard" className="btn btn-ghost">
            {t.back}
          </a>
          <p
            className={`ml-auto text-xs ${
              saveStatus === "error"
                ? "text-[var(--seal)]"
                : saveStatus === "saved"
                  ? "text-[var(--ink-muted)]"
                  : "text-[var(--accent-warm)]"
            }`}
            aria-live="polite"
          >
            {saveStatus === "dirty"
              ? t.statusDirty
              : saveStatus === "saving"
                ? t.statusSaving
                : saveStatus === "saved"
                  ? t.statusSaved
                  : null}
          </p>
        </div>
      </div>
    </div>
  );
}
