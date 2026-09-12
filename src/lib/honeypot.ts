/**
 * Shared by the forms and the server actions, so it carries no `server-only`
 * guard: the client has to render the field, the server has to read it.
 *
 * A field no human sees and every naive bot fills in. Submissions that carry a
 * value are dropped silently — reporting the rejection would just teach the bot
 * which field to leave alone.
 */
export const HONEYPOT_FIELD = "company";

export function isBot(form: { [HONEYPOT_FIELD]?: string | undefined }): boolean {
  return Boolean(form[HONEYPOT_FIELD]?.trim());
}
