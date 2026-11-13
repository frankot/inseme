import { date, integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";

/**
 * Taps on a phone number, counted without consent and without cookies — see
 * `src/lib/phone-clicks.ts`. Aggregates only: one row per combination, and a
 * tap adds 1 to its row. No per-tap record, no time of day, no IP or browser,
 * so no row can be traced back to a person or matched to one phone call.
 */
export const phoneClickCounts = pgTable(
  "phone_click_counts",
  {
    /** Warsaw date, set by the database rather than the visitor's clock. */
    day: date("day", { mode: "string" }).notNull(),
    /** Path of the page where the number was tapped. */
    page: text("page").notNull(),
    /** Which button: header, sticky, article-sidebar or the section id. */
    location: text("location").notNull(),
    /** First page opened in that browser tab. */
    landing: text("landing").notNull(),
    /** One word for where the visit came from; see `PHONE_CLICK_SOURCES`. */
    source: text("source").notNull(),
    /** `mobile` or `desktop`. */
    device: text("device").notNull(),
    count: integer("count").notNull().default(0),
  },
  (table) => [
    primaryKey({
      name: "phone_click_counts_pk",
      columns: [table.day, table.page, table.location, table.landing, table.source, table.device],
    }),
  ],
);

export type PhoneClickCount = typeof phoneClickCounts.$inferSelect;
