import { z } from "zod";

/**
 * Server-side environment. Imported only from server code (db client, auth,
 * scripts) — never from a client component, or the secrets end up in the bundle.
 *
 * Required vars fail fast at import time; everything a later phase needs
 * (R2, Resend, Upstash) stays optional so B1 runs with just a database.
 */
const envSchema = z.object({
  DATABASE_URL: z.url("DATABASE_URL must be a valid Postgres connection string"),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),

  // Phase B2+ — optional until the media library lands.
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET: z.string().optional(),
  R2_PUBLIC_URL: z.url().optional(),

  // Phase B3 — e-mail delivery. Without these the screening result is still
  // scored, stored and shown on screen; only the PDF e-mail is skipped.
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM: z.string().optional(),
  /** Where contact-form notifications land. Falls back to `settings.email`. */
  NOTIFY_EMAIL: z.union([z.literal(""), z.email()]).optional(),

  // Phase B4 — spam throttling. Absent, submissions still work and are only
  // guarded by the honeypot; see `src/lib/rate-limit.ts`.
  UPSTASH_REDIS_REST_URL: z.union([z.literal(""), z.url()]).optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Phase B5 — retention job. The cron route rejects any request without it,
  // so a missing secret disables the endpoint rather than opening it.
  CRON_SECRET: z.string().optional(),
  /** How long personal data is kept before the job soft-deletes it. */
  DATA_RETENTION_MONTHS: z.coerce.number().int().min(1).max(120).default(24),

  /** Canonical origin, used for absolute links in e-mails and the PDF. */
  NEXT_PUBLIC_SITE_URL: z.url().default("https://osrodek-insieme.pl"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid environment variables:\n${issues}`);
}

export const env = parsed.data;
