import { z } from "zod";

import { slugPattern } from "@/lib/slug";

/**
 * Shared by the admin builder's react-hook-form resolvers and the server
 * actions. Transform-free, like `validations/content.ts`: input and output
 * types must match or the resolver's generics diverge.
 */

/* ------------------------------------------------------------------ admin */

export const screeningTestSchema = z.object({
  title: z.string().trim().min(1, "Podaj tytuł testu.").max(160),
  slug: z
    .string()
    .trim()
    .min(1, "Podaj adres URL (slug).")
    .max(96)
    .regex(slugPattern, "Slug może zawierać tylko małe litery, cyfry i myślniki."),
  description: z.string().trim().max(2000).optional(),
  introText: z.string().trim().max(2000).optional(),
  disclaimerText: z.string().trim().max(2000).optional(),
  metaTitle: z.string().trim().max(70, "Maksymalnie 70 znaków.").optional(),
  metaDescription: z.string().trim().max(180, "Maksymalnie 180 znaków.").optional(),
  sortOrder: z.number().int().min(0).max(9999),
});

export const questionSchema = z.object({
  text: z.string().trim().min(1, "Podaj treść pytania.").max(500),
  sortOrder: z.number().int().min(0).max(9999),
});

export const answerOptionSchema = z.object({
  label: z.string().trim().min(1, "Podaj treść odpowiedzi.").max(200),
  points: z.number().int().min(0, "Punkty nie mogą być ujemne.").max(100),
  sortOrder: z.number().int().min(0).max(9999),
});

export const resultBandSchema = z.object({
  minScore: z.number().int().min(0).max(9999),
  maxScore: z.number().int().min(0).max(9999),
  resultTitle: z.string().trim().min(1, "Podaj tytuł wyniku.").max(300),
  resultBody: z.string().trim().min(1, "Podaj treść wyniku.").max(4000),
  sortOrder: z.number().int().min(0).max(9999),
});

export type ScreeningTestInput = z.infer<typeof screeningTestSchema>;
export type QuestionInput = z.infer<typeof questionSchema>;
export type AnswerOptionInput = z.infer<typeof answerOptionSchema>;
export type ResultBandInput = z.infer<typeof resultBandSchema>;

/* ----------------------------------------------------------------- public */

/**
 * Delivery of a screening-test result.
 *
 * Only the score crosses the wire — never the individual answers. The test
 * tells the visitor their answers are not recorded, and the submission table
 * has no column to put them in. The server re-derives the band from the score,
 * so a tampered payload can at worst mis-score the sender's own PDF.
 */
export const screeningResultSchema = z.object({
  testId: z.uuid(),
  email: z.email("Podaj poprawny adres e-mail."),
  consent: z.literal(true, { message: "Bez zgody nie możemy wysłać wyniku." }),
  score: z.number().int().min(0).max(9999),
  /** Honeypot — see `src/lib/rate-limit.ts`. Humans never see this field. */
  company: z.string().max(200).optional(),
});

export type ScreeningResultInput = z.infer<typeof screeningResultSchema>;
