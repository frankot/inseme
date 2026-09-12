import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { contactStatus, preferredContact } from "./enums";

/**
 * The standalone e-mail-capture widget. Screening-test e-mails are NOT copied
 * here — the leads export unions both tables at query time instead, so one
 * address never lives in two places (see `src/lib/queries/leads.ts`).
 */
export const leadSignups = pgTable("lead_signups", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  /** Where the widget was rendered, so the export shows what actually converts. */
  source: text("source"),
  consentAt: timestamp("consent_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  phone: text("phone"),
  email: text("email"),
  message: text("message").notNull(),
  preferredContactMethod: preferredContact("preferred_contact_method").notNull().default("phone"),
  consentAt: timestamp("consent_at", { withTimezone: true }).notNull().defaultNow(),
  status: contactStatus("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export type LeadSignup = typeof leadSignups.$inferSelect;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
