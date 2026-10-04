"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Runs inside the preview iframe. The editor posts `cms:refresh` after each
 * autosave (re-render the draft, keep the scroll) and `cms:focus` when a
 * section is picked in the outline (scroll to it and outline it briefly).
 * Messages from any other origin are ignored.
 */
export function PreviewBridge() {
  const router = useRouter();

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      const data = event.data as { type?: string; sectionId?: string };
      if (data?.type === "cms:refresh") {
        router.refresh();
      } else if (data?.type === "cms:focus" && data.sectionId) {
        const node = document.querySelector<HTMLElement>(
          `[data-cms-section="${CSS.escape(data.sectionId)}"]`,
        );
        if (!node) return;
        // Not `scrollIntoView`: in a same-origin frame it also scrolls every
        // ancestor scroller up to the editor's own page, which nudged the
        // admin. Scrolling this window alone keeps the move inside the preview.
        window.scrollTo({
          top: node.getBoundingClientRect().top + window.scrollY,
          behavior: "smooth",
        });
        node.style.outline = "3px solid rgba(91, 120, 98, 0.9)";
        node.style.outlineOffset = "-3px";
        window.setTimeout(() => {
          node.style.outline = "";
          node.style.outlineOffset = "";
        }, 1400);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [router]);

  return null;
}
