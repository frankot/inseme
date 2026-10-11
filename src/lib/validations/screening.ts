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

/**
 * The whole test as the admin editor submits it — its fields, its questions
 * with their answers, and its result bands — saved in one go. Order is the
 * array order. A band carries its id when it already exists, because
 * submissions point at bands and must keep pointing at the same one.
 *
 * Anything present must be filled in; how many there are is only checked on
 * publishing (`describeIncompleteness` in the actions), so a draft can be half
 * built.
 */
export const testEditorSchema = screeningTestSchema.extend({
  questions: z
    .array(
      z.object({
        text: z.string().trim().min(1, "Podaj treść pytania.").max(500),
        options: z
          .array(
            z.object({
              label: z.string().trim().min(1, "Podaj treść odpowiedzi.").max(200),
              points: z.number({ message: "Podaj punkty." }).int().min(0, "Punkty nie mogą być ujemne.").max(100),
            }),
          )
          .max(20),
      }),
    )
    .max(200),
  bands: z
    .array(
      z
        .object({
          /** The saved band's id; absent for one added in the editor. */
          bandId: z.string().optional(),
          minScore: z.number({ message: "Podaj liczbę." }).int().min(0).max(9999),
          maxScore: z.number({ message: "Podaj liczbę." }).int().min(0).max(9999),
          resultTitle: z.string().trim().min(1, "Podaj tytuł wyniku.").max(300),
          resultBody: z.string().trim().min(1, "Podaj treść wyniku.").max(4000),
        })
        .refine((band) => band.maxScore >= band.minScore, {
          message: "Górna granica nie może być niższa od dolnej.",
          path: ["maxScore"],
        }),
    )
    .max(20),
});

export type ScreeningTestInput = z.infer<typeof screeningTestSchema>;
export type TestEditorInput = z.infer<typeof testEditorSchema>;

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
  consent: z.boolean().refine((v) => v, { message: "Bez zgody nie możemy wysłać wyniku." }),
  score: z.number().int().min(0).max(9999),
  /** Honeypot — see `src/lib/rate-limit.ts`. Humans never see this field. */
  company: z.string().max(200).optional(),
});

export type ScreeningResultInput = z.infer<typeof screeningResultSchema>;
