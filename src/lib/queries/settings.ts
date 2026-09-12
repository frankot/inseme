import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { settings, SETTINGS_ID } from "@/db/schema";
import { contactDefaults, type SiteContact } from "@/content/home";

/**
 * Contact details for anything server-side that needs them — result e-mails,
 * the PDF, contact-form notifications.
 *
 * Falls back field by field to `contactDefaults`, so an empty settings row (or
 * one an editor half-filled) never puts a blank phone number in front of
 * someone who needs it.
 */
export async function getSiteContact(): Promise<SiteContact> {
  const row = await db.query.settings.findFirst({
    where: eq(settings.id, SETTINGS_ID),
  });
  if (!row) return contactDefaults;

  const phone = row.phone?.trim() || contactDefaults.phone;
  return {
    phone,
    // `tel:` needs digits; editors type the spaced, readable form.
    phoneHref: toTelHref(phone),
    email: row.email?.trim() || contactDefaults.email,
    addressLine1: row.address?.trim() || contactDefaults.addressLine1,
    addressLine2: contactDefaults.addressLine2,
    hours: row.hours?.trim() || contactDefaults.hours,
  };
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
