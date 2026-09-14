import { index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { contentStatus } from "./enums";

/**
 * Photographs shown on /galeria, as their own table rather than rows in
 * `media`.
 *
 * Two reasons. Each photo is *two* objects in R2 — a grid thumbnail and a
 * lightbox-sized full — so one gallery photo would be two `media` rows, and a
 * few hundred photos would bury the handful of covers and OG images that
 * `MediaPicker` exists to let an editor find. And a gallery photo is not a
 * reusable asset: nothing else in the CMS points at one, so it carries its own
 * keys and deletes both objects with itself.
 *
 * Both variants are WebP produced in the browser before upload
 * (`src/lib/gallery-image.ts`). The bucket is served from the r2.dev dev
 * domain, where Cloudflare's `/cdn-cgi/image/` resizing is unavailable — see
 * `src/lib/image-host.ts` — so whatever is uploaded is exactly what a visitor
 * downloads. That is why the sizes are baked in at upload time rather than
 * requested per breakpoint.
 */
export const galleryPhotos = pgTable(
  "gallery_photos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Screen-reader text. Falls back to `description` when empty. */
    altText: text("alt_text"),
    /** The visible caption, under the grid tile and in the lightbox. */
    description: text("description"),

    fullKey: text("full_key").notNull().unique(),
    fullUrl: text("full_url").notNull(),
    fullWidth: integer("full_width").notNull(),
    fullHeight: integer("full_height").notNull(),
    fullSize: integer("full_size").notNull(),

    thumbKey: text("thumb_key").notNull().unique(),
    thumbUrl: text("thumb_url").notNull(),
    thumbWidth: integer("thumb_width").notNull(),
    thumbHeight: integer("thumb_height").notNull(),
    thumbSize: integer("thumb_size").notNull(),

    /** Hand-set order. Everything defaults to 0, which leaves newest first. */
    sortOrder: integer("sort_order").notNull().default(0),
    status: contentStatus("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // The public list is always this exact ordering, filtered to published,
    // and read a page at a time — so it gets its own covering index.
    index("gallery_photos_public_idx").on(table.status, table.sortOrder, table.createdAt),
  ],
);

export type GalleryPhoto = typeof galleryPhotos.$inferSelect;
export type NewGalleryPhoto = typeof galleryPhotos.$inferInsert;
