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
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid environment variables:\n${issues}`);
}

export const env = parsed.data;
