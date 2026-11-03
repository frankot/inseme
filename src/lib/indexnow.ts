import "server-only";

import { after } from "next/server";

import { absoluteUrl, isIndexable, SITE_URL } from "@/lib/site-url";

/**
 * IndexNow (docs/SEO_LAUNCH_PLAN.md, "IndexNow"): tells Bing — and through it
 * ChatGPT search and Copilot — plus Yandex, Seznam and Naver that a URL was
 * added, changed or removed, instead of waiting for their next crawl. Google
 * does not use it; for Google the sitemap and Search Console remain the route.
 *
 * The key is public by design: the endpoint verifies the host by fetching
 * `/<key>.txt` from it, which `public/` serves. Change both together.
 */
export const INDEXNOW_KEY = "90d664fcdba56a779a37873a0746c2a6";

/**
 * Queues one ping for the given site paths, sent after the response so the
 * admin never waits on it. Production only: a preview must not announce URLs
 * that exist only there. A failed ping is logged and otherwise ignored — the
 * crawlers still come by on their own.
 */
export function notifyIndexNow(paths: (string | null | undefined)[]): void {
  if (!isIndexable) return;
  const urlList = [...new Set(paths.filter((p): p is string => Boolean(p)).map(absoluteUrl))];
  if (urlList.length === 0) return;

  after(async () => {
    try {
      const res = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ host: new URL(SITE_URL).host, key: INDEXNOW_KEY, urlList }),
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) console.error(`[indexnow] HTTP ${res.status}`, urlList);
    } catch (error) {
      console.error("[indexnow] request failed", error);
    }
  });
}
