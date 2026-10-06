/**
 * Checks the cutover from the old WordPress site against a running deployment.
 *
 *   npm run redirects:check -- https://<preview>.vercel.app
 *   npm run redirects:check -- https://www.osrodek-insieme.pl
 *
 * For every row of `scripts/old-site-urls.txt`, with and without the trailing
 * slash, it follows the redirects by hand and asserts:
 *   - the first hop is permanent (308/301), never 302/307,
 *   - the chain ends on the expected path with 200 (or 404 for rows marked so),
 *   - there are at most two hops,
 *   - the final page's canonical is that path on the canonical origin.
 * Then every URL in the deployment's sitemap must answer 200 with no redirect.
 *
 * Against the canonical origin itself (launch day) it also checks that the apex
 * and http:// land on https://www, and that robots.txt and the home page let
 * crawlers in — shipping a noindex is the classic launch-day disaster.
 *
 * Exits 1 on any failure. docs/SEO_LAUNCH_PLAN.md §3.3, §6.2.
 */
import { readFileSync } from "node:fs";

const CANONICAL_ORIGIN = "https://www.osrodek-insieme.pl";
const MAX_HOPS = 2;

type Hop = { url: string; status: number };
type Result = { hops: Hop[]; final: Hop; html: string };

const failures: string[] = [];
let passed = 0;

function check(ok: boolean, label: string, detail: string) {
  if (ok) {
    passed += 1;
  } else {
    failures.push(`${label}\n    ${detail}`);
  }
}

async function follow(url: string): Promise<Result> {
  const hops: Hop[] = [];
  let current = url;
  for (let i = 0; i <= 5; i++) {
    const response = await fetch(current, { redirect: "manual" });
    const location = response.headers.get("location");
    if (response.status >= 300 && response.status < 400 && location) {
      hops.push({ url: current, status: response.status });
      current = new URL(location, current).toString();
      continue;
    }
    const html = response.headers.get("content-type")?.includes("text/html")
      ? await response.text()
      : "";
    return { hops, final: { url: current, status: response.status }, html };
  }
  throw new Error(`Redirect loop: ${url}`);
}

function chain(result: Result): string {
  return [...result.hops, result.final].map((hop) => `${hop.status} ${hop.url}`).join(" → ");
}

function canonicalOf(html: string): string | null {
  const tag = html.match(/<link[^>]+rel="canonical"[^>]*>/)?.[0];
  return tag?.match(/href="([^"]+)"/)?.[1] ?? null;
}

function readInventory(): { path: string; expected: string }[] {
  return readFileSync("scripts/old-site-urls.txt", "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const [path, expected] = line.split(/\s+/);
      return { path, expected };
    });
}

async function checkOldUrl(base: string, path: string, expected: string) {
  const result = await follow(base + path);
  const label = `${path} → ${expected}`;

  if (expected === "404") {
    check(result.final.status === 404, label, chain(result));
    return;
  }

  const finalPath = new URL(result.final.url).pathname;
  check(
    result.final.status === 200 && finalPath === expected,
    label,
    `ends wrong: ${chain(result)}`,
  );
  if (result.hops.length > 0) {
    check(
      [301, 308].includes(result.hops[0].status),
      `${label} (permanent)`,
      `first hop is not permanent: ${chain(result)}`,
    );
  }
  check(
    result.hops.length <= MAX_HOPS,
    `${label} (≤ ${MAX_HOPS} hops)`,
    `${result.hops.length} hops: ${chain(result)}`,
  );
  if (result.final.status === 200) {
    const canonical = canonicalOf(result.html);
    const want = CANONICAL_ORIGIN + (expected === "/" ? "" : expected);
    check(
      canonical === want || canonical === want + "/",
      `${label} (canonical)`,
      `canonical is ${canonical ?? "missing"}, expected ${want}`,
    );
  }
}

async function checkSitemap(base: string) {
  const response = await fetch(`${base}/sitemap.xml`);
  check(response.ok, "/sitemap.xml", `HTTP ${response.status}`);
  if (!response.ok) return;

  const locs = [...(await response.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  check(locs.length > 0, "/sitemap.xml has URLs", "empty sitemap");
  for (const loc of locs) {
    const url = new URL(loc);
    check(
      url.origin === CANONICAL_ORIGIN,
      `sitemap ${url.pathname} (origin)`,
      `listed as ${url.origin}, expected ${CANONICAL_ORIGIN} — is NEXT_PUBLIC_SITE_URL set?`,
    );
    const result = await follow(base + url.pathname);
    check(
      result.hops.length === 0 && result.final.status === 200,
      `sitemap ${url.pathname}`,
      chain(result),
    );
  }
}

async function checkProduction() {
  const host = new URL(CANONICAL_ORIGIN).host;
  const apex = host.replace(/^www\./, "");
  for (const variant of [`https://${apex}/kontakt/`, `http://${apex}/`, `http://${host}/`]) {
    const result = await follow(variant);
    const final = new URL(result.final.url);
    check(
      final.origin === CANONICAL_ORIGIN && result.final.status === 200,
      `${variant} → ${CANONICAL_ORIGIN}`,
      chain(result),
    );
  }

  const robots = await (await fetch(`${CANONICAL_ORIGIN}/robots.txt`)).text();
  check(
    !/^Disallow:\s*\/\s*$/m.test(robots),
    "robots.txt lets crawlers in",
    robots.replace(/\n/g, "\n    "),
  );
  const home = await (await fetch(`${CANONICAL_ORIGIN}/`)).text();
  check(
    !/<meta[^>]+name="robots"[^>]+noindex/.test(home),
    "home page has no noindex",
    "a <meta name=robots content=noindex> is on the production home page",
  );
}

async function main() {
  const base = process.argv[2]?.replace(/\/$/, "");
  if (!base) {
    throw new Error("Podaj adres wdrożenia, np. https://www.osrodek-insieme.pl");
  }

  const inventory = readInventory();
  for (const { path, expected } of inventory) {
    await checkOldUrl(base, path, expected);
    if (path !== "/" && path.endsWith("/")) {
      await checkOldUrl(base, path.slice(0, -1), expected);
    }
  }
  await checkSitemap(base);
  if (base === CANONICAL_ORIGIN) {
    await checkProduction();
  } else {
    console.log(`· ${base} is not ${CANONICAL_ORIGIN}: host, robots and noindex checks skipped`);
  }

  console.log(`\n✓ ${passed} passed`);
  if (failures.length > 0) {
    console.log(`✗ ${failures.length} failed:\n`);
    for (const failure of failures) console.log(`  ✗ ${failure}`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
