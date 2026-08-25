import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * One row per file in the R2 bucket. `r2Key` is the object key (needed to
 * delete); `url` is the public custom-domain URL used for delivery.
 */
export const media = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  r2Key: text("r2_key").notNull().unique(),
  url: text("url").notNull(),
  altText: text("alt_text"),
  width: integer("width"),
  height: integer("height"),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
