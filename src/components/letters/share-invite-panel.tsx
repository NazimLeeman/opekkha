"use client";

import { useMemo, useState } from "react";
import { persistShareCard } from "@/app/actions/share-cards";
import {
  SHARE_THEMES,
  getShareTheme,
  type ShareTheme,
  type ShareThemeId,
} from "@/lib/letters/share-themes";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  locale: Locale;
  inviteUrl: string;
  title: string;
  letterId?: string | null;
};

const copy = {
  bn: {
    invite: "আমন্ত্রণ লিংক",
    copy: "লিংক কপি",
    copied: "কপি হয়েছে",
    share: "শেয়ার করুন",
    saveImage: "কার্ড সেভ করুন",
    saving: "সেভ হচ্ছে…",
    savedCloud: "ক্লাউডে সংরক্ষিত",
    theme: "থিম",
    storyHint:
      "Facebook Story সরাসরি পোস্ট হয় না—কার্ড সেভ করে Story-তে আপলোড করুন। চিঠির পূর্ণ বার্তা কার্ডে থাকে না।",
    openWhen: "OPEN WHEN",
    tap: "লিংকে খুলুন",
  },
  en: {
    invite: "Invitation link",
    copy: "Copy link",
    copied: "Copied",
    share: "Share",
    saveImage: "Save card image",
    saving: "Saving…",
    savedCloud: "Saved to cloud",
    theme: "Theme",
    storyHint:
      "We can’t post to Facebook Story directly—save the card and upload it yourself. The full letter stays off the card.",
    openWhen: "OPEN WHEN",
    tap: "Open with the link",
  },
} as const;

export function ShareInvitePanel({
  locale,
  inviteUrl,
  title,
  letterId,
}: Props) {
  const t = copy[locale];
  const [themeId, setThemeId] = useState<ShareThemeId>("night-crimson");
  const theme = useMemo(() => getShareTheme(themeId), [themeId]);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [cloudSaved, setCloudSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayTitle =
    title || (locale === "bn" ? "একটি চিঠি" : "A letter");

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError(locale === "bn" ? "কপি করা যায়নি" : "Could not copy");
    }
  }

  async function nativeShare() {
    setError(null);
    if (!navigator.share) {
      await copyLink();
      return;
    }
    try {
      await navigator.share({
        title: title || "Opekkha",
        text:
          locale === "bn"
            ? `অপেক্ষা — ${displayTitle}. লিংকে খুলুন।`
            : `Opekkha — ${displayTitle}. Open with the link.`,
        url: inviteUrl,
      });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(locale === "bn" ? "শেয়ার করা যায়নি" : "Could not share");
    }
  }

  async function saveCardImage() {
    setBusy(true);
    setError(null);
    setCloudSaved(false);
    try {
      const blob = await renderShareCardPng({
        title: displayTitle,
        openWhen: t.openWhen,
        tap: t.tap,
        brand: locale === "bn" ? "অপেক্ষা" : "Opekkha",
        theme,
      });

      downloadBlob(blob, `opekkha-${themeId}.png`);

      try {
        const base64 = await blobToBase64(blob);
        const persisted = await persistShareCard({
          letterId: letterId ?? null,
          templateId: themeId,
          imageBase64: base64,
        });
        if (persisted.ok) setCloudSaved(true);
        else setError(persisted.error);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : locale === "bn"
              ? "ক্লাউডে সেভ হয়নি"
              : "Could not save to cloud",
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : locale === "bn"
            ? "ছবি তৈরি করা যায়নি"
            : "Could not create image",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4 rounded-[1.2rem] border border-[var(--ink)]/10 bg-[var(--paper)]/70 p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div
          className="relative mx-auto aspect-[9/16] w-full max-w-[11.5rem] overflow-hidden rounded-[1.1rem] border border-white/10 shadow-[0_24px_50px_-28px_rgba(0,0,0,0.8)]"
          style={{ background: theme.previewBg.replace(/_/g, " ") }}
          aria-hidden
        >
          <div className="relative flex h-full flex-col items-center px-4 pb-5 pt-6 text-center">
            <p
              className="font-brand-bn text-lg"
              style={{ color: theme.brand }}
            >
              অপেক্ষা
            </p>
            <p
              className="mt-6 text-[0.58rem] tracking-[0.28em]"
              style={{ color: theme.muted }}
            >
              {t.openWhen}
            </p>
            <p
              className="font-brand-bn mt-3 line-clamp-4 text-[0.95rem] leading-snug"
              style={{ color: theme.ink }}
            >
              {displayTitle}
            </p>
            <div className="mt-auto flex flex-col items-center gap-2">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-white/25"
                style={{
                  background: `radial-gradient(circle at 32% 28%, ${theme.seal[0]}, ${theme.seal[1]} 55%, ${theme.seal[2]})`,
                }}
              >
                <span className="font-brand-bn text-base text-[#fff6f0]">অ</span>
              </div>
              <p className="text-[0.62rem]" style={{ color: theme.muted }}>
                {t.tap}
              </p>
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <p className="text-sm text-[var(--ink-soft)]">{t.theme}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SHARE_THEMES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setThemeId(item.id)}
                  className={`rounded-full px-3 py-1.5 text-xs transition ${
                    themeId === item.id
                      ? "bg-[var(--seal)]/18 text-[var(--seal-bright)] ring-1 ring-[var(--seal)]/40"
                      : "text-[var(--ink-muted)] hover:bg-[var(--paper-deep)] hover:text-[var(--ink)]"
                  }`}
                >
                  {locale === "bn" ? item.labelBn : item.labelEn}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-[var(--ink-soft)]">{t.invite}</p>
            <p className="mt-1 break-all text-sm text-[var(--ink)]">{inviteUrl}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyLink}
              className="btn btn-primary min-h-10 px-4 py-2"
            >
              {copied ? t.copied : t.copy}
            </button>
            <button
              type="button"
              onClick={nativeShare}
              className="btn btn-outline min-h-10 px-4 py-2"
            >
              {t.share}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={saveCardImage}
              className="btn btn-ghost min-h-10 border border-[var(--ink)]/12 px-4 py-2"
            >
              {busy ? t.saving : t.saveImage}
            </button>
          </div>
          {cloudSaved ? (
            <p className="text-xs text-[var(--ink-muted)]">{t.savedCloud}</p>
          ) : null}
          <p className="text-xs leading-relaxed text-[var(--ink-muted)]">
            {t.storyHint}
          </p>
          {error ? (
            <p className="text-xs text-[var(--seal)]" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Could not encode image"));
        return;
      }
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(new Error("Could not encode image"));
    reader.readAsDataURL(blob);
  });
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }
      try {
        const dataUrl = canvas.toDataURL("image/png");
        const comma = dataUrl.indexOf(",");
        const binary = atob(comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        resolve(new Blob([bytes], { type: "image/png" }));
      } catch {
        reject(new Error("Could not create image"));
      }
    }, "image/png");
  });
}

