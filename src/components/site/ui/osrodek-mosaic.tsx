"use client";

import { GalleryLightbox } from "@/components/site/ui/gallery-lightbox";
import {
  OSRODEK_CAPTION,
  OSRODEK_GRID,
  OSRODEK_IMAGE,
  OSRODEK_TILES,
} from "@/components/site/ui/osrodek-tiles";
import { Reveal } from "@/components/site/ui/reveal";
import { usePhotoViewer } from "@/components/site/ui/use-photo-viewer";
import type { GalleryPhotoView } from "@/lib/gallery-types";

/**
 * The homepage Ośrodek mosaic, filled with the gallery photos picked for it
 * in /admin/gallery (the star). Each tile opens the same full-screen viewer as
 * /galeria, and arrows through the four.
 *
 * The images are the gallery's own WebPs — the 640px thumb and the 1600px
 * full — offered as a srcset, so a small tile on a phone takes the thumb and
 * the large tile on a wide screen the full, without any resizing at request
 * time (the bucket is on r2.dev; see `image-host.ts`).
 */
export function OsrodekMosaic({ photos }: { photos: GalleryPhotoView[] }) {
  const tileId = (id: string) => `osrodek-tile-${id}`;
  const { openIndex, show, close } = usePhotoViewer(photos, tileId);

  return (
    <>
      <div className={OSRODEK_GRID}>
        {photos.slice(0, OSRODEK_TILES.length).map((photo, i) => (
          <Reveal
            key={photo.id}
            as="figure"
            delay={i * 70}
            className={`group relative m-0 min-w-0 overflow-hidden bg-stone ${OSRODEK_TILES[i].span}`}
          >
            <button
              type="button"
              id={tileId(photo.id)}
              onClick={() => show(i, "push")}
              aria-label={`Powiększ zdjęcie: ${photo.alt}`}
              className="absolute inset-0 block size-full cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-bone"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized gallery WebPs, chosen by srcset */}
              <img
                src={photo.thumb.url}
                srcSet={`${photo.thumb.url} ${photo.thumb.width}w, ${photo.full.url} ${photo.full.width}w`}
                sizes={OSRODEK_TILES[i].sizes}
                alt={photo.alt}
                width={photo.full.width}
                height={photo.full.height}
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 size-full ${OSRODEK_IMAGE}`}
              />
            </button>
            {photo.description ? (
              <figcaption className={OSRODEK_CAPTION}>{photo.description}</figcaption>
            ) : null}
          </Reveal>
        ))}
      </div>

      {openIndex !== null ? (
        <GalleryLightbox
          photos={photos}
          index={openIndex}
          onIndexChange={(next) => show(next, "replace")}
          onClose={close}
        />
      ) : null}
    </>
  );
}
