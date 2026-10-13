"use client";

import { useEffect, useRef, useState } from "react";

import type { ManualHeading } from "@/lib/admin-manual";
import { cn } from "@/lib/utils";

/**
 * Below the sticky top bar, plus a little: a heading counts as "current" once
 * it has scrolled up to here (headings land at `scroll-mt-20` = 80px).
 */
const READING_LINE = 120;

/** The heading the reader is in: the last one whose top has passed the reading line. */
function currentHeading(toc: ManualHeading[]): string | null {
  // At the very bottom the last sections can't reach the line — the last one wins.
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
    return toc.at(-1)?.id ?? null;
  }
  let current: string | null = toc[0]?.id ?? null;
  for (const heading of toc) {
    const element = document.getElementById(heading.id);
    if (!element) continue;
    if (element.getBoundingClientRect().top > READING_LINE) break;
    current = heading.id;
  }
  return current;
}

/**
 * The manual's contents, with the section being read highlighted — and kept
 * in view, since the desktop list scrolls on its own when it is longer than
 * the window.
 */
export function ManualContents({ toc }: { toc: ManualHeading[] }) {
  const [active, setActive] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setActive(currentHeading(toc)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [toc]);

  useEffect(() => {
    // Scrolls only the list's own box — `scrollIntoView` would scroll the page too.
    const box = listRef.current?.closest("nav");
    const link = active ? listRef.current?.querySelector<HTMLElement>(`[data-heading="${CSS.escape(active)}"]`) : null;
    if (!box || !link || box.scrollHeight <= box.clientHeight) return;
    const top = link.getBoundingClientRect().top - box.getBoundingClientRect().top;
    const margin = 48;
    if (top < margin) box.scrollTop += top - margin;
    else if (top > box.clientHeight - margin) box.scrollTop += top - box.clientHeight + margin;
  }, [active]);

  // The h2 a current h3 belongs to stays marked too, so the chapter is clear.
  const activeIndex = toc.findIndex((heading) => heading.id === active);
  const chapter = activeIndex >= 0 ? toc.slice(0, activeIndex + 1).findLast((heading) => heading.depth === 2) : undefined;

  return (
    <ul ref={listRef} className="flex flex-col gap-1 text-sm">
      {toc.map((heading) => {
        const isActive = heading.id === active;
        return (
          <li key={heading.id} className={heading.depth === 3 ? "pl-3" : "mt-2 first:mt-0"}>
            <a
              href={`#${heading.id}`}
              data-heading={heading.id}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "block rounded border-l-2 px-1.5 py-0.5 transition-colors hover:bg-accent hover:text-foreground",
                heading.depth === 2 ? "font-medium text-foreground" : "text-muted-foreground",
                isActive
                  ? "border-foreground bg-accent text-foreground"
                  : heading.id === chapter?.id
                    ? "border-foreground/30"
                    : "border-transparent",
              )}
            >
              {heading.text}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
