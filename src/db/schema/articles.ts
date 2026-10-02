import { json, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import type { Block } from "@/lib/blocks";
import { contentStatus } from "./enums";
import { media } from "./media";
import { teamMembers } from "./team-members";

export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  body: json("body").$type<Block[]>().notNull().default([]),
  /** Named person who reviewed the medical/factual content before publishing. */
  authorReviewer: text("author_reviewer"),
  /**
   * The team member who reviewed it, when they are on /zespol — the article
   * then carries their photo, role and a link to the bio (E-E-A-T, SEO plan
   * §3.1). `authorReviewer` stays for someone from outside the team.
   */
  reviewerId: uuid("reviewer_id").references(() => teamMembers.id, { onDelete: "set null" }),
  coverImageId: uuid("cover_image_id").references(() => media.id, { onDelete: "set null" }),
  status: contentStatus("status").notNull().default("draft"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
