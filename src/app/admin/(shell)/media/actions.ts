"use server";

import { DeleteObjectCommand, DeleteObjectsCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { media } from "@/db/schema";
import { actionError, type ActionResult, type DataResult } from "@/lib/action-result";
import { requireAdmin } from "@/lib/auth-guard";
import { hasVariants, VARIANT_WIDTHS, variantOf } from "@/lib/image-variants";
import { renderVariants } from "@/lib/image-variants-server";
import { loadMediaInventory } from "@/lib/media-inventory";
import { toMediaSummary } from "@/lib/media-summary";
import type { MediaSummary } from "@/lib/media-types";
import {
  ALLOWED_UPLOAD_TYPES,
  buildObjectKey,
  createR2Client,
  getR2Config,
  MAX_UPLOAD_BYTES,
  publicUrlFor,
} from "@/lib/r2";
import { mediaAltTextSchema } from "@/lib/validations/content";

const R2_MISSING = "Magazyn plików (R2) nie jest skonfigurowany. Uzupełnij zmienne R2_* w środowisku.";

export async function listMedia(): Promise<DataResult<MediaSummary[]>> {
  try {
    await requireAdmin();
    const rows = await db.select().from(media).orderBy(desc(media.uploadedAt));
    return { ok: true, data: rows.map(toMediaSummary) };
  } catch (error) {
    return actionError(error, "Nie udało się wczytać biblioteki mediów.");
  }
}

const uploadRequestSchema = z.object({
  fileName: z.string().min(1).max(255),
  contentType: z.enum(ALLOWED_UPLOAD_TYPES),
  size: z.number().int().positive().max(MAX_UPLOAD_BYTES, "Plik jest za duży (maks. 15 MB)."),
});

/**
 * Hands the browser a short-lived URL so the file goes straight to R2 — no
 * multi-megabyte body through a serverless function. A photo's responsive
 * copies are made afterwards, on the server, in `registerMedia`.
 */
export async function createUploadUrl(
  input: z.infer<typeof uploadRequestSchema>,
): Promise<DataResult<{ uploadUrl: string; key: string; publicUrl: string }>> {
  try {
    await requireAdmin();
    const parsed = uploadRequestSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Nieprawidłowy plik." };
    }

    const config = getR2Config();
    if (!config) return { ok: false, error: R2_MISSING };

    const key = buildObjectKey(parsed.data.contentType, parsed.data.fileName);
    const client = createR2Client(config);
    const uploadUrl = await getSignedUrl(
      client,
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        ContentType: parsed.data.contentType,
      }),
      { expiresIn: 300 },
    );

    return { ok: true, data: { uploadUrl, key, publicUrl: publicUrlFor(config, key) } };
  } catch (error) {
    return actionError(error, "Nie udało się przygotować przesyłania pliku.");
  }
}

const registerSchema = z.object({
  key: z.string().min(1),
  url: z.url(),
  mimeType: z.enum(ALLOWED_UPLOAD_TYPES),
  size: z.number().int().positive().max(MAX_UPLOAD_BYTES),
  width: z.number().int().positive().nullable().default(null),
  height: z.number().int().positive().nullable().default(null),
  altText: z.string().trim().max(300).optional(),
});

/**
 * Makes and stores a photo's responsive copies (`image-variants.ts`) from the
 * original just uploaded. The site's image loader asks for these copies by
 * name, so a photo without them would show as broken: on failure the
 * original is removed too and the upload reported as failed.
 */
async function storeVariants(key: string): Promise<boolean> {
  const config = getR2Config();
  if (!config) return false;
  const client = createR2Client(config);
  try {
    const object = await client.send(new GetObjectCommand({ Bucket: config.bucket, Key: key }));
    const original = Buffer.from(await object.Body!.transformToByteArray());
    const variants = await renderVariants(original);
    await Promise.all(
      variants.map(({ width, body }) =>
        client.send(
          new PutObjectCommand({
            Bucket: config.bucket,
            Key: variantOf(key, width),
            Body: body,
            ContentType: "image/webp",
            CacheControl: "public, max-age=31536000, immutable",
          }),
        ),
      ),
    );
    return true;
  } catch (error) {
    console.error(`[media] copies for ${key} failed`, error);
    await client.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key })).catch(() => {});
    return false;
  }
}

