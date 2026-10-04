import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * A photograph as the site shows it in a grid: the image in a fixed frame,
 * the caption under it rather than over it, behind a hairline. Used by the
 * named rooms on /osrodek and by every tile in /galeria, so the two pages read
 * as one set of pictures.
 *
 * Everything renders as spans, so a tile can sit inside a `<button>` (the
 * gallery opens a lightbox) as well as inside a `<figure>`. The wrapper is the
 * caller's, and it should carry `group` — the hover zoom keys off it.
 */

/** Four across on desktop, two on a tablet, one on a phone. */
export const PHOTO_GRID =
  "grid gap-x-gap gap-y-[clamp(26px,2.8vw,40px)] tab:grid-cols-2 desk:grid-cols-4";

/** For the `<img>` or `SiteImage` inside the frame. */
export const PHOTO_IMAGE =
  "size-full object-cover saturate-[.92] transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]";

export function PhotoTile({
  media,
  title,
  body,
  className,
}: {
  /** The image, filling the frame — give it `PHOTO_IMAGE`. */
  media: ReactNode;
  title?: ReactNode;
  body?: ReactNode;
  className?: string;
}) {
  return (
    <>
      <span
        className={cn(
          "relative block aspect-[4/5] overflow-hidden bg-stone tab:aspect-[4/3] desk:aspect-[4/5]",
          className,
        )}
      >
        {media}
      </span>
      {(title || body) && (
        <span className="mt-3.5 block border-t border-line-strong pt-3 text-left">
          {title && (
            <span className="block font-heading text-[clamp(17px,1.4vw,20px)] leading-[1.3] tracking-[-0.025em] text-ink-900">
              {title}
            </span>
          )}
          {body && (
            <span className={cn("block text-pretty text-meta text-ink-400", title && "mt-1")}>
              {body}
            </span>
          )}
        </span>
      )}
    </>
  );
}
