/**
 * The site-wide values editors control under /admin/ustawienia, with the copy
 * the site shipped with as defaults. `getSiteSettings()` falls back to these
 * field by field, and `npm run seed:settings` writes them into an empty row.
 */

import { contactDefaults, type SiteContact } from "./home";

export type SocialLinks = {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
};

export type OgImage = { url: string; width: number; height: number; alt: string };

export type SiteSettings = {
  contact: SiteContact;
  socialLinks: SocialLinks;
  /** The consent line under every contact form. */
  privacyNote: string;
  /** The body of the analytics consent banner. */
  consentBannerText: string;
  ogImage: OgImage;
};

/** Checked in, so a link preview works before anything is uploaded. */
export const DEFAULT_OG_IMAGE: OgImage = {
  url: "/og-default.jpg",
  width: 1200,
  height: 630,
  alt: "Insieme — prywatny ośrodek leczenia uzależnień w Magdalence pod Warszawą",
};

export const siteSettingsDefaults: SiteSettings = {
  contact: contactDefaults,
  socialLinks: {},
  privacyNote:
    "Zgadzam się na kontakt w sprawie tej wiadomości. Adresu i numeru nie używamy do niczego innego.",
  consentBannerText:
    "Z Twoją zgodą Google Analytics zapisze, które strony są czytane i czy ktoś zadzwonił z telefonu. Nie wysyłamy treści wiadomości, odpowiedzi z testów ani niczego do reklam. Bez zgody strona działa tak samo.",
  ogImage: DEFAULT_OG_IMAGE,
};

/** The settings row stores the address as one text field, one line per row. */
export function joinAddress(contact: Pick<SiteContact, "addressLine1" | "addressLine2">): string {
  return [contact.addressLine1, contact.addressLine2].filter(Boolean).join("\n");
}

export function splitAddress(address: string): Pick<SiteContact, "addressLine1" | "addressLine2"> {
  const [line1 = "", ...rest] = address
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  return { addressLine1: line1, addressLine2: rest.join(", ") };
}
