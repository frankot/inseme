import { json, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import type { Block } from "@/lib/blocks";
import { contentStatus } from "./enums";
import { media } from "./media";

export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  body: json("body").$type<Block[]>().notNull().default([]),
  /** Named person who reviewed the medical/factual content before publishing. */
  authorReviewer: text("author_reviewer"),
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
