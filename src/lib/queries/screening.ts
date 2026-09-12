import "server-only";

import { and, asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { screeningTests } from "@/db/schema";

/** Shape the public test player needs — no admin-only fields, no submissions. */
export type PublicAnswerOption = { id: string; label: string; points: number };
export type PublicQuestion = { id: string; text: string; options: PublicAnswerOption[] };
export type PublicResultBand = {
  id: string;
  minScore: number;
  maxScore: number;
  resultTitle: string;
  resultBody: string;
};

export type PublicScreeningTest = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  introText: string | null;
  disclaimerText: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  questions: PublicQuestion[];
  bands: PublicResultBand[];
  /** Highest reachable total — the best option of every question. */
  maxScore: number;
};

const publishedOnly = eq(screeningTests.status, "published");

/**
 * A published test loaded whole: questions with their options and the result
 * bands, in one round trip, ordered the way the admin arranged them.
 *
 * Returns null for a test that has no questions or no bands — half-built tests
 * exist as drafts all the time, and a publish button is not proof of
 * completeness. Better a 404 than a quiz that cannot produce a result.
 */
export async function getScreeningTestBySlug(
  slug: string,
): Promise<PublicScreeningTest | null> {
  const row = await db.query.screeningTests.findFirst({
    where: and(publishedOnly, eq(screeningTests.slug, slug)),
    with: {
      questions: {
        orderBy: (q, { asc: order }) => [order(q.sortOrder)],
        with: { options: { orderBy: (o, { asc: order }) => [order(o.sortOrder)] } },
      },
      resultBands: { orderBy: (b, { asc: order }) => [order(b.minScore)] },
    },
  });

  if (!row) return null;
  return toPublicTest(row);
}

/** Same as above, addressed by id — used by the submit action. */
export async function getScreeningTestById(
  id: string,
): Promise<PublicScreeningTest | null> {
  const row = await db.query.screeningTests.findFirst({
    where: and(publishedOnly, eq(screeningTests.id, id)),
    with: {
      questions: {
        orderBy: (q, { asc: order }) => [order(q.sortOrder)],
        with: { options: { orderBy: (o, { asc: order }) => [order(o.sortOrder)] } },
      },
      resultBands: { orderBy: (b, { asc: order }) => [order(b.minScore)] },
    },
  });

  if (!row) return null;
  return toPublicTest(row);
}

/** Exactly the columns the two `findFirst` calls above ask drizzle for. */
type LoadedTest = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  introText: string | null;
  disclaimerText: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  questions: { id: string; text: string; options: PublicAnswerOption[] }[];
  resultBands: PublicResultBand[];
};

function toPublicTest(row: LoadedTest): PublicScreeningTest | null {
  if (row.questions.length === 0 || row.resultBands.length === 0) return null;
  if (row.questions.some((question) => question.options.length === 0)) return null;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    introText: row.introText,
    disclaimerText: row.disclaimerText,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    questions: row.questions.map((question) => ({
      id: question.id,
      text: question.text,
      options: question.options.map((option) => ({
        id: option.id,
        label: option.label,
        points: option.points,
      })),
    })),
    bands: row.resultBands,
    maxScore: maxScoreOf(row.questions),
  };
}

/** Highest total a visitor can reach: the best-scoring option of each question. */
export function maxScoreOf(questions: { options: { points: number }[] }[]): number {
  return questions.reduce(
    (total, question) =>
      total + Math.max(0, ...question.options.map((option) => option.points)),
    0,
  );
}

/**
 * Bands are authored as ranges but nothing stops an editor leaving a gap. The
 * first covering band wins; a score above every band falls back to the last, so
 * a visitor always sees a result rather than a blank card.
 */
export function bandForScore<T extends { minScore: number; maxScore: number }>(
  bands: T[],
  score: number,
): T | null {
  if (bands.length === 0) return null;
  const ordered = [...bands].sort((a, b) => a.minScore - b.minScore);
  return (
    ordered.find((band) => score >= band.minScore && score <= band.maxScore) ??
    ordered[ordered.length - 1]
  );
}

/** Published tests for the /testy index. */
export async function getPublishedScreeningTests() {
  return db
    .select({
      id: screeningTests.id,
      slug: screeningTests.slug,
      title: screeningTests.title,
      description: screeningTests.description,
    })
    .from(screeningTests)
    .where(publishedOnly)
    .orderBy(asc(screeningTests.sortOrder), asc(screeningTests.title));
}

export async function getScreeningTestSlugs(): Promise<string[]> {
  const rows = await db
    .select({ slug: screeningTests.slug })
    .from(screeningTests)
    .where(publishedOnly);
  return rows.map((row) => row.slug);
}
