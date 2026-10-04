"use client";

import { useCallback, useEffect, useState } from "react";

import { GalleryLightbox } from "@/components/site/ui/gallery-lightbox";
import { PHOTO_GRID, PHOTO_IMAGE, PhotoTile } from "@/components/site/ui/photo-tile";
import { Reveal } from "@/components/site/ui/reveal";
import type { GalleryPhotoView } from "@/lib/gallery-types";
import { cn } from "@/lib/utils";

/**
 * The grid of tiles and the viewer they open.
 *
 * Opening a photo pushes `?photo=<id>` so the browser's Back button closes the
 * lightbox instead of leaving the page — on a phone, the back gesture is what
 * people reach for first. The `popstate` listener is what actually drives the
 * open state, so the URL and the viewer cannot disagree.
 *
 * Every tile is a real `<button>`: the lightbox is opened by script, and a div
 * with an onClick would be invisible to a keyboard and to a screen reader.
 *
 * The tiles themselves are `PhotoTile`, the same ones the named rooms on
 * /osrodek use, so a photo looks the same on both pages.
 */
export function GalleryGrid({
  photos,
  className,
}: {
  photos: GalleryPhotoView[];
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const indexOf = useCallback(
    (id: string | null) => {
      if (!id) return null;
      const index = photos.findIndex((photo) => photo.id === id);
      return index >= 0 ? index : null;
    },
    [photos],
  );

  /** Restore from the URL on mount, and follow Back/Forward after that. */
  useEffect(() => {
    const sync = () =>
      setOpenIndex(indexOf(new URLSearchParams(window.location.search).get("photo")));
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [indexOf]);

  /** Pushes on open, replaces while arrowing — one Back press closes it. */
  function show(index: number, mode: "push" | "replace") {
    const url = new URL(window.location.href);
    url.searchParams.set("photo", photos[index].id);
    window.history[mode === "push" ? "pushState" : "replaceState"]({}, "", url);
    setOpenIndex(index);
  }

  function close() {
    const opened = openIndex;
    setOpenIndex(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("photo");
    window.history.replaceState({}, "", url);
    // Focus goes back to the tile the viewer was opened from, or a keyboard
    // user is dropped at the top of the document.
    if (opened !== null) {
      document.getElementById(`gallery-tile-${photos[opened].id}`)?.focus();
    }
  }

  return (
    <>
      <ul className={cn("m-0 list-none p-0", PHOTO_GRID, className)}>
        {photos.map((photo, index) => (
          <Reveal key={photo.id} as="li" delay={(index % 4) * 60} className="min-w-0">
            <button
              type="button"
              id={`gallery-tile-${photo.id}`}
              onClick={() => show(index, "push")}
              className="group block w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sage-600"
            >
              <PhotoTile
                media={
                  // Deliberately not next/image: the bucket is on r2.dev, where
                  // Cloudflare's edge resizing is unavailable, so the thumbnail
                  // was already encoded at its display size at upload time.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo.thumb.url}
                    alt={photo.alt}
                    width={photo.thumb.width}
                    height={photo.thumb.height}
                    loading={index < 4 ? "eager" : "lazy"}
                    decoding="async"
                    className={PHOTO_IMAGE}
                  />
                }
                body={photo.description ?? undefined}
              />
            </button>
          </Reveal>
        ))}
      </ul>

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
