import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { contentStatus } from "./enums";

/**
 * A linear scored questionnaire: ordered questions, each answer option worth a
 * number of points, and score bands that turn the total into a result. No
 * branching — see §0 of the backend plan.
 */
export const screeningTests = pgTable("screening_tests", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  introText: text("intro_text"),
  /** Rendered on the test, in the result and in the PDF — never optional in practice. */
  disclaimerText: text("disclaimer_text"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  sortOrder: integer("sort_order").notNull().default(0),
  status: contentStatus("status").notNull().default("draft"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const screeningTestQuestions = pgTable("screening_test_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  testId: uuid("test_id")
    .notNull()
    .references(() => screeningTests.id, { onDelete: "cascade" }),
  sortOrder: integer("sort_order").notNull().default(0),
  text: text("text").notNull(),
});

export const screeningTestAnswerOptions = pgTable("screening_test_answer_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  questionId: uuid("question_id")
    .notNull()
    .references(() => screeningTestQuestions.id, { onDelete: "cascade" }),
  sortOrder: integer("sort_order").notNull().default(0),
  label: text("label").notNull(),
  points: integer("points").notNull().default(0),
});

export const screeningTestResultBands = pgTable("screening_test_result_bands", {
  id: uuid("id").primaryKey().defaultRandom(),
  testId: uuid("test_id")
    .notNull()
    .references(() => screeningTests.id, { onDelete: "cascade" }),
  sortOrder: integer("sort_order").notNull().default(0),
  minScore: integer("min_score").notNull().default(0),
  maxScore: integer("max_score").notNull().default(0),
  resultTitle: text("result_title").notNull(),
  resultBody: text("result_body").notNull(),
});

/**
 * What a visitor left behind after asking for their result by e-mail.
 *
 * Deliberately WITHOUT the `answers` column the original plan listed: the test
 * tells the visitor "odpowiedzi nie zapisujemy", and storing per-question
 * answers about someone's drinking would both break that promise and pile up
 * health-adjacent personal data for no operational gain. The score and the band
 * are enough to reproduce the PDF that was sent.
 *
 * `deletedAt` is a soft delete — the retention job (B5) and the manual
 * right-to-erasure action both stamp it.
 */
export const screeningTestSubmissions = pgTable("screening_test_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  testId: uuid("test_id").references(() => screeningTests.id, { onDelete: "set null" }),
  email: text("email").notNull(),
  consentAt: timestamp("consent_at", { withTimezone: true }).notNull().defaultNow(),
  totalScore: integer("total_score").notNull(),
  maxScore: integer("max_score").notNull(),
  resultBandId: uuid("result_band_id").references(() => screeningTestResultBands.id, {
    onDelete: "set null",
  }),
  /** Whether the Resend hand-off succeeded, so the inbox can show what failed. */
  emailedAt: timestamp("emailed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export type ScreeningTest = typeof screeningTests.$inferSelect;
export type NewScreeningTest = typeof screeningTests.$inferInsert;
export type ScreeningTestQuestion = typeof screeningTestQuestions.$inferSelect;
export type ScreeningTestAnswerOption = typeof screeningTestAnswerOptions.$inferSelect;
export type ScreeningTestResultBand = typeof screeningTestResultBands.$inferSelect;
export type ScreeningTestSubmission = typeof screeningTestSubmissions.$inferSelect;
