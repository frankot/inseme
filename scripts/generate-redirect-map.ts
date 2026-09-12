/**
 * Builds a starting `redirect-map.json` from the old site's sitemap.
 *
 *   npm run redirects:generate -- https://stara-domena.pl/sitemap.xml
 *
 * Every discovered URL is written with `to: ""`, deliberately: guessing the new
 * URL from an old slug produces confident nonsense, and a wrong 308 is worse
 * than a 404. Fill the blanks in by hand, then redeploy. Entries still empty are
 * skipped by `next.config.ts`, so a half-finished file is safe to commit.
 */
import { readFileSync, writeFileSync } from "node:fs";

type RedirectEntry = { from: string; to: string; permanent: boolean };

async function main() {
  const source = process.argv[2];
  if (!source) {
    throw new Error("Podaj adres sitemapy, np. https://stara-domena.pl/sitemap.xml");
  }

  const response = await fetch(source);
  if (!response.ok) {
    throw new Error(`Nie udało się pobrać ${source}: HTTP ${response.status}`);
  }
  const xml = await response.text();

  const paths = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)]
    .map((match) => {
      try {
        return new URL(match[1]).pathname;
      } catch {
        return null;
      }
    })
    .filter((path): path is string => Boolean(path) && path !== "/")
    .filter((path, index, all) => all.indexOf(path) === index)
    .sort();

  const current = JSON.parse(readFileSync("redirect-map.json", "utf8")) as {
    _comment: string[];
    redirects: RedirectEntry[];
  };

  // Anything already mapped keeps its target — re-running never loses work.
  const existing = new Map(current.redirects.map((entry) => [entry.from, entry]));
  const merged: RedirectEntry[] = paths.map(
    (path) => existing.get(path) ?? { from: path, to: "", permanent: true },
  );
  for (const entry of current.redirects) {
    if (!merged.some((row) => row.from === entry.from)) merged.push(entry);
  }

  writeFileSync(
    "redirect-map.json",
    `${JSON.stringify({ ...current, redirects: merged }, null, 2)}\n`,
  );

  const unmapped = merged.filter((entry) => !entry.to).length;
  console.log(`✓ ${merged.length} adresów w redirect-map.json`);
  if (unmapped > 0) {
    console.log(`  ${unmapped} bez celu — uzupełnij pole "to" i wdróż ponownie.`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
