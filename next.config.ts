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
 * The CSP ships report-only until it has been watched on production: the admin
 * PUTs uploads straight to R2 and the site embeds the OSM map, and a wrong
 * directive there fails silently for the client. Once the browser console is
 * clean on every page and an upload works, rename the header to enforce it.
 *
 * `'unsafe-inline'` scripts are required by Next's inline bootstrap without a
 * nonce; `'unsafe-eval'` only in dev, for React's debugging tools.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  "connect-src 'self' https://*.r2.cloudflarestorage.com",
  "frame-src https://www.openstreetmap.org",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Content-Security-Policy-Report-Only", value: csp },
];

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
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
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
