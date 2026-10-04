import "server-only";

import { FEATURED_TEST_SLUG } from "@/content/screening";
import { getLatestArticle, getPublishedArticleById } from "@/lib/queries/articles";
import { getPublishedFaq, type FaqEntry } from "@/lib/queries/faq";
import { getScreeningTestById, getScreeningTestBySlug } from "@/lib/queries/screening";
import { getFeaturedTeam, getTeamByIds } from "@/lib/queries/team";

/**
 * Picked ids → published rows (plans/CMS_PLAN.md §3.3). Missing or
 * unpublished ids are dropped; an empty pick falls back to the automatic
 * choice the homepage made before the CMS (first FAQ rows, top of the team
 * order, the AUDIT test, the newest article). Every resolver tolerates a DB
 * error by returning nothing — the section then removes itself.
 */

async function safely<T>(label: string, run: () => Promise<T>, empty: T): Promise<T> {
  try {
    return await run();
  } catch (error) {
    console.error(`[cms-resolve] ${label} failed`, error);
    return empty;
  }
}

const ids = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
const id = (value: unknown): string | null => (typeof value === "string" && value ? value : null);

export function resolveFaq(value: unknown, limit: number) {
  return safely(
    "faq",
    async (): Promise<{ items: FaqEntry[]; total: number }> => {
      const all = await getPublishedFaq();
      const picked = ids(value);
      const byId = new Map(all.map((item) => [item.id, item]));
      const items = picked.length
        ? picked.flatMap((pid) => byId.get(pid) ?? [])
        : all.slice(0, limit);
      return { items, total: all.length };
    },
    { items: [], total: 0 },
  );
}

export function resolveTeam(value: unknown, limit: number) {
  const picked = ids(value);
  return safely(
    "team",
    () => (picked.length ? getTeamByIds(picked) : getFeaturedTeam(limit)),
    [],
  );
}

export function resolveTest(value: unknown) {
  const picked = id(value);
  return safely(
    "test",
    () => (picked ? getScreeningTestById(picked) : getScreeningTestBySlug(FEATURED_TEST_SLUG)),
    null,
  );
}

export function resolveArticle(value: unknown) {
  const picked = id(value);
  return safely(
    "article",
    async () => (picked ? ((await getPublishedArticleById(picked)) ?? getLatestArticle()) : getLatestArticle()),
    null,
  );
}
