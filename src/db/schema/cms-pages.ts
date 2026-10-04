import { integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import type { PageDoc } from "@/cms/types";
import { adminUsers } from "./admin-users";

/**
 * One row per CMS page (plans/CMS_PLAN.md §2.1). `published` is what the site
 * renders; `draft` holds unpublished edits and is null when there are none.
 * A page with no row, or with `published` null, renders its seed from code.
 */
export const cmsPages = pgTable("cms_pages", {
  key: text("key").primaryKey(),
  draft: jsonb("draft").$type<PageDoc>(),
  published: jsonb("published").$type<PageDoc>(),
  /** Optimistic lock: every save sends the version it started from. */
  draftVersion: integer("draft_version").notNull().default(0),
  draftUpdatedAt: timestamp("draft_updated_at", { withTimezone: true }),
  draftUpdatedBy: uuid("draft_updated_by").references(() => adminUsers.id, {
    onDelete: "set null",
  }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  publishedBy: uuid("published_by").references(() => adminUsers.id, { onDelete: "set null" }),
});

export type CmsPageRow = typeof cmsPages.$inferSelect;
