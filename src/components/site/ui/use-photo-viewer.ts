"use client";

import { useCallback, useEffect, useState } from "react";

import type { GalleryPhotoView } from "@/lib/gallery-types";

/**
 * Open / arrow / close state for `GalleryLightbox`, shared by /galeria and the
 * homepage's Ośrodek section so a photo opens the same way in both.
 *
 * Opening a photo pushes `?photo=<id>` so the browser's Back button closes the
 * lightbox instead of leaving the page — on a phone, the back gesture is what
 * people reach for first. The `popstate` listener is what actually drives the
 * open state, so the URL and the viewer cannot disagree.
 *
 * `tileId` names the element that opened a photo, so closing hands focus back
 * to it rather than dropping a keyboard user at the top of the document.
 */
export function usePhotoViewer(photos: GalleryPhotoView[], tileId: (photoId: string) => string) {
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
    if (opened !== null) document.getElementById(tileId(photos[opened].id))?.focus();
  }

  return { openIndex, show, close };
}
