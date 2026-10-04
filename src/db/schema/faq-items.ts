import { boolean, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { contentStatus } from "./enums";

export const faqItems = pgTable("faq_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category"),
  sortOrder: integer("sort_order").notNull().default(0),
  /** Shown in the homepage FAQ section; capped at `FAQ_FEATURED_MAX`. */
  featured: boolean("featured").notNull().default(false),
  status: contentStatus("status").notNull().default("draft"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type FaqItem = typeof faqItems.$inferSelect;
export type NewFaqItem = typeof faqItems.$inferInsert;
