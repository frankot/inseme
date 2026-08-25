"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { settings, SETTINGS_ID } from "@/db/schema";
import { actionError, type ActionResult } from "@/lib/action-result";
import { requireAdmin } from "@/lib/auth-guard";
import { emptyToNull, settingsSchema, type SettingsInput } from "@/lib/validations/content";

export async function saveSettings(input: SettingsInput): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = settingsSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
    }

    const socialLinks = Object.fromEntries(
      Object.entries(parsed.data.socialLinks).filter(([, value]) => Boolean(value)),
    );

    const values = {
      phone: emptyToNull(parsed.data.phone),
      secondaryPhone: emptyToNull(parsed.data.secondaryPhone),
      email: emptyToNull(parsed.data.email),
      address: emptyToNull(parsed.data.address),
      hours: emptyToNull(parsed.data.hours),
      whatsapp: emptyToNull(parsed.data.whatsapp),
      privacyNote: emptyToNull(parsed.data.privacyNote),
      consentBannerText: emptyToNull(parsed.data.consentBannerText),
      defaultOgImageId: parsed.data.defaultOgImageId,
      socialLinks,
      updatedAt: new Date(),
    };

    await db
      .insert(settings)
      .values({ id: SETTINGS_ID, ...values })
      .onConflictDoUpdate({ target: settings.id, set: values });

    revalidatePath("/admin/settings");
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się zapisać ustawień.");
  }
}
