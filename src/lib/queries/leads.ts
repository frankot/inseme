import "server-only";

import { and, desc, eq, isNotNull, isNull, ne, sql } from "drizzle-orm";

import { db } from "@/db";
import { contactSubmissions, leadSignups, screeningTestSubmissions, screeningTests } from "@/db/schema";

/**
 * The brief asks for "one shared base" of every collected e-mail. Rather than
 * copying addresses into another table, the list unions the three places they
 * legitimately live — the signup widget, screening-test requests and the
 * contact form (when the person left an address) — at query time. No
 * synchronisation to get wrong.
 *
 * The consents differ: a contact-form address was given to get a reply, not
 * to join a mailing list. `source` says which, and the export carries it.
 */
export type LeadRow = {
  /** Where the row lives, and so where it is deleted. */
  kind: "signup" | "test" | "contact";
  id: string;
  email: string;
  source: string;
  detail: string | null;
  consentAt: Date;
  createdAt: Date;
};

/** Contact messages that left an address (it is optional there). */
const withEmail = and(
  isNull(contactSubmissions.deletedAt),
  isNotNull(contactSubmissions.email),
  ne(contactSubmissions.email, ""),
);

export async function getLeadRows(): Promise<LeadRow[]> {
  const [signups, tests, messages] = await Promise.all([
    db
      .select({
        id: leadSignups.id,
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
        id: screeningTestSubmissions.id,
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

    db
      .select({
        id: contactSubmissions.id,
        email: contactSubmissions.email,
        name: contactSubmissions.name,
        preferred: contactSubmissions.preferredContactMethod,
        consentAt: contactSubmissions.consentAt,
        createdAt: contactSubmissions.createdAt,
      })
      .from(contactSubmissions)
      .where(withEmail)
      .orderBy(desc(contactSubmissions.createdAt)),
  ]);

  const rows: LeadRow[] = [
    ...signups.map((row) => ({
      kind: "signup" as const,
      id: row.id,
      email: row.email,
      source: "zapis na stronie",
      detail: row.source,
      consentAt: row.consentAt,
      createdAt: row.createdAt,
    })),
    ...tests.map((row) => ({
      kind: "test" as const,
      id: row.id,
      email: row.email,
      source: "test przesiewowy",
      detail: row.title ? `${row.title} — ${row.score}/${row.maxScore} pkt` : null,
      consentAt: row.consentAt,
      createdAt: row.createdAt,
    })),
    ...messages.map((row) => ({
      kind: "contact" as const,
      id: row.id,
      email: row.email!,
      source: "formularz kontaktowy",
      detail: [
        row.name?.trim(),
        `woli kontakt ${row.preferred === "phone" ? "telefoniczny" : "e-mailowy"}`,
      ]
        .filter(Boolean)
        .join(" · "),
      consentAt: row.consentAt,
      createdAt: row.createdAt,
    })),
  ];

  return rows.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/** Distinct addresses across all three sources — what the "ile osób" tile counts. */
export async function getLeadStats() {
  const [signups] = await db
    .select({ value: sql<number>`count(*)`.mapWith(Number) })
    .from(leadSignups)
    .where(isNull(leadSignups.deletedAt));

  const [tests] = await db
    .select({ value: sql<number>`count(*)`.mapWith(Number) })
    .from(screeningTestSubmissions)
    .where(isNull(screeningTestSubmissions.deletedAt));

  const [messages] = await db
    .select({ value: sql<number>`count(*)`.mapWith(Number) })
    .from(contactSubmissions)
    .where(withEmail);

  // A UNION of three tables is past what the query builder expresses cleanly, and
  // the point of the union is exactly that one address in several places counts
  // once — case-insensitively, as mail servers treat it.
  const unique = await db.execute<{ value: number }>(sql`
    select count(*)::int as value from (
      select lower(${leadSignups.email}) as email
        from ${leadSignups} where ${leadSignups.deletedAt} is null
      union
      select lower(${screeningTestSubmissions.email}) as email
        from ${screeningTestSubmissions} where ${screeningTestSubmissions.deletedAt} is null
      union
      select lower(${contactSubmissions.email}) as email
        from ${contactSubmissions}
        where ${contactSubmissions.deletedAt} is null and coalesce(${contactSubmissions.email}, '') <> ''
    ) as combined
  `);

  return {
    signups: signups?.value ?? 0,
    tests: tests?.value ?? 0,
    messages: messages?.value ?? 0,
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
