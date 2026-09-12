import { readFileSync } from "node:fs";

import type { NextConfig } from "next";

type RedirectEntry = { from: string; to: string; permanent: boolean };

/**
 * Cutover redirects from the decommissioned old site — a checked-in file rather
 * than a CMS table (§9 of the backend plan). Entries with an empty `to` are
 * placeholders written by `scripts/generate-redirect-map.ts` and are skipped, so
 * a partially mapped file never ships a redirect to nowhere.
 */
function loadRedirects(): RedirectEntry[] {
  try {
    const file = JSON.parse(readFileSync("./redirect-map.json", "utf8")) as {
      redirects?: RedirectEntry[];
    };
    return (file.redirects ?? []).filter(
      (entry) => entry.from?.startsWith("/") && entry.to?.trim(),
    );
  } catch {
    return [];
  }
}

/**
 * Images live in R2 behind a Cloudflare custom domain, so resizing happens
 * there (see `src/lib/image-loader.ts`) instead of in Vercel's optimizer.
 * The loader applies to every `next/image`, and passes local assets through.
 */
const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
  async redirects() {
    return loadRedirects().map((entry) => ({
      source: entry.from,
      destination: entry.to,
      permanent: entry.permanent !== false,
    }));
  },
};

export default nextConfig;
