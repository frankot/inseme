export type ActionFailure = { ok: false; error: string };

/** Server action outcome with no payload. */
export type ActionResult = { ok: true } | ActionFailure;

/** Server action outcome that returns data on success. */
export type DataResult<T> = { ok: true; data: T } | ActionFailure;

export function actionError(error: unknown, fallback: string): ActionFailure {
  if (error instanceof Error && error.message === "Unauthorized") {
    return { ok: false, error: "Sesja wygasła. Zaloguj się ponownie." };
  }
  console.error(error);
  return { ok: false, error: fallback };
}
