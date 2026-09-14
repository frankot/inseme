"use client";

import { useCallback, useEffect, useState } from "react";

import { GalleryLightbox } from "@/components/site/ui/gallery-lightbox";
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
      <ul
        className={cn(
          "m-0 grid list-none gap-gap p-0 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]",
          className,
        )}
      >
        {photos.map((photo, index) => (
          <Reveal key={photo.id} as="li" delay={(index % 4) * 60} className="min-w-0">
            <button
              type="button"
              id={`gallery-tile-${photo.id}`}
              onClick={() => show(index, "push")}
              className="group relative block w-full cursor-zoom-in overflow-hidden bg-stone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-600"
            >
              <span className="relative block aspect-[4/3] overflow-hidden">
                {/* Deliberately not next/image: the bucket is on r2.dev, where
                    Cloudflare's edge resizing is unavailable, so the thumbnail
                    was already encoded at its display size at upload time. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.thumb.url}
                  alt={photo.alt}
                  width={photo.thumb.width}
                  height={photo.thumb.height}
                  loading={index < 4 ? "eager" : "lazy"}
                  decoding="async"
                  className="size-full object-cover saturate-[.92] transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]"
                />
              </span>
              {photo.description ? (
                <span className="pointer-events-none absolute inset-x-0 bottom-0 block bg-gradient-to-t from-ink-950/75 via-ink-950/35 to-transparent px-[clamp(12px,1.4vw,22px)] pb-[clamp(12px,1.1vw,18px)] pt-[clamp(28px,3.4vw,48px)] text-left text-[clamp(13px,0.95vw,15px)] leading-[1.45] text-bone">
                  {photo.description}
                </span>
              ) : null}
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
