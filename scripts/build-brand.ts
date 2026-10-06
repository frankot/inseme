/**
 * Builds every derivative of the logo from the one master file,
 * `public/brand/logo-insieme.svg`:
 *
 *   npm run brand:build
 *
 *   public/brand/logo-insieme.png   raster for JSON-LD (`Organization.logo`)
 *   src/lib/brand/logo.ts           the paths, for the PDF (react-pdf <Svg>),
 *                                   and a 2× PNG for e-mails, inlined as base64
 *
 * E-mails get a PNG because Gmail and Outlook drop SVG. It is embedded in the
 * code rather than read from /public at send time: serverless bundles don't
 * reliably carry /public, and an inline (cid:) image doesn't depend on the
 * domain already pointing at this site.
 *
 * The master was traced from the 930 px PNG on Oct 6, 2026 (potrace, one
 * layer per brand colour). If the client supplies an official vector logo,
 * replace the master — three `<path>`s or more, any viewBox — and re-run.
 */
import { readFileSync, writeFileSync } from "node:fs";

import sharp from "sharp";

const MASTER = "public/brand/logo-insieme.svg";
/** Shown at 140 px wide in the e-mail header; rendered at 2× for retina. */
const EMAIL_WIDTH = 140;

async function main() {
  const svg = readFileSync(MASTER, "utf8");
  const viewBox = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  if (!viewBox) throw new Error(`${MASTER}: expected viewBox="0 0 w h"`);
  const [width, height] = [Number(viewBox[1]), Number(viewBox[2])];

  const paths = [...svg.matchAll(/<path\b[^>]*>/g)].map(([tag]) => {
    const fill = tag.match(/fill="([^"]+)"/)?.[1];
    const d = tag.match(/ d="([^"]+)"/)?.[1];
    if (!fill || !d) throw new Error(`${MASTER}: every <path> needs fill and d`);
    const evenOdd = /fill-rule="evenodd"/.test(tag);
    return { fill, d, fillRule: evenOdd ? ("evenodd" as const) : ("nonzero" as const) };
  });

  await sharp(Buffer.from(svg), { density: 144 })
    .resize(Math.round(width))
    .png({ compressionLevel: 9, palette: true })
    .toFile("public/brand/logo-insieme.png");

  const emailHeight = Math.round((EMAIL_WIDTH * height) / width);
  const emailPng = await sharp(Buffer.from(svg), { density: 144 })
    .resize(EMAIL_WIDTH * 2)
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();

  writeFileSync(
    "src/lib/brand/logo.ts",
    `/**
 * The Insieme logo, generated from \`${MASTER}\` by \`npm run brand:build\`.
 * Don't edit by hand — change the master and re-run.
 */

export const LOGO_VIEWBOX = { width: ${width}, height: ${height} } as const;

export const LOGO_PATHS: { fill: string; fillRule: "evenodd" | "nonzero"; d: string }[] = ${JSON.stringify(paths, null, 2)};

/** The e-mail header logo: display size, and a 2× PNG for retina screens. */
export const LOGO_EMAIL = {
  width: ${EMAIL_WIDTH},
  height: ${emailHeight},
  png: "${emailPng.toString("base64")}",
} as const;
`,
  );

  console.log(`✓ ${paths.length} paths, viewBox ${width}×${height}`);
  console.log(`✓ public/brand/logo-insieme.png`);
  console.log(`✓ src/lib/brand/logo.ts (e-mail PNG ${(emailPng.length / 1024).toFixed(1)} KB)`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
