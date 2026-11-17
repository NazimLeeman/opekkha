"use server";

import { revalidatePath } from "next/cache";
import { assertRateLimit } from "@/lib/abuse/rate-limit";
import { requireUser } from "@/lib/auth/session";
import { trackEvent } from "@/lib/monitoring/events";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getShareTheme, type ShareThemeId } from "@/lib/letters/share-themes";

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };

async function ensureBucket() {
  if (!isAdminConfigured()) return;
  const admin = createAdminClient();
  const { data } = await admin.storage.listBuckets();
  if (data?.some((b) => b.id === "share-cards")) return;
  await admin.storage.createBucket("share-cards", {
    public: false,
    fileSizeLimit: 5_242_880,
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
  });
}

/** Persist a generated share-card PNG (base64) for the signed-in user. */
export async function persistShareCard(args: {
  letterId?: string | null;
  templateId: ShareThemeId;
  /** raw base64 without data: URL prefix */
  imageBase64: string;
}): Promise<ActionResult<{ id: string; storagePath: string }>> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured" };
  }

  try {
    const user = await requireUser();
    const limited = await assertRateLimit({
      userId: user.id,
      action: "share_card",
      limit: 20,
      windowMinutes: 60,
    });
    if (!limited.ok) return limited;

    getShareTheme(args.templateId);

    if (!isAdminConfigured()) {
      return {
        ok: false,
        error: "Share-card storage needs SUPABASE_SERVICE_ROLE_KEY",
      };
    }

    await ensureBucket();

    const bytes = Buffer.from(args.imageBase64, "base64");
    if (bytes.length < 100 || bytes.length > 5_242_880) {
      return { ok: false, error: "Invalid image size" };
    }

    const path = `${user.id}/${Date.now()}-${args.templateId}.png`;
    const admin = createAdminClient();
    const { error: uploadError } = await admin.storage
      .from("share-cards")
      .upload(path, bytes, {
        contentType: "image/png",
        upsert: false,
      });

    if (uploadError) return { ok: false, error: uploadError.message };

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("share_cards")
      .insert({
        user_id: user.id,
        letter_id: args.letterId || null,
        template_id: args.templateId,
        storage_path: path,
        visibility: "private",
      })
      .select("id")
      .single();

    if (error) return { ok: false, error: error.message };

    trackEvent("share_card_saved", { templateId: args.templateId });
    revalidatePath("/dashboard");
    return {
      ok: true,
      data: { id: data.id as string, storagePath: path },
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not save share card",
    };
  }
}
