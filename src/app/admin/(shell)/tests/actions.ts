"use server";

import { and, eq, notInArray } from "drizzle-orm";
import type { BatchItem } from "drizzle-orm/batch";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import {
  screeningTestAnswerOptions,
  screeningTestQuestions,
  screeningTestResultBands,
  screeningTestSubmissions,
  screeningTests,
} from "@/db/schema";
import { actionError, type ActionResult, type DataResult } from "@/lib/action-result";
import { requireAdmin } from "@/lib/auth-guard";
import { publishState } from "@/lib/publish-state";
import { emptyToNull } from "@/lib/validations/content";
import { testEditorSchema, type TestEditorInput } from "@/lib/validations/screening";

/**
 * A test is edited as one form and saved as one batch: its fields, its
 * questions with their answers, and its result bands go to the database
 * together, all or nothing (`db.batch` runs as a single transaction).
 */
function revalidateTest(id: string, slug?: string | null) {
  revalidatePath("/admin/tests");
  revalidatePath(`/admin/tests/${id}`);
  revalidatePath("/testy");
  revalidatePath("/");
  if (slug) revalidatePath(`/testy/${slug}`);
}

function isSlugClash(error: unknown): boolean {
  return (
    typeof error === "object" && error !== null && "code" in error && error.code === "23505"
  );
}

/**
 * Saves the whole test from the editor. Questions and answers are rewritten —
 * nothing points at them. Bands are matched by id and updated in place,
 * because submissions reference the band they landed in; only bands removed in
 * the editor are deleted. A new test's id is made here, so the test row and
 * its children fit in the same batch.
 */
export async function saveTest(
  id: string | null,
  input: TestEditorInput,
  publish: boolean,
): Promise<DataResult<{ id: string; bandIds: string[] }>> {
  try {
    await requireAdmin();
    const parsed = testEditorSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
    }
    const data = parsed.data;

    if (publish) {
      const problem = incompletenessOf(data);
      if (problem) return { ok: false, error: problem };
    }

    const previous = id
      ? await db.query.screeningTests.findFirst({
          where: eq(screeningTests.id, id),
          columns: { slug: true, publishedAt: true },
          with: { resultBands: { columns: { id: true } } },
        })
      : null;
    if (id && !previous) return { ok: false, error: "Nie znaleziono testu." };

    const testId = id ?? crypto.randomUUID();
    const values = {
      ...publishState(publish, previous?.publishedAt),
      title: data.title,
      slug: data.slug,
      description: emptyToNull(data.description),
      introText: emptyToNull(data.introText),
      disclaimerText: emptyToNull(data.disclaimerText),
      metaTitle: emptyToNull(data.metaTitle),
      metaDescription: emptyToNull(data.metaDescription),
      sortOrder: data.sortOrder,
      updatedAt: new Date(),
    };

    const queries: BatchItem<"pg">[] = [
      id
        ? db.update(screeningTests).set(values).where(eq(screeningTests.id, testId))
        : db.insert(screeningTests).values({ id: testId, ...values }),
      // Answers go with their questions (ON DELETE CASCADE).
      db.delete(screeningTestQuestions).where(eq(screeningTestQuestions.testId, testId)),
    ];

    const questions = data.questions.map((question, index) => ({
      id: crypto.randomUUID(),
      testId,
      text: question.text,
      sortOrder: index,
      options: question.options,
    }));
    if (questions.length > 0) {
      queries.push(
        db.insert(screeningTestQuestions).values(
          questions.map((question) => ({
            id: question.id,
            testId: question.testId,
            text: question.text,
            sortOrder: question.sortOrder,
          })),
        ),
      );
      const options = questions.flatMap((question) =>
        question.options.map((option, index) => ({
          questionId: question.id,
          label: option.label,
          points: option.points,
          sortOrder: index,
        })),
      );
      if (options.length > 0) queries.push(db.insert(screeningTestAnswerOptions).values(options));
    }

    const existing = new Set(previous?.resultBands.map((band) => band.id) ?? []);
    const kept = data.bands.flatMap((band) => (band.bandId && existing.has(band.bandId) ? [band.bandId] : []));
    queries.push(
      db
        .delete(screeningTestResultBands)
        .where(
          kept.length > 0
            ? and(eq(screeningTestResultBands.testId, testId), notInArray(screeningTestResultBands.id, kept))
            : eq(screeningTestResultBands.testId, testId),
        ),
    );
    const added: (typeof screeningTestResultBands.$inferInsert)[] = [];
    // Every band's id in editor order, so the form can keep them for the next save.
    const bandIds = data.bands.map((band) => band.bandId ?? "");
    data.bands.forEach((band, index) => {
      const fields = {
        minScore: band.minScore,
        maxScore: band.maxScore,
        resultTitle: band.resultTitle,
        resultBody: band.resultBody,
        sortOrder: index,
      };
      if (band.bandId && existing.has(band.bandId)) {
        queries.push(
          db.update(screeningTestResultBands).set(fields).where(eq(screeningTestResultBands.id, band.bandId)),
        );
      } else {
        const bandId = crypto.randomUUID();
        bandIds[index] = bandId;
        added.push({ id: bandId, testId, ...fields });
      }
    });
    if (added.length > 0) queries.push(db.insert(screeningTestResultBands).values(added));

    await db.batch(queries as [BatchItem<"pg">, ...BatchItem<"pg">[]]);

    revalidateTest(testId, values.slug);
    if (previous?.slug && previous.slug !== values.slug) revalidatePath(`/testy/${previous.slug}`);
    return { ok: true, data: { id: testId, bandIds } };
  } catch (error) {
    if (isSlugClash(error)) {
      return { ok: false, error: "Ten adres (slug) jest już zajęty przez inny test." };
    }
    return actionError(error, "Nie udało się zapisać testu.");
  }
}

