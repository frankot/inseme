import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { contentStatus } from "./enums";
import { media } from "./media";

export const teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  role: text("role"),
  qualifications: text("qualifications"),
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
