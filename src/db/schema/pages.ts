import { json, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import type { Block } from "@/lib/blocks";
import { contentStatus, pageType } from "./enums";
import { media } from "./media";

export const pages = pgTable("pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  pageType: pageType("page_type").notNull().default("standard"),
  title: text("title").notNull(),
  status: contentStatus("status").notNull().default("draft"),
  heroTitle: text("hero_title"),
  heroSubtitle: text("hero_subtitle"),
  /** Ordered array of typed blocks — see `src/lib/blocks.ts` for the union. */
  sections: json("sections").$type<Block[]>().notNull().default([]),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  ogImageId: uuid("og_image_id").references(() => media.id, { onDelete: "set null" }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Page = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;