/** Why the test in the editor can't go live yet, or null. */
function incompletenessOf(data: TestEditorInput): string | null {
  if (data.questions.length === 0) return "Dodaj przynajmniej jedno pytanie.";
  const empty = data.questions.findIndex((question) => question.options.length === 0);
  if (empty >= 0) return `Pytanie ${empty + 1} nie ma odpowiedzi.`;
  if (data.bands.length === 0) return "Dodaj przynajmniej jeden przedział wyniku.";
  return null;
}

/**
 * Publishing is gated on the test actually being answerable: no questions, a
 * question with no options, or no result bands means a visitor would hit a dead
 * end. The public query refuses such a test too — this just says so upfront.
 */
export async function publishScreeningTest(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const problem = await describeIncompleteness(id);
    if (problem) return { ok: false, error: problem };

    const [row] = await db
      .update(screeningTests)
      .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
      .where(eq(screeningTests.id, id))
      .returning({ slug: screeningTests.slug });
    revalidateTest(id, row?.slug);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się opublikować testu.");
  }
}

export async function unpublishScreeningTest(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const [row] = await db
      .update(screeningTests)
      .set({ status: "draft", updatedAt: new Date() })
      .where(eq(screeningTests.id, id))
      .returning({ slug: screeningTests.slug });
    revalidateTest(id, row?.slug);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się cofnąć publikacji.");
  }
}

export async function deleteScreeningTest(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const [row] = await db
      .delete(screeningTests)
      .where(eq(screeningTests.id, id))
      .returning({ slug: screeningTests.slug });
    revalidateTest(id, row?.slug);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się usunąć testu.");
  }
}

/** Returns a human explanation of why the test cannot go live, or null. */
async function describeIncompleteness(id: string): Promise<string | null> {
  const test = await db.query.screeningTests.findFirst({
    where: eq(screeningTests.id, id),
    with: { questions: { with: { options: true } }, resultBands: true },
  });
  if (!test) return "Nie znaleziono testu.";
  if (test.questions.length === 0) return "Dodaj przynajmniej jedno pytanie.";

  const emptyQuestion = test.questions.find((q) => q.options.length === 0);
  if (emptyQuestion) {
    return `Pytanie „${emptyQuestion.text.slice(0, 40)}…” nie ma odpowiedzi.`;
  }
  if (test.resultBands.length === 0) return "Dodaj przynajmniej jeden przedział wyniku.";
  return null;
}

/* ------------------------------------------------------------ submissions */

/** Right-to-erasure: a soft delete, so the row stops appearing everywhere at once. */
export async function deleteSubmission(
  submissionId: string,
  testId: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db
      .update(screeningTestSubmissions)
      .set({ deletedAt: new Date() })
      .where(eq(screeningTestSubmissions.id, submissionId));
    revalidatePath(`/admin/tests/${testId}/submissions`);
    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się usunąć zgłoszenia.");
  }
}