/** Called after the browser's PUT succeeds — makes the copies, then records the file. */
export async function registerMedia(
  input: z.infer<typeof registerSchema>,
): Promise<DataResult<MediaSummary>> {
  try {
    await requireAdmin();
    const parsed = registerSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: "Nieprawidłowe dane pliku." };
    }

    // The key comes from the browser: it must be the object the URL points at.
    const config = getR2Config();
    if (config && parsed.data.url !== publicUrlFor(config, parsed.data.key)) {
      return { ok: false, error: "Nieprawidłowe dane pliku." };
    }

    if (hasVariants(parsed.data.url) && !(await storeVariants(parsed.data.key))) {
      return { ok: false, error: "Nie udało się przygotować zdjęcia. Sprawdź, czy plik jest poprawnym zdjęciem, i spróbuj ponownie." };
    }

    const [row] = await db
      .insert(media)
      .values({
        r2Key: parsed.data.key,
        url: parsed.data.url,
        mimeType: parsed.data.mimeType,
        size: parsed.data.size,
        width: parsed.data.width,
        height: parsed.data.height,
        altText: parsed.data.altText || null,
      })
      .returning();

    revalidatePath("/admin/media");
    return { ok: true, data: toMediaSummary(row) };
  } catch (error) {
    return actionError(error, "Nie udało się zapisać pliku w bibliotece.");
  }
}

export async function updateMediaAltText(
  input: z.input<typeof mediaAltTextSchema>,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = mediaAltTextSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "Nieprawidłowy opis alternatywny." };

    await db
      .update(media)
      .set({ altText: parsed.data.altText || null })
      .where(eq(media.id, parsed.data.id));

    revalidatePath("/admin/media");
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się zapisać opisu.");
  }
}

export async function deleteMedia(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const row = await db.query.media.findFirst({ where: eq(media.id, id) });
    if (!row) return { ok: false, error: "Nie znaleziono pliku." };

    const config = getR2Config();
    if (config) {
      const client = createR2Client(config);
      // The original and its responsive copies, if it has any.
      const keys = [
        row.r2Key,
        ...(hasVariants(row.url) ? VARIANT_WIDTHS.map((width) => variantOf(row.r2Key, width)) : []),
      ];
      await Promise.all(
        keys.map((key) => client.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key }))),
      );
    }

    // FKs referencing this row are ON DELETE SET NULL, so pages/articles keep
    // working with an empty image slot rather than failing the delete.
    await db.delete(media).where(eq(media.id, id));

    revalidatePath("/admin/media");
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się usunąć pliku.");
  }
}

/**
 * Deletes a stray group — objects no table knows about (`media-inventory.ts`).
 * The group comes from the browser, so the bucket is listed again here: only
 * what is still stray — never a library file, its copies or a gallery photo —
 * can be removed this way.
 */
export async function deleteStrayObjects(group: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const config = getR2Config();
    if (!config) return { ok: false, error: R2_MISSING };

    const { items, bucketListed } = await loadMediaInventory();
    if (!bucketListed) return { ok: false, error: "Nie udało się odczytać zawartości magazynu. Spróbuj ponownie." };
    const stray = items.find((entry) => entry.kind === "stray" && entry.group === group);
    if (!stray || stray.kind !== "stray") {
      return { ok: false, error: "Tego pliku nie można usunąć stąd — należy do biblioteki albo galerii." };
    }

    await createR2Client(config).send(
      new DeleteObjectsCommand({
        Bucket: config.bucket,
        Delete: { Objects: stray.keys.map((key) => ({ Key: key })), Quiet: true },
      }),
    );
    revalidatePath("/admin/media");
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się usunąć pliku z magazynu.");
  }
}
