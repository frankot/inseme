import type { MetadataRoute } from "next";

import { getArticleSitemapEntries } from "@/lib/queries/articles";
import { getScreeningSitemapEntries } from "@/lib/queries/screening";
import { getTeamSitemapEntries } from "@/lib/queries/team";
import { absoluteUrl } from "@/lib/site-url";

/** Same five-minute window as the pages it lists. */
export const revalidate = 300;

/** Public, indexable routes. /admin and /api are never listed. */
const STATIC_ROUTES = [
  "/",
  "/osrodek",
  "/program",
  "/cennik",
  "/zespol",
  "/porady",
  "/testy",
  "/faq",
  "/galeria",
  "/kontakt",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, team, tests] = await Promise.all([
    getArticleSitemapEntries(),
    getTeamSitemapEntries(),
    getScreeningSitemapEntries(),
  ]);

  const dynamic = [
    ...articles.map((row) => ({ path: `/porady/${row.slug}`, updatedAt: row.updatedAt })),
    ...team.map((row) => ({ path: `/zespol/${row.slug}`, updatedAt: row.updatedAt })),
    ...tests.map((row) => ({ path: `/testy/${row.slug}`, updatedAt: row.updatedAt })),
  ];

  // The static pages carry DB content too (latest article, team, FAQ), so the
  // newest edit anywhere is a fair "last modified" for them.
  const newest = dynamic.reduce<Date | undefined>(
    (max, row) => (!max || row.updatedAt > max ? row.updatedAt : max),
    undefined,
  );

  return [
    ...STATIC_ROUTES.map((path) => ({
      url: absoluteUrl(path),
      ...(newest && { lastModified: newest }),
    })),
    ...dynamic.map((row) => ({ url: absoluteUrl(row.path), lastModified: row.updatedAt })),
  ];
}
