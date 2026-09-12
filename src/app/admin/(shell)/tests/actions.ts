"use server";

import { asc, eq, max } from "drizzle-orm";
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
import { emptyToNull } from "@/lib/validations/content";
import {
  answerOptionSchema,
  questionSchema,
  resultBandSchema,
  screeningTestSchema,
  type AnswerOptionInput,
  type QuestionInput,
  type ResultBandInput,
  type ScreeningTestInput,
} from "@/lib/validations/screening";

/**
 * The builder edits one test through many small actions rather than one giant
 * nested form: questions, options and bands are separate rows with their own
 * ordering, and a single submit would have to diff three collections. Each
 * action re-validates and re-revalidates the same paths.
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

/** The test's own fields. Questions and bands are edited separately. */
export async function saveScreeningTest(
  id: string | null,
  input: ScreeningTestInput,
): Promise<DataResult<{ id: string }>> {
  try {
    await requireAdmin();
    const parsed = screeningTestSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
    }

    const values = {
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: emptyToNull(parsed.data.description),
      introText: emptyToNull(parsed.data.introText),
      disclaimerText: emptyToNull(parsed.data.disclaimerText),
      metaTitle: emptyToNull(parsed.data.metaTitle),
      metaDescription: emptyToNull(parsed.data.metaDescription),
      sortOrder: parsed.data.sortOrder,
      updatedAt: new Date(),
    };

    if (id) {
      const previous = await db.query.screeningTests.findFirst({
        where: eq(screeningTests.id, id),
        columns: { slug: true },
      });
      await db.update(screeningTests).set(values).where(eq(screeningTests.id, id));
      revalidateTest(id, values.slug);
      if (previous?.slug && previous.slug !== values.slug) {
        revalidatePath(`/testy/${previous.slug}`);
      }
      return { ok: true, data: { id } };
    }

    const [row] = await db
      .insert(screeningTests)
      .values(values)
      .returning({ id: screeningTests.id });
    revalidateTest(row.id, values.slug);
    return { ok: true, data: { id: row.id } };
  } catch (error) {
    if (isSlugClash(error)) {
      return { ok: false, error: "Ten adres (slug) jest już zajęty przez inny test." };
    }
    return actionError(error, "Nie udało się zapisać testu.");
  }
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

/* -------------------------------------------------------------- questions */

export async function addQuestion(testId: string, input: QuestionInput): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = questionSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
    }
    await db.insert(screeningTestQuestions).values({
      testId,
      text: parsed.data.text,
      sortOrder: parsed.data.sortOrder,
    });
    revalidateTest(testId);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się dodać pytania.");
  }
}

export async function updateQuestion(
  questionId: string,
  testId: string,
  input: QuestionInput,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = questionSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
    }
    await db
      .update(screeningTestQuestions)
      .set({ text: parsed.data.text, sortOrder: parsed.data.sortOrder })
      .where(eq(screeningTestQuestions.id, questionId));
    revalidateTest(testId);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się zapisać pytania.");
  }
}

export async function deleteQuestion(questionId: string, testId: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    // Options cascade with the question — see the FK in the schema.
    await db.delete(screeningTestQuestions).where(eq(screeningTestQuestions.id, questionId));
    revalidateTest(testId);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się usunąć pytania.");
  }
}

/** Swaps a question with its neighbour, so editors reorder without typing numbers. */
export async function moveQuestion(
  questionId: string,
  testId: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const rows = await db
      .select()
      .from(screeningTestQuestions)
      .where(eq(screeningTestQuestions.testId, testId))
      .orderBy(asc(screeningTestQuestions.sortOrder));

    const index = rows.findIndex((row) => row.id === questionId);
    const target = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || target < 0 || target >= rows.length) return { ok: true };

    await db
      .update(screeningTestQuestions)
      .set({ sortOrder: rows[target].sortOrder })
      .where(eq(screeningTestQuestions.id, rows[index].id));
    await db
      .update(screeningTestQuestions)
      .set({ sortOrder: rows[index].sortOrder })
      .where(eq(screeningTestQuestions.id, rows[target].id));

    revalidateTest(testId);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się zmienić kolejności.");
  }
}

/* ---------------------------------------------------------------- options */

