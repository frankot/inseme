"use server";

import { DeleteObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { asc, desc, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { galleryPhotos } from "@/db/schema";
import { actionError, type ActionResult, type DataResult } from "@/lib/action-result";
import { requireAdmin } from "@/lib/auth-guard";
import { galleryAlt, type GalleryPhotoAdmin } from "@/lib/gallery-types";
import {
  buildGalleryKey,
  createR2Client,
  getR2Config,
  isGalleryKey,
  MAX_UPLOAD_BYTES,
  publicUrlFor,
} from "@/lib/r2";
import {
  emptyToNull,
  galleryPhotoCreateSchema,
  galleryPhotoSchema,
  galleryReorderSchema,
  type GalleryPhotoCreateInput,
  type GalleryPhotoInput,
} from "@/lib/validations/content";

const R2_MISSING =
  "Magazyn plików (R2) nie jest skonfigurowany. Uzupełnij zmienne R2_* w środowisku.";

/**
 * Every write refreshes the admin list and /osrodek, whose gallery band is
 * prerendered. /galeria is dynamic and uncached, so it needs nothing — it
 * reads the table on the next request either way.
 */
function refreshGallery() {
  revalidatePath("/admin/gallery");
  revalidatePath("/osrodek");
}

type Row = typeof galleryPhotos.$inferSelect;

function toAdminView(row: Row): GalleryPhotoAdmin {
  return {
    id: row.id,
    alt: galleryAlt(row.altText, row.description),
    altText: row.altText,
    description: row.description,
    thumb: { url: row.thumbUrl, width: row.thumbWidth, height: row.thumbHeight },
    full: { url: row.fullUrl, width: row.fullWidth, height: row.fullHeight },
    status: row.status,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    sortOrder: row.sortOrder,
    totalSize: row.thumbSize + row.fullSize,
  };
}

/** The admin grid's ordering, which the public list mirrors exactly. */
export async function listGalleryPhotos(): Promise<DataResult<GalleryPhotoAdmin[]>> {
  try {
    await requireAdmin();
    const rows = await db
      .select()
      .from(galleryPhotos)
      .orderBy(asc(galleryPhotos.sortOrder), desc(galleryPhotos.createdAt));
    return { ok: true, data: rows.map(toAdminView) };
  } catch (error) {
    return actionError(error, "Nie udało się wczytać galerii.");
  }
}

const uploadRequestSchema = z.object({
  fullSize: z.number().int().positive().max(MAX_UPLOAD_BYTES, "Zdjęcie jest za duże."),
  thumbSize: z.number().int().positive().max(MAX_UPLOAD_BYTES, "Miniatura jest za duża."),
});

export type GalleryUploadTarget = { uploadUrl: string; key: string; publicUrl: string };

/**
 * Both presigned URLs in one round trip.
 *
 * The sizes are the *converted* WebP blobs, not the file the editor picked —
 * `src/lib/gallery-image.ts` resizes and encodes before this is called, so the
 * original never crosses the network and these are reliably a few hundred kB.
 */
export async function createGalleryUploadUrls(
  input: z.infer<typeof uploadRequestSchema>,
): Promise<DataResult<{ full: GalleryUploadTarget; thumb: GalleryUploadTarget }>> {
  try {
    await requireAdmin();
    const parsed = uploadRequestSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Nieprawidłowe zdjęcie." };
    }

    const config = getR2Config();
    if (!config) return { ok: false, error: R2_MISSING };

    const client = createR2Client(config);
    // One id for the pair, so both objects sort together in the bucket.
    const photoId = crypto.randomUUID();

    const sign = async (variant: "full" | "thumb"): Promise<GalleryUploadTarget> => {
      const key = buildGalleryKey(photoId, variant);
      const uploadUrl = await getSignedUrl(
        client,
        new PutObjectCommand({
          Bucket: config.bucket,
          Key: key,
          ContentType: "image/webp",
          // Keys are content-addressed by a fresh UUID and never rewritten, so
          // this is safe to cache hard — which matters on a bucket with no
          // edge resizing to sit behind.
          CacheControl: "public, max-age=31536000, immutable",
        }),
        { expiresIn: 300 },
      );
      return { uploadUrl, key, publicUrl: publicUrlFor(config, key) };
    };

    const [full, thumb] = await Promise.all([sign("full"), sign("thumb")]);
    return { ok: true, data: { full, thumb } };
  } catch (error) {
    return actionError(error, "Nie udało się przygotować wysyłki zdjęcia.");
  }
}

/**
 * Records the pair after both PUTs succeed. New photos land as drafts at the
 * front of the order — publishing stays a deliberate second step, as it is for
 * every other content type here.
 */
export async function createGalleryPhoto(
  input: GalleryPhotoCreateInput,
): Promise<DataResult<GalleryPhotoAdmin>> {
  try {
    await requireAdmin();
    const parsed = galleryPhotoCreateSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "Nieprawidłowe dane zdjęcia." };

    const config = getR2Config();
    if (!config) return { ok: false, error: R2_MISSING };

    // The keys and URLs came from the browser. An admin is trusted, but not to
    // the point of naming an arbitrary object or pointing a row at another host.
    const { full, thumb } = parsed.data;
    const wellFormed = [full, thumb].every(
      (variant) =>
        isGalleryKey(variant.key) && variant.url === publicUrlFor(config, variant.key),
    );
    if (!wellFormed) return { ok: false, error: "Nieprawidłowa ścieżka pliku." };

    // Everything defaults to sortOrder 0 and ties break on createdAt, so a new
    // photo is already first. Only a reordered gallery needs the explicit -1.
    const [{ first }] = await db
      .select({ first: sql<number>`coalesce(min(${galleryPhotos.sortOrder}), 0)` })
      .from(galleryPhotos);

    const [row] = await db
      .insert(galleryPhotos)
      .values({
        altText: emptyToNull(parsed.data.altText),
        description: emptyToNull(parsed.data.description),
        fullKey: full.key,
        fullUrl: full.url,
        fullWidth: full.width,
        fullHeight: full.height,
        fullSize: full.size,
        thumbKey: thumb.key,
        thumbUrl: thumb.url,
        thumbWidth: thumb.width,
        thumbHeight: thumb.height,
        thumbSize: thumb.size,
        sortOrder: Math.min(0, first),
      })
      .returning();

    refreshGallery();
    return { ok: true, data: toAdminView(row) };
  } catch (error) {
    return actionError(error, "Nie udało się zapisać zdjęcia.");
  }
}