function renderShareCardPng(args: {
  title: string;
  openWhen: string;
  tap: string;
  brand: string;
  theme: ShareTheme;
}): Promise<Blob> {
  const width = 1080;
  const height = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.reject(new Error("No canvas"));

  const { theme } = args;
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, theme.canvasStops[0]);
  bg.addColorStop(0.55, theme.canvasStops[1]);
  bg.addColorStop(1, theme.canvasStops[2]);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const glowA = ctx.createRadialGradient(320, 280, 40, 320, 280, 520);
  glowA.addColorStop(0, theme.glowA);
  glowA.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glowA;
  ctx.fillRect(0, 0, width, height);

  const glowB = ctx.createRadialGradient(860, 1400, 40, 860, 1400, 480);
  glowB.addColorStop(0, theme.glowB);
  glowB.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glowB;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = theme.brand;
  ctx.font = "700 72px 'Noto Serif Bengali', Fraunces, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(args.brand, width / 2, 220);

  ctx.fillStyle = theme.muted;
  ctx.font = "500 28px 'Noto Sans Bengali', sans-serif";
  ctx.fillText(args.openWhen, width / 2, 520);

  ctx.fillStyle = theme.ink;
  ctx.font = "600 64px 'Noto Serif Bengali', Fraunces, serif";
  wrapText(ctx, args.title, width / 2, 620, width - 180, 84);

  const sealX = width / 2;
  const sealY = 1580;
  const seal = ctx.createRadialGradient(
    sealX - 24,
    sealY - 28,
    8,
    sealX,
    sealY,
    90,
  );
  seal.addColorStop(0, theme.seal[0]);
  seal.addColorStop(0.55, theme.seal[1]);
  seal.addColorStop(1, theme.seal[2]);
  ctx.beginPath();
  ctx.arc(sealX, sealY, 90, 0, Math.PI * 2);
  ctx.fillStyle = seal;
  ctx.fill();
  ctx.fillStyle = "#fff6f0";
  ctx.font = "700 64px 'Noto Serif Bengali', serif";
  ctx.fillText("অ", sealX, sealY + 22);

  ctx.fillStyle = theme.muted;
  ctx.font = "400 28px 'Noto Sans Bengali', sans-serif";
  ctx.fillText(args.tap, width / 2, 1740);

  return canvasToPngBlob(canvas);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(/\s+/);
  let line = "";
  let yy = y;
  let lines = 0;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy);
      line = word;
      yy += lineHeight;
      lines += 1;
      if (lines >= 4) break;
    } else {
      line = test;
    }
  }
  if (lines < 4 && line) ctx.fillText(line, x, yy);
}
