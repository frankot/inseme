import "server-only";

import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { desc } from "drizzle-orm";

import { cmsPageList } from "@/cms/registry";
import { db } from "@/db";
import { articles, cmsPages, galleryPhotos, media, teamMembers } from "@/db/schema";
import { hasVariants, VARIANT_WIDTHS, variantOf } from "@/lib/image-variants";
import { toMediaSummary } from "@/lib/media-summary";
import type { InventoryItem, MediaUsage } from "@/lib/media-types";
import { galleryAlt } from "@/lib/gallery-types";
import { createR2Client, getR2Config, publicUrlFor, type R2Config } from "@/lib/r2";

type BucketObject = { key: string; size: number; lastModified: Date | undefined };

async function listBucket(): Promise<BucketObject[] | null> {
  const config = getR2Config();
  if (!config) return null;
  const client = createR2Client(config);
  const objects: BucketObject[] = [];
  let token: string | undefined;
  do {
    const page = await client.send(new ListObjectsV2Command({ Bucket: config.bucket, ContinuationToken: token }));
    for (const object of page.Contents ?? []) {
      if (object.Key) objects.push({ key: object.Key, size: object.Size ?? 0, lastModified: object.LastModified });
    }
    token = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (token);
  return objects;
}

/**
 * `…/<uuid>-dom.jpg`, `…/<uuid>-dom.w640.webp` → `…/<uuid>-dom`;
 * `…/<uuid>-full.webp`, `…/<uuid>-thumb.jpg` → `…/<uuid>`. One photo's objects
 * share it, so they show as one card.
 */
function groupOf(key: string): string {
  return key.replace(/\.w\d+\.webp$/, "").replace(/-(full|thumb)\.(webp|jpg)$/, "").replace(/\.[a-z0-9]+$/i, "");
}

/** Prefers the original, then a gallery full, then the largest copy. */
function rank(key: string): number {
  if (/-thumb\.(webp|jpg)$/.test(key)) return 1;
  const copy = key.match(/\.w(\d+)\.webp$/);
  if (copy) return 2 + Number(copy[1]) / 10000;
  return 10;
}

function groupStrays(objects: BucketObject[], config: R2Config): InventoryItem[] {
  const groups = new Map<string, BucketObject[]>();
  for (const object of objects) {
    const group = groupOf(object.key);
    groups.set(group, [...(groups.get(group) ?? []), object]);
  }
  return [...groups].map(([group, members]): InventoryItem => {
    const best = members.reduce((a, b) => (rank(b.key) > rank(a.key) ? b : a));
    const newest = Math.max(...members.map((object) => object.lastModified?.getTime() ?? 0));
    return {
      kind: "stray",
      group,
      keys: members.map((object) => object.key),
      url: publicUrlFor(config, best.key),
      size: members.reduce((sum, object) => sum + object.size, 0),
      uploadedAt: new Date(newest).toISOString(),
    };
  });
}

/** A file is "in" a document when its id or URL appears anywhere in the JSON. */
const mentions = (doc: unknown, id: string, url: string) => {
  if (!doc) return false;
  const json = JSON.stringify(doc);
  return json.includes(id) || json.includes(url);
};

/**
 * Every object in the bucket, newest first, each with what it is and — for a
 * library file — where it is used. The `media` and `gallery_photos` tables
 * explain most objects; a library photo's `.w640.webp`… copies belong to it
 * and are not listed. Whatever is left is stray, grouped the same way — an original
 * with its copies, a full with its thumb — so one photo is one entry.
 *
 * If the bucket can't be listed (no R2 config, or an error), the tables alone
 * are listed and `bucketListed` is false.
 */
export async function loadMediaInventory(): Promise<{ items: InventoryItem[]; bucketListed: boolean }> {
  const [mediaRows, galleryRows, articleRows, teamRows, settingsRow, pageRows, bucket] = await Promise.all([
    db.select().from(media).orderBy(desc(media.uploadedAt)),
    db.select().from(galleryPhotos),
    db
      .select({
        id: articles.id,
        title: articles.title,
        status: articles.status,
        coverImageId: articles.coverImageId,
        body: articles.body,
      })
      .from(articles),
    db
      .select({ id: teamMembers.id, name: teamMembers.name, status: teamMembers.status, photoId: teamMembers.photoId })
      .from(teamMembers),
    db.query.settings.findFirst({ columns: { defaultOgImageId: true } }),
    db.select({ key: cmsPages.key, draft: cmsPages.draft, published: cmsPages.published }).from(cmsPages),
    listBucket().catch((error) => {
      console.error("[media] bucket listing failed", error);
      return null;
    }),
  ]);

  function usageOf(id: string, url: string): MediaUsage[] {
    const usage: MediaUsage[] = [];
    for (const page of pageRows) {
      const def = cmsPageList.find((candidate) => candidate.key === page.key);
      const live = mentions(page.published, id, url);
      if (!live && !mentions(page.draft, id, url)) continue;
      usage.push({
        label: `Strona: ${def?.label ?? page.key}`,
        href: def ? `/admin/cms/${def.adminSlug}` : "/admin/cms",
        draft: !live,
      });
    }
    for (const article of articleRows) {
      const cover = article.coverImageId === id;
      if (!cover && !mentions(article.body, id, url)) continue;
      usage.push({
        label: `Artykuł: ${article.title}${cover ? " (okładka)" : ""}`,
        href: `/admin/articles/${article.id}`,
        draft: article.status !== "published",
      });
    }
    for (const member of teamRows) {
      if (member.photoId !== id) continue;
      usage.push({ label: `Zespół: ${member.name}`, href: `/admin/team/${member.id}`, draft: member.status !== "published" });
    }
    if (settingsRow?.defaultOgImageId === id) {
      usage.push({ label: "Ustawienia: obraz do udostępnień", href: "/admin/settings", draft: false });
    }
    return usage;
  }

  const known = new Set<string>();
  for (const row of mediaRows) {
    known.add(row.r2Key);
    if (hasVariants(row.url)) for (const width of VARIANT_WIDTHS) known.add(variantOf(row.r2Key, width));
  }
  for (const row of galleryRows) known.add(row.fullKey).add(row.thumbKey);

  const config = getR2Config();
  const strays = bucket && config ? groupStrays(bucket.filter((object) => !known.has(object.key)), config) : [];

  const items: InventoryItem[] = [
    ...mediaRows.map((row): InventoryItem => ({
      kind: "media",
      item: toMediaSummary(row),
      usedIn: usageOf(row.id, row.url),
    })),
    ...galleryRows.map((row): InventoryItem => ({
      kind: "gallery",
      id: row.id,
      thumbUrl: row.thumbUrl,
      fullUrl: row.fullUrl,
      alt: galleryAlt(row.altText, row.description),
      description: row.description,
      status: row.status,
      featuredOnHome: row.featuredOnHome,
      width: row.fullWidth,
      height: row.fullHeight,
      size: row.fullSize + row.thumbSize,
      uploadedAt: row.createdAt.toISOString(),
    })),
    ...strays,
  ];

  const dateOf = (entry: InventoryItem) => (entry.kind === "media" ? entry.item.uploadedAt : entry.uploadedAt);
  items.sort((a, b) => dateOf(b).localeCompare(dateOf(a)));
  return { items, bucketListed: bucket !== null };
}