/** Caption, alt text and position — the only editable fields on a photo. */
export async function updateGalleryPhoto(
  id: string,
  input: GalleryPhotoInput,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = galleryPhotoSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
    }

    await db
      .update(galleryPhotos)
      .set({
        altText: emptyToNull(parsed.data.altText),
        description: emptyToNull(parsed.data.description),
        sortOrder: parsed.data.sortOrder,
        updatedAt: new Date(),
      })
      .where(eq(galleryPhotos.id, id));

    refreshGallery();
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się zapisać zdjęcia.");
  }
}

export async function publishGalleryPhoto(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db
      .update(galleryPhotos)
      .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
      .where(eq(galleryPhotos.id, id));
    refreshGallery();
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się opublikować zdjęcia.");
  }
}

export async function unpublishGalleryPhoto(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db
      .update(galleryPhotos)
      .set({ status: "draft", updatedAt: new Date() })
      .where(eq(galleryPhotos.id, id));
    refreshGallery();
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się cofnąć publikacji.");
  }
}

/** Publishes a whole batch — what an editor wants after uploading twenty photos. */
export async function publishGalleryPhotos(ids: string[]): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = galleryReorderSchema.safeParse({ ids });
    if (!parsed.success) return { ok: false, error: "Nie wybrano zdjęć." };

    await db
      .update(galleryPhotos)
      .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
      .where(inArray(galleryPhotos.id, parsed.data.ids));

    refreshGallery();
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się opublikować zdjęć.");
  }
}

/**
 * Writes the whole visible order in one statement.
 *
 * A drag can move a photo across two hundred others, so sending positions one
 * at a time would be two hundred round trips. `UPDATE … FROM (VALUES …)` does
 * it once, and because the client sends the complete list the result cannot
 * drift out of step with what the editor sees.
 */
export async function reorderGalleryPhotos(ids: string[]): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = galleryReorderSchema.safeParse({ ids });
    if (!parsed.success) return { ok: false, error: "Nieprawidłowa kolejność." };

    const values = sql.join(
      parsed.data.ids.map((id, index) => sql`(${id}::uuid, ${index}::int)`),
      sql`, `,
    );

    await db.execute(sql`
      update ${galleryPhotos}
      set sort_order = ordering.position, updated_at = now()
      from (values ${values}) as ordering(id, position)
      where ${galleryPhotos.id} = ordering.id
    `);

    refreshGallery();
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się zapisać kolejności.");
  }
}

/** Removes the row and both R2 objects — nothing else references them. */
export async function deleteGalleryPhoto(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const row = await db.query.galleryPhotos.findFirst({ where: eq(galleryPhotos.id, id) });
    if (!row) return { ok: false, error: "Nie znaleziono zdjęcia." };

    const config = getR2Config();
    if (config) {
      const client = createR2Client(config);
      await client.send(
        new DeleteObjectsCommand({
          Bucket: config.bucket,
          Delete: { Objects: [{ Key: row.fullKey }, { Key: row.thumbKey }], Quiet: true },
        }),
      );
    }

    await db.delete(galleryPhotos).where(eq(galleryPhotos.id, id));

    refreshGallery();
    return { ok: true };
  } catch (error) {
    return actionError(error, "Nie udało się usunąć zdjęcia.");
  }
}
