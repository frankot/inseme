import { relations } from "drizzle-orm";

import { articles } from "./articles";
import { media } from "./media";
import { pages } from "./pages";
import {
  screeningTestAnswerOptions,
  screeningTestQuestions,
  screeningTestResultBands,
  screeningTestSubmissions,
  screeningTests,
} from "./screening-tests";
import { settings } from "./settings";
import { teamMembers } from "./team-members";

export const pagesRelations = relations(pages, ({ one }) => ({
  ogImage: one(media, { fields: [pages.ogImageId], references: [media.id] }),
}));

export const articlesRelations = relations(articles, ({ one }) => ({
  coverImage: one(media, { fields: [articles.coverImageId], references: [media.id] }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  photo: one(media, { fields: [teamMembers.photoId], references: [media.id] }),
}));

export const settingsRelations = relations(settings, ({ one }) => ({
  defaultOgImage: one(media, { fields: [settings.defaultOgImageId], references: [media.id] }),
}));

/**
 * A test is loaded whole — questions with their options, plus the result bands
 * — so the public page can render and score it in one round trip.
 */
export const screeningTestsRelations = relations(screeningTests, ({ many }) => ({
  questions: many(screeningTestQuestions),
  resultBands: many(screeningTestResultBands),
  submissions: many(screeningTestSubmissions),
}));

export const screeningTestQuestionsRelations = relations(
  screeningTestQuestions,
  ({ one, many }) => ({
    test: one(screeningTests, {
      fields: [screeningTestQuestions.testId],
      references: [screeningTests.id],
    }),
    options: many(screeningTestAnswerOptions),
  }),
);

export const screeningTestAnswerOptionsRelations = relations(
  screeningTestAnswerOptions,
  ({ one }) => ({
    question: one(screeningTestQuestions, {
      fields: [screeningTestAnswerOptions.questionId],
      references: [screeningTestQuestions.id],
    }),
  }),
);

export const screeningTestResultBandsRelations = relations(
  screeningTestResultBands,
  ({ one }) => ({
    test: one(screeningTests, {
      fields: [screeningTestResultBands.testId],
      references: [screeningTests.id],
    }),
  }),
);

export const screeningTestSubmissionsRelations = relations(
  screeningTestSubmissions,
  ({ one }) => ({
    test: one(screeningTests, {
      fields: [screeningTestSubmissions.testId],
      references: [screeningTests.id],
    }),
    resultBand: one(screeningTestResultBands, {
      fields: [screeningTestSubmissions.resultBandId],
      references: [screeningTestResultBands.id],
    }),
  }),
);
