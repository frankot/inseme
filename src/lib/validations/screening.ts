import { z } from "zod";

/**
 * Delivery of a screening-test result. Shared by the form's react-hook-form
 * resolver and — once phase B3 lands — the server action, so it stays
 * transform-free: input and output types must match or the resolver's generics
 * diverge (same rule as `validations/content.ts`).
 */
export const screeningResultSchema = z.object({
  email: z.email("Podaj poprawny adres e-mail."),
  consent: z.literal(true, {
    message: "Bez zgody nie możemy wysłać wyniku.",
  }),
  /** Raw score, carried so the result PDF matches what was on screen. */
  score: z.number().int().min(0),
});

export type ScreeningResultInput = z.infer<typeof screeningResultSchema>;
