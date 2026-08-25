import { json, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { media } from "./media";

export type SocialLinks = {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
};

/**
 * Singleton: exactly one row, keyed by the literal id "singleton" so the app
 * can upsert without first querying for an id.
 */
export const settings = pgTable("settings", {
  id: text("id").primaryKey().default("singleton"),
  phone: text("phone"),
  secondaryPhone: text("secondary_phone"),
  email: text("email"),
  address: text("address"),
  hours: text("hours"),
  whatsapp: text("whatsapp"),
  socialLinks: json("social_links").$type<SocialLinks>().notNull().default({}),
  privacyNote: text("privacy_note"),
  consentBannerText: text("consent_banner_text"),
  defaultOgImageId: uuid("default_og_image_id").references(() => media.id, {
    onDelete: "set null",
  }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const SETTINGS_ID = "singleton";

export type Settings = typeof settings.$inferSelect;
export type NewSettings = typeof settings.$inferInsert;
