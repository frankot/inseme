import type { MetadataRoute } from "next";

import { absoluteUrl, isIndexable } from "@/lib/site-url";

/**
 * Production lets crawlers in everywhere but the panel and the API. Every other
 * deployment (Vercel previews, local builds) shuts them out entirely — the root
 * layout also sends `noindex` there, since a disallow alone does not stop a
 * linked URL from being indexed.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