export async function addAnswerOption(
  questionId: string,
  testId: string,
  input: AnswerOptionInput,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = answerOptionSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
    }
    await db.insert(screeningTestAnswerOptions).values({
      questionId,
      label: parsed.data.label,
      points: parsed.data.points,
      sortOrder: parsed.data.sortOrder,
    });
    revalidateTest(testId);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się dodać odpowiedzi.");
  }
}

export async function updateAnswerOption(
  optionId: string,
  testId: string,
  input: AnswerOptionInput,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = answerOptionSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
    }
    await db
      .update(screeningTestAnswerOptions)
      .set({
        label: parsed.data.label,
        points: parsed.data.points,
        sortOrder: parsed.data.sortOrder,
      })
      .where(eq(screeningTestAnswerOptions.id, optionId));
    revalidateTest(testId);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się zapisać odpowiedzi.");
  }
}

export async function deleteAnswerOption(
  optionId: string,
  testId: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db.delete(screeningTestAnswerOptions).where(eq(screeningTestAnswerOptions.id, optionId));
    revalidateTest(testId);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się usunąć odpowiedzi.");
  }
}

/**
 * Copies one question's options onto every other question in the test. Screening
 * questionnaires almost always repeat the same scale ("Nigdy / Rzadko / Czasem /
 * Często"), and typing it out per question is where editors give up.
 */
export async function copyOptionsToAllQuestions(
  questionId: string,
  testId: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const source = await db
      .select()
      .from(screeningTestAnswerOptions)
      .where(eq(screeningTestAnswerOptions.questionId, questionId))
      .orderBy(asc(screeningTestAnswerOptions.sortOrder));
    if (source.length === 0) return { ok: false, error: "To pytanie nie ma odpowiedzi." };

    const questions = await db
      .select({ id: screeningTestQuestions.id })
      .from(screeningTestQuestions)
      .where(eq(screeningTestQuestions.testId, testId));

    for (const question of questions) {
      if (question.id === questionId) continue;
      await db
        .delete(screeningTestAnswerOptions)
        .where(eq(screeningTestAnswerOptions.questionId, question.id));
      await db.insert(screeningTestAnswerOptions).values(
        source.map((option) => ({
          questionId: question.id,
          label: option.label,
          points: option.points,
          sortOrder: option.sortOrder,
        })),
      );
    }

    revalidateTest(testId);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się skopiować odpowiedzi.");
  }
}

/* ------------------------------------------------------------------ bands */

export async function saveResultBand(
  bandId: string | null,
  testId: string,
  input: ResultBandInput,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = resultBandSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
    }
    if (parsed.data.maxScore < parsed.data.minScore) {
      return { ok: false, error: "Górna granica nie może być niższa od dolnej." };
    }

    const values = {
      minScore: parsed.data.minScore,
      maxScore: parsed.data.maxScore,
      resultTitle: parsed.data.resultTitle,
      resultBody: parsed.data.resultBody,
      sortOrder: parsed.data.sortOrder,
    };

    if (bandId) {
      await db
        .update(screeningTestResultBands)
        .set(values)
        .where(eq(screeningTestResultBands.id, bandId));
    } else {
      await db.insert(screeningTestResultBands).values({ testId, ...values });
    }
    revalidateTest(testId);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się zapisać przedziału.");
  }
}

export async function deleteResultBand(bandId: string, testId: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db.delete(screeningTestResultBands).where(eq(screeningTestResultBands.id, bandId));
    revalidateTest(testId);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się usunąć przedziału.");
  }
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

/** Next free position, so new rows land at the end instead of colliding on 0. */
export async function nextSortOrder(
  kind: "question" | "band",
  testId: string,
): Promise<number> {
  if (kind === "question") {
    const [row] = await db
      .select({ value: max(screeningTestQuestions.sortOrder) })
      .from(screeningTestQuestions)
      .where(eq(screeningTestQuestions.testId, testId));
    return (row?.value ?? -1) + 1;
  }
  const [row] = await db
    .select({ value: max(screeningTestResultBands.sortOrder) })
    .from(screeningTestResultBands)
    .where(eq(screeningTestResultBands.testId, testId));
  return (row?.value ?? -1) + 1;
}
