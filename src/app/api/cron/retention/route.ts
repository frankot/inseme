import { and, isNull, lt } from "drizzle-orm";

import { db } from "@/db";
import { contactSubmissions, leadSignups, screeningTestSubmissions } from "@/db/schema";
import { env } from "@/lib/env";

/**
 * Retention job (§8 of the backend plan). Soft-deletes personal data older than
 * `DATA_RETENTION_MONTHS`, so the site keeps only what it can justify keeping.
 *
 * Wired to Vercel Cron via `vercel.json`. Vercel sends the `CRON_SECRET` as a
 * bearer token; without a configured secret the route refuses every request
 * rather than running unauthenticated — a missing env var must disable the
 * endpoint, not open it.
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!env.CRON_SECRET) {
    return Response.json(
      { ok: false, error: "CRON_SECRET is not configured" },
      { status: 503 },
    );
  }

  const provided = request.headers.get("authorization");
  if (provided !== `Bearer ${env.CRON_SECRET}`) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - env.DATA_RETENTION_MONTHS);

  const now = new Date();
  const [contacts, submissions, signups] = await Promise.all([
    db
      .update(contactSubmissions)
      .set({ deletedAt: now })
      .where(
        and(isNull(contactSubmissions.deletedAt), lt(contactSubmissions.createdAt, cutoff)),
      )
      .returning({ id: contactSubmissions.id }),
    db
      .update(screeningTestSubmissions)
      .set({ deletedAt: now })
      .where(
        and(
          isNull(screeningTestSubmissions.deletedAt),
          lt(screeningTestSubmissions.createdAt, cutoff),
        ),
      )
      .returning({ id: screeningTestSubmissions.id }),
    db
      .update(leadSignups)
      .set({ deletedAt: now })
      .where(and(isNull(leadSignups.deletedAt), lt(leadSignups.createdAt, cutoff)))
      .returning({ id: leadSignups.id }),
  ]);

  const result = {
    ok: true,
    cutoff: cutoff.toISOString(),
    retentionMonths: env.DATA_RETENTION_MONTHS,
    softDeleted: {
      contactSubmissions: contacts.length,
      screeningTestSubmissions: submissions.length,
      leadSignups: signups.length,
    },
  };

  console.log("retention job", JSON.stringify(result));
  return Response.json(result, { headers: { "cache-control": "no-store" } });
}
