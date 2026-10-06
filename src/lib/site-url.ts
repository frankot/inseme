/**
 * Canonical origin, without a trailing slash. Read straight from the public
 * env var rather than through `env.ts`, because breadcrumbs and other
 * client-rendered markup need it too — and `env.ts` validates server secrets
 * that do not exist in the browser.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.osrodek-insieme.pl"
).replace(/\/+$/, "");

export const SITE_NAME = "Insieme — ośrodek leczenia uzależnień";

/** `/zespol/anna` → `https://…/zespol/anna`; already-absolute URLs (R2) pass through. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Only the production deployment may be indexed. Vercel previews share the
 * production build output, so without this a preview URL can end up in Google
 * as a duplicate of the real site.
 */
export const isIndexable = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production";

/**
 * The site-wide Open Graph fields. A nested `openGraph` replaces its parent's
 * wholesale, so the site layout — which adds the share image from settings —
 * spreads these back in.
 */
export const BASE_OPEN_GRAPH = {
  type: "website",
  locale: "pl_PL",
  siteName: SITE_NAME,
} as const;
