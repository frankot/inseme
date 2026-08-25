import type { ActionResult } from "@/lib/action-result";
import {
  screeningResultSchema,
  type ScreeningResultInput,
} from "@/lib/validations/screening";

/**
 * Placeholder for the screening-result delivery that phase B3 will own.
 *
 * Nothing leaves the browser: the test runs client-side and no answers are
 * persisted, which is what the section's copy promises the visitor. The input
 * is re-validated here so the contract matches the eventual server action —
 * client-side validation is never the authority — and so swapping this import
 * for the action needs no change in the component.
 */
export async function sendScreeningResult(
  input: ScreeningResultInput,
): Promise<ActionResult> {
  const parsed = screeningResultSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Sprawdź adres e-mail i zgodę na wysyłkę." };
  }

  await new Promise((resolve) => setTimeout(resolve, 600));
  return { ok: true };
}
