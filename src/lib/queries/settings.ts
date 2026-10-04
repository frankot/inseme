import "server-only";

import { eq } from "drizzle-orm";
import { cache } from "react";

import { db } from "@/db";
import { media, settings, SETTINGS_ID } from "@/db/schema";
import { contactDefaults, type SiteContact } from "@/content/home";
import {
  siteSettingsDefaults as defaults,
  splitAddress,
  type SiteSettings,
} from "@/content/settings";

/**
 * The `settings` singleton as the public site uses it — contact details,
 * social links, the consent copy and the default share image.
 *
 * Falls back field by field to `siteSettingsDefaults`, so an empty row (or one
 * an editor half-filled) never puts a blank phone number in front of someone
 * who needs it; a failed read falls back to all of them, like the CMS does.
 * Cached per request: the header, footer, JSON-LD and metadata all ask.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const row = await db.query.settings.findFirst({ where: eq(settings.id, SETTINGS_ID) });
    if (!row) return defaults;

    const ogMedia = row.defaultOgImageId
      ? await db.query.media.findFirst({ where: eq(media.id, row.defaultOgImageId) })
      : null;

    const phone = row.phone?.trim() || contactDefaults.phone;
    const address = row.address?.trim() ? splitAddress(row.address) : null;
    const contact: SiteContact = {
      phone,
      // `tel:` needs digits; editors type the spaced, readable form.
      phoneHref: toTelHref(phone),
      email: row.email?.trim() || contactDefaults.email,
      addressLine1: address?.addressLine1 || contactDefaults.addressLine1,
      addressLine2: address?.addressLine2 || contactDefaults.addressLine2,
      // Empty on purpose until the client confirms hours — see contactDefaults.
      hours: row.hours?.trim() ?? "",
    };

    return {
      contact,
      socialLinks: row.socialLinks ?? {},
      privacyNote: row.privacyNote?.trim() || defaults.privacyNote,
      consentBannerText: row.consentBannerText?.trim() || defaults.consentBannerText,
      ogImage: ogMedia
        ? {
            url: ogMedia.url,
            width: ogMedia.width ?? defaults.ogImage.width,
            height: ogMedia.height ?? defaults.ogImage.height,
            alt: ogMedia.altText || defaults.ogImage.alt,
          }
        : defaults.ogImage,
    };
  } catch (error) {
    console.error("[settings-fallback] DB read failed, using defaults", error);
    return defaults;
  }
});

/**
 * Contact details for anything server-side that needs them — pages, result
 * e-mails, the PDF, contact-form notifications.
 */
export async function getSiteContact(): Promise<SiteContact> {
  return (await getSiteSettings()).contact;
}

/** Where staff notifications go: the settings e-mail, or NOTIFY_EMAIL as override. */
export async function getNotifyEmail(): Promise<string | null> {
  const { env } = await import("@/lib/env");
  if (env.NOTIFY_EMAIL) return env.NOTIFY_EMAIL;
  const contact = await getSiteContact();
  return contact.email || null;
}

/** "669 916 005" → "+48669916005"; an already-prefixed number is left alone. */
export function toTelHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  return digits.length === 9 ? `+48${digits}` : digits;
}
