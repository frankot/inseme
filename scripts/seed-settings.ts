/**
 * Fills the `settings` singleton with the values the site shipped with
 * (`src/content/settings.ts`) and puts `public/og-default.jpg` into the media
 * library as the default share image.
 *
 *   npm run seed:settings            # fill empty fields only
 *   npm run seed:settings -- --force # overwrite every field with the defaults
 *
 * Re-running is safe: an editor's value is never replaced without --force, and
 * the image is uploaded once — a second run finds it by its key suffix.
 * Without R2 credentials the image step is skipped; the site then serves the
 * checked-in file directly.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const OG_KEY_SUFFIX = "-og-default.jpg";

async function main() {
  // Imported after dotenv: `src/lib/env.ts` validates at module load.
  const { eq, like } = await import("drizzle-orm");
  const { db } = await import("../src/db");
  const { media, settings, SETTINGS_ID } = await import("../src/db/schema");
  const { DEFAULT_OG_IMAGE, joinAddress, siteSettingsDefaults: defaults } = await import(
    "../src/content/settings"
  );

  const force = process.argv.includes("--force");
  const row = await db.query.settings.findFirst({ where: eq(settings.id, SETTINGS_ID) });

  const ogImageId = (!force && row?.defaultOgImageId) || (await ensureOgImage());

  const seed = {
    phone: defaults.contact.phone,
    email: defaults.contact.email,
    address: joinAddress(defaults.contact),
    // `hours` stays empty until the client confirms them (see contactDefaults).
    privacyNote: defaults.privacyNote,
    consentBannerText: defaults.consentBannerText,
  };

  // Field by field: only what is empty, unless forced.
  const values: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(seed)) {
    const current = row?.[key as keyof typeof seed];
    if (force || !current?.trim()) values[key] = value;
  }
  if (ogImageId && (force || !row?.defaultOgImageId)) values.defaultOgImageId = ogImageId;

  if (Object.keys(values).length === 0) {
    console.log("· settings — wszystko już wypełnione, pomijam (--force, aby nadpisać)");
    process.exit(0);
  }

  await db
    .insert(settings)
    .values({ id: SETTINGS_ID, ...values, updatedAt: new Date() })
    .onConflictDoUpdate({ target: settings.id, set: { ...values, updatedAt: new Date() } });

  console.log(`✓ settings — zapisano: ${Object.keys(values).join(", ")}`);
  process.exit(0);

  /** The media row for og-default.jpg, uploading it to R2 the first time. */
  async function ensureOgImage(): Promise<string | null> {
    const existing = await db.query.media.findFirst({
      where: like(media.r2Key, `%${OG_KEY_SUFFIX}`),
    });
    if (existing) return existing.id;

    const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL } =
      process.env;
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET || !R2_PUBLIC_URL) {
      console.log("· og-default.jpg — brak konfiguracji R2, strona użyje pliku z /public");
      return null;
    }

    const { PutObjectCommand, S3Client } = await import("@aws-sdk/client-s3");
    const body = await readFile(join(process.cwd(), "public", DEFAULT_OG_IMAGE.url));
    // Same layout as uploads from the panel (`buildObjectKey` in src/lib/r2.ts).
    const key = `media/${new Date().getFullYear()}/${crypto.randomUUID()}${OG_KEY_SUFFIX}`;

    const client = new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
    });
    await client.send(
      new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: body, ContentType: "image/jpeg" }),
    );

    const [created] = await db
      .insert(media)
      .values({
        r2Key: key,
        url: `${R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`,
        altText: DEFAULT_OG_IMAGE.alt,
        width: DEFAULT_OG_IMAGE.width,
        height: DEFAULT_OG_IMAGE.height,
        mimeType: "image/jpeg",
        size: body.byteLength,
      })
      .returning({ id: media.id });

    console.log(`✓ og-default.jpg — przesłano do biblioteki mediów (${key})`);
    return created.id;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
