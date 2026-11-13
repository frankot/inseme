import "server-only";

import { desc, gt, sql } from "drizzle-orm";

import { db } from "@/db";
import { phoneClickCounts } from "@/db/schema";
import type { PhoneClickPayload } from "@/lib/phone-clicks";

/** Today in Warsaw, from the database clock — not the visitor's or the function's. */
const WARSAW_TODAY = sql`(now() at time zone 'Europe/Warsaw')::date`;

/** Adds one tap to its daily row, creating the row on the day's first tap. */
export async function recordPhoneClick(click: PhoneClickPayload & { device: "mobile" | "desktop" }) {
  await db
    .insert(phoneClickCounts)
    .values({ ...click, day: WARSAW_TODAY, count: 1 })
    .onConflictDoUpdate({
      target: [
        phoneClickCounts.day,
        phoneClickCounts.page,
        phoneClickCounts.location,
        phoneClickCounts.landing,
        phoneClickCounts.source,
        phoneClickCounts.device,
      ],
      set: { count: sql`${phoneClickCounts.count} + 1` },
    });
}

/**
 * Deploys here go out from the working tree, so the panel can be live before
 * `db:migrate` has created the table. That case reads as "not enabled yet"
 * instead of breaking the dashboard.
 */
function isMissingTable(error: unknown): boolean {
  for (let current: unknown = error; current; current = (current as { cause?: unknown }).cause) {
    const { code, message } = current as { code?: string; message?: string };
    if (code === "42P01" || message?.includes('relation "phone_click_counts" does not exist')) {
      return true;
    }
  }
  return false;
}

async function orMissing<T>(query: () => Promise<T>): Promise<T | null> {
  try {
    return await query();
  } catch (error) {
    if (isMissingTable(error)) return null;
    throw error;
  }
}

const total = sql<number>`coalesce(sum(${phoneClickCounts.count}), 0)::int`;
const sinceDays = (days: number) => gt(phoneClickCounts.day, sql`${WARSAW_TODAY} - ${days}::int`);

/** For the dashboard tile: taps in the last 30 days, `null` before the migration. */
export async function getPhoneClicks30d(): Promise<number | null> {
  return orMissing(async () => {
    const [row] = await db.select({ total }).from(phoneClickCounts).where(sinceDays(30));
    return row?.total ?? 0;
  });
}

export type PhoneClickBreakdownRow = { key: string; total: number };

export type PhoneClickStats = {
  last7: number;
  last30: number;
  mobile30: number;
  firstDay: string | null;
  weeks: { week: string; total: number }[];
  bySource: PhoneClickBreakdownRow[];
  byLanding: PhoneClickBreakdownRow[];
  byPage: { page: string; location: string; total: number }[];
};

/** Everything the "Telefony" tab shows; `null` before the migration. */
export async function getPhoneClickStats(): Promise<PhoneClickStats | null> {
  return orMissing(async () => {
    const last30 = sinceDays(30);
    const [[summary], weeks, bySource, byLanding, byPage] = await Promise.all([
      db
        .select({
          last7: sql<number>`coalesce(sum(${phoneClickCounts.count}) filter (where ${sinceDays(7)}), 0)::int`,
          last30: sql<number>`coalesce(sum(${phoneClickCounts.count}) filter (where ${last30}), 0)::int`,
          mobile30: sql<number>`coalesce(sum(${phoneClickCounts.count}) filter (where ${last30} and ${phoneClickCounts.device} = 'mobile'), 0)::int`,
          firstDay: sql<string | null>`min(${phoneClickCounts.day})::text`,
        })
        .from(phoneClickCounts),
      // Postgres weeks start on Monday, like the Polish calendar.
      db
        .select({
          week: sql<string>`date_trunc('week', ${phoneClickCounts.day})::date::text`.as("week"),
          total,
        })
        .from(phoneClickCounts)
        .where(sinceDays(7 * 12))
        .groupBy(sql`1`)
        .orderBy(desc(sql`1`)),
      db
        .select({ key: phoneClickCounts.source, total })
        .from(phoneClickCounts)
        .where(last30)
        .groupBy(phoneClickCounts.source)
        .orderBy(desc(total)),
      db
        .select({ key: phoneClickCounts.landing, total })
        .from(phoneClickCounts)
        .where(last30)
        .groupBy(phoneClickCounts.landing)
        .orderBy(desc(total))
        .limit(15),
      db
        .select({ page: phoneClickCounts.page, location: phoneClickCounts.location, total })
        .from(phoneClickCounts)
        .where(last30)
        .groupBy(phoneClickCounts.page, phoneClickCounts.location)
        .orderBy(desc(total))
        .limit(15),
    ]);

    return {
      last7: summary?.last7 ?? 0,
      last30: summary?.last30 ?? 0,
      mobile30: summary?.mobile30 ?? 0,
      firstDay: summary?.firstDay ?? null,
      weeks,
      bySource,
      byLanding,
      byPage,
    };
  });
}
