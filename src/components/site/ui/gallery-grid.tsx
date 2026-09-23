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
 *
 * `featured` keeps the same five-across density on desktop but lets the first
 * photo take a 2×2 block — for the teaser's seven, one lead and six small tiles
 * in exactly two rows. Below `nav` the lead runs the full width of a two-column
 * grid instead, as a wide strip rather than a tall square.
 */
export function GalleryGrid({
  photos,
  featured = false,
  className,
}: {
  photos: GalleryPhotoView[];
  featured?: boolean;
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
          "m-0 grid list-none gap-gap p-0",
          // `sm:max-nav:` rather than `sm:` — `nav` is a px breakpoint and `sm`
          // a rem one, which Tailwind cannot order, so a bare `sm:` rule lands
          // after `nav:` in the CSS and wins on desktop too.
          featured
            ? "grid-cols-1 sm:max-nav:grid-cols-2 nav:grid-cols-5"
            : "[grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]",
          className,
        )}
      >
        {photos.map((photo, index) => {
          const lead = featured && index === 0;
          // The thumbnail is 640px on its long edge — soft at double size, so
          // the lead tile takes the full variant the lightbox opens on anyway.
          const image = lead ? photo.full : photo.thumb;

          return (
            <Reveal
              key={photo.id}
              as="li"
              delay={(index % 4) * 60}
              className={cn("min-w-0", lead && "sm:col-span-2 nav:row-span-2")}
            >
              <button
                type="button"
                id={`gallery-tile-${photo.id}`}
                onClick={() => show(index, "push")}
                className={cn(
                  "group relative block w-full cursor-zoom-in overflow-hidden bg-stone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-600",
                  lead && "nav:h-full",
                )}
              >
                <span
                  className={cn(
                    "relative block aspect-[4/3] overflow-hidden",
                    // Two rows plus the gap between them, not a 4:3 of its own.
                    lead && "sm:max-nav:aspect-[16/7] nav:aspect-auto nav:h-full",
                  )}
                >
                  {/* Deliberately not next/image: the bucket is on r2.dev, where
                    Cloudflare's edge resizing is unavailable, so the thumbnail
                    was already encoded at its display size at upload time. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={photo.alt}
                    width={image.width}
                    height={image.height}
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
          );
        })}
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
