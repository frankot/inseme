/**
 * Makes the responsive copies (`src/lib/image-variants.ts`) for photos that
 * didn't get them on upload.
 *
 *   npm run images:local      public/placeholder/*  →  …/name.w640.webp etc.
 *   npm run images:backfill   every library photo in R2 that lacks its copies
 *
 * Both only add files: originals are never touched, and a photo whose copies
 * already exist is skipped, so a re-run is safe. Same widths and quality as
 * the browser makes on upload; a copy is never upscaled.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { config as loadEnv } from "dotenv";
import sharp from "sharp";

import {
  hasVariants,
  VARIANT_QUALITY,
  VARIANT_WIDTHS,
  variantOf,
} from "../src/lib/image-variants";

loadEnv({ path: ".env.local", quiet: true });
loadEnv({ path: ".env", quiet: true });

async function render(original: Buffer) {
  const { width: originalWidth, format } = await sharp(original).metadata();
  return Promise.all(
    VARIANT_WIDTHS.map(async (width) => {
      const body = await sharp(original)
        .rotate() // EXIF orientation, as the browser applies it on upload
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: Math.round(VARIANT_QUALITY * 100), effort: 6 })
        .toBuffer();
      // At full size, re-encoding an already-compressed WebP only adds bytes:
      // the original *is* the best copy then.
      const sameSize = originalWidth !== undefined && width >= originalWidth;
      const reuse = sameSize && format === "webp" && original.length <= body.length;
      return { width, body: reuse ? original : body };
    }),
  );
}

async function local() {
  const dir = "public/placeholder";
  const files = readdirSync(dir).filter((name) => hasVariants(`/placeholder/${name}`));
  for (const name of files) {
    const original = readFileSync(path.join(dir, name));
    const variants = await render(original);
    for (const { width, body } of variants) {
      writeFileSync(path.join(dir, variantOf(name, width)), body);
    }
    const sizes = variants.map((v) => `${v.width}:${Math.round(v.body.length / 1024)}KB`).join(" ");
    console.log(`✓ ${name} (${Math.round(original.length / 1024)} KB) → ${sizes}`);
  }
}

async function backfill() {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) {
    throw new Error("Brak zmiennych R2_* w .env.local");
  }
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
  });

  // Imported after dotenv: `src/lib/env.ts` validates at module load.
  const { db } = await import("../src/db");
  const { media } = await import("../src/db/schema");
  const rows = (await db.select({ key: media.r2Key, url: media.url }).from(media)).filter((row) =>
    hasVariants(row.url),
  );

  let made = 0;
  for (const row of rows) {
    // The largest copy goes up last, so its presence means the set is complete.
    const done = await fetch(variantOf(row.url, VARIANT_WIDTHS.at(-1)!), { method: "HEAD" });
    if (done.ok) {
      console.log(`· ${row.key} — już ma kopie`);
      continue;
    }
    const response = await fetch(row.url);
    if (!response.ok) {
      console.error(`✗ ${row.key} — nie udało się pobrać oryginału (${response.status})`);
      continue;
    }
    const variants = await render(Buffer.from(await response.arrayBuffer()));
    for (const { width, body } of variants) {
      await client.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET,
          Key: variantOf(row.key, width),
          Body: body,
          ContentType: "image/webp",
          CacheControl: "public, max-age=31536000, immutable",
        }),
      );
    }
    made++;
    console.log(`✓ ${row.key}`);
  }
  console.log(`\n${made} z ${rows.length} zdjęć dostało kopie.`);
}

const mode = process.argv[2];
(mode === "--local" ? local() : mode === "--backfill" ? backfill() : Promise.reject(new Error("--local albo --backfill")))
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
