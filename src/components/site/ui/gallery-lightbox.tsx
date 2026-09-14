"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { galeriaPageDefaults as copy } from "@/content/galeria";
import type { GalleryPhotoView } from "@/lib/gallery-types";

/**
 * The full-size viewer.
 *
 * Built by hand rather than on the shadcn `Dialog`, because this is not a
 * dialog-shaped thing: it is edge-to-edge, it swallows the arrow keys, it has
 * to swipe, and the photo underneath has to stay visible while a neighbour
 * decodes. What it borrows from a dialog it implements properly — a focus
 * trap, `aria-modal`, Escape, and focus returned to the tile that opened it.
 *
 * The thumbnail is painted underneath the full image and only hidden once the
 * full one has decoded, so arrowing through the gallery never flashes an empty
 * frame — the grid already has every thumbnail in cache.
 */
export function GalleryLightbox({
  photos,
  index,
  onIndexChange,
  onClose,
}: {
  photos: GalleryPhotoView[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const photo = photos[index];
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Which photo has finished decoding, rather than a boolean reset on every
  // change — the id *is* the state, so arrowing on cannot leave a stale `true`
  // that reveals the next photo before it has painted.
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const loaded = loadedId === photo?.id;
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const go = useCallback(
    (delta: number) => {
      if (photos.length < 2) return;
      // Wraps, so the last photo's "next" is the first rather than a dead end.
      onIndexChange((index + delta + photos.length) % photos.length);
    },
    [index, photos.length, onIndexChange],
  );

  /** Keyboard: arrows page, Escape closes, Tab stays inside. */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>("button");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [go, onClose]);

  /**
   * Lock the page behind the overlay. The scrollbar's width is given back as
   * padding, or removing it shifts the whole layout left as the modal opens.
   */
  useEffect(() => {
    const { body } = document;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    const previous = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
    body.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;
    closeRef.current?.focus();
    return () => {
      body.style.overflow = previous.overflow;
      body.style.paddingRight = previous.paddingRight;
    };
  }, []);

  /**
   * Warm the neighbours. Without this, every arrow press waits on a fresh
   * request — with it, moving through the gallery is instant after the first.
   */
  useEffect(() => {
    if (photos.length < 2) return;
    for (const delta of [1, -1]) {
      const neighbour = photos[(index + delta + photos.length) % photos.length];
      const image = new window.Image();
      image.src = neighbour.full.url;
    }
  }, [index, photos]);

  if (!photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={copy.lightbox.label}
      ref={panelRef}
      className="fixed inset-0 z-[100] flex flex-col bg-ink-950/95 backdrop-blur-sm animate-step-in"
      onClick={(event) => {
        // Clicking the dark space around the photo closes it. Testing
        // `target === currentTarget` would never fire — the header, the photo
        // row and the caption are all children that cover the whole overlay —
        // so this asks the opposite question: was anything meaningful clicked?
        const target = event.target;
        if (target instanceof HTMLElement && !target.closest("button, img, p")) onClose();
      }}
      onTouchStart={(event) => {
        const touch = event.touches[0];
        touchStart.current = { x: touch.clientX, y: touch.clientY };
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current;
        touchStart.current = null;
        if (!start) return;
        const touch = event.changedTouches[0];
        const dx = touch.clientX - start.x;
        const dy = touch.clientY - start.y;
        // Horizontal intent only, or a scroll-ish drag would page the gallery.
        if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
        go(dx < 0 ? 1 : -1);
      }}
    >
      <div className="flex shrink-0 items-center justify-between gap-4 px-[clamp(16px,3vw,32px)] pt-[clamp(16px,2.4vw,28px)]">
        <span className="text-meta tabular-nums text-on-dark-muted">
          {copy.lightbox.position(index, photos.length)}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={copy.lightbox.close}
          className="-mr-2 flex size-11 items-center justify-center text-on-dark-2 transition-colors hover:text-on-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-dark-sage"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-[clamp(8px,5vw,72px)] py-[clamp(12px,2vw,24px)]">
        {photos.length > 1 ? (
          <>
            <ArrowButton side="left" label={copy.lightbox.previous} onClick={() => go(-1)} />
            <ArrowButton side="right" label={copy.lightbox.next} onClick={() => go(1)} />
          </>
        ) : null}

        <div
          className="relative flex max-h-full max-w-full items-center justify-center"
          style={{ aspectRatio: `${photo.full.width} / ${photo.full.height}` }}
        >
          {/* The already-cached thumbnail holds the frame while the full decodes. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- same reason
              as below: the thumbnail is already encoded at its display size. */}
          <img
            src={photo.thumb.url}
            alt=""
            aria-hidden
            // `scale-105` spills past the photo and over the arrow buttons;
            // it is decorative, so it must never take a click.
            className="pointer-events-none absolute inset-0 size-full scale-105 object-contain blur-xl"
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- r2.dev has no
              edge resizing, so next/image would only add a wrapper: the file is
              already the exact size it is served at. */}
          <img
            key={photo.id}
            src={photo.full.url}
            alt={photo.alt}
            width={photo.full.width}
            height={photo.full.height}
            // A preloaded neighbour can already be decoded by the time React
            // attaches the handler, and would never fire `load` — the ref
            // catches that case so the photo does not stay at opacity 0.
            ref={(node) => {
              if (node?.complete) setLoadedId(photo.id);
            }}
            onLoad={() => setLoadedId(photo.id)}
            className={`relative max-h-full max-w-full object-contain transition-opacity duration-300 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>

      {photo.description ? (
        <p className="mx-auto max-w-[46em] shrink-0 px-[clamp(16px,3vw,32px)] pb-[clamp(20px,3vw,36px)] pt-[clamp(10px,1.4vw,18px)] text-center text-body text-on-dark-2">
          {photo.description}
        </p>
      ) : (
        <div className="h-[clamp(20px,3vw,36px)] shrink-0" />
      )}
    </div>
  );
}

function ArrowButton({
  side,
  label,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-ink-950/45 text-on-dark-2 backdrop-blur transition-colors hover:bg-ink-950/70 hover:text-on-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-dark-sage ${
        side === "left" ? "left-[clamp(4px,1.6vw,24px)]" : "right-[clamp(4px,1.6vw,24px)]"
      }`}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5">
        <path
          d={side === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
