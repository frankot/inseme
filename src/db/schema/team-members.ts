import { integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { contentStatus } from "./enums";
import { media } from "./media";

/** A professional licence or certificate, shown on the person's page. */
export type TeamLicense = { name: string; number: string };

export const teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  /** Public URL segment: /zespol/<slug>. Editable, so a corrected name keeps the old link. */
  slug: text("slug").notNull().unique(),
  role: text("role"),
  qualifications: text("qualifications"),
  /** Optional; e.g. „Certyfikat specjalisty psychoterapii uzależnień” + its number. */
  licenses: jsonb("licenses").$type<TeamLicense[]>().notNull().default([]),
  shortBio: text("short_bio"),
  longBio: text("long_bio"),
  photoId: uuid("photo_id").references(() => media.id, { onDelete: "set null" }),
  sortOrder: integer("sort_order").notNull().default(0),
  status: contentStatus("status").notNull().default("draft"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
