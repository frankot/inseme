/**
 * Parses every CMS page's seed (which is also its fallback) against the
 * section schemas, so copy in `src/content/*` cannot silently stop matching
 * the CMS fields. Run before deploy:
 *
 *   npm run cms:check
 */
import { docErrors, normalizeDoc } from "../src/cms/define";
import { cmsPageList } from "../src/cms/registry";

let failed = false;

for (const page of cmsPageList) {
  const ids = page.sections.map((section) => section.id);
  const duplicate = ids.find((id, i) => ids.indexOf(id) !== i);
  if (duplicate) {
    failed = true;
    console.error(`✗ ${page.key}: duplicate section id "${duplicate}"`);
  }

  const errors = docErrors(page, normalizeDoc(page, page.seed()));
  const lines = Object.entries(errors).flatMap(([id, list]) => list.map((e) => `    ${id}: ${e}`));
  if (lines.length) {
    failed = true;
    console.error(`✗ ${page.key}\n${lines.join("\n")}`);
  } else {
    console.log(`✓ ${page.key}`);
  }
}

process.exit(failed ? 1 : 0);
