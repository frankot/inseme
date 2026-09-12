import "server-only";

import { and, desc, eq, isNull, sql } from "drizzle-orm";

import { db } from "@/db";
import { contactSubmissions, leadSignups, screeningTestSubmissions, screeningTests } from "@/db/schema";

/**
 * The brief asks for "one shared base" of every collected e-mail. Rather than
 * copying addresses into a third table, the export unions the two places they
 * legitimately live — the signup widget and screening-test requests — at query
 * time. One address, one row, no synchronisation to get wrong.
 */
export type LeadRow = {
  email: string;
  source: string;
  detail: string | null;
  consentAt: Date;
  createdAt: Date;
};

export async function getLeadRows(): Promise<LeadRow[]> {
  const [signups, tests] = await Promise.all([
    db
      .select({
        email: leadSignups.email,
        source: leadSignups.source,
        consentAt: leadSignups.consentAt,
        createdAt: leadSignups.createdAt,
      })
      .from(leadSignups)
      .where(isNull(leadSignups.deletedAt))
      .orderBy(desc(leadSignups.createdAt)),

    db
      .select({
        email: screeningTestSubmissions.email,
        title: screeningTests.title,
        score: screeningTestSubmissions.totalScore,
        maxScore: screeningTestSubmissions.maxScore,
        consentAt: screeningTestSubmissions.consentAt,
        createdAt: screeningTestSubmissions.createdAt,
      })
      .from(screeningTestSubmissions)
      .leftJoin(screeningTests, eq(screeningTestSubmissions.testId, screeningTests.id))
      .where(isNull(screeningTestSubmissions.deletedAt))
      .orderBy(desc(screeningTestSubmissions.createdAt)),
  ]);

  const rows: LeadRow[] = [
    ...signups.map((row) => ({
      email: row.email,
      source: "zapis na stronie",
      detail: row.source,
      consentAt: row.consentAt,
      createdAt: row.createdAt,
    })),
    ...tests.map((row) => ({
      email: row.email,
      source: "test przesiewowy",
      detail: row.title ? `${row.title} — ${row.score}/${row.maxScore} pkt` : null,
      consentAt: row.consentAt,
      createdAt: row.createdAt,
    })),
  ];

  return rows.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/** Distinct addresses across both sources — what the "ile osób" tile counts. */
export async function getLeadStats() {
  const [signups] = await db
    .select({ value: sql<number>`count(*)`.mapWith(Number) })
    .from(leadSignups)
    .where(isNull(leadSignups.deletedAt));

  const [tests] = await db
    .select({ value: sql<number>`count(*)`.mapWith(Number) })
    .from(screeningTestSubmissions)
    .where(isNull(screeningTestSubmissions.deletedAt));

  // A UNION of two tables is past what the query builder expresses cleanly, and
  // the point of the union is exactly that one address in both places counts once.
  const unique = await db.execute<{ value: number }>(sql`
    select count(*)::int as value from (
      select ${leadSignups.email} as email
        from ${leadSignups} where ${leadSignups.deletedAt} is null
      union
      select ${screeningTestSubmissions.email} as email
        from ${screeningTestSubmissions} where ${screeningTestSubmissions.deletedAt} is null
    ) as combined
  `);

  return {
    signups: signups?.value ?? 0,
    tests: tests?.value ?? 0,
    unique: Number(unique.rows?.[0]?.value ?? 0),
  };
}

/** New (unhandled) contact messages — the dashboard's headline number. */
export async function getNewContactCount(): Promise<number> {
  const [row] = await db
    .select({ value: sql<number>`count(*)`.mapWith(Number) })
    .from(contactSubmissions)
    .where(
      and(eq(contactSubmissions.status, "new"), isNull(contactSubmissions.deletedAt)),
    );
  return row?.value ?? 0;
}
