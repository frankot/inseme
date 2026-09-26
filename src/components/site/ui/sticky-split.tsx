import type { ReactNode } from "react";

import { Reveal } from "@/components/site/ui/reveal";
import { SiteImage } from "@/components/site/ui/site-image";
import { cn } from "@/lib/utils";

/**
 * The section layout for content that is long on one side and short on the
 * other: a heading block that stays put in the left column while the list,
 * timetable or accordion beside it scrolls past.
 *
 * Sticking only makes sense once the two really are side by side, so it is tied
 * to the breakpoint the split happens at — `tab` by default, `desk` for a split
 * whose aside needs more than half a tablet (the contact form). Below it the
 * aside simply stacks above the content and nothing is pinned.
 *
 * `image` is an optional photograph closing the aside at the column's full
 * width. It travels with the sticky block, so keep the aside short enough that
 * the pair still fits a laptop viewport.
 */
const SPLIT = {
  tab: {
    grid: "tab:[grid-template-columns:minmax(0,0.86fr)_minmax(0,1.14fr)]",
    aside: "tab:sticky tab:top-[calc(var(--nav-h-sticky)+clamp(20px,2.4vw,40px))]",
    figure: "tab:max-h-[30vh]",
    sizes: "(max-width: 767px) 100vw, 40vw",
  },
  desk: {
    grid: "desk:[grid-template-columns:minmax(0,0.86fr)_minmax(0,1.14fr)]",
    aside: "desk:sticky desk:top-[calc(var(--nav-h-sticky)+clamp(20px,2.4vw,40px))]",
    figure: "desk:max-h-[30vh]",
    sizes: "(max-width: 1023px) 100vw, 40vw",
  },
} as const;

export function StickySplit({
  id,
  aside,
  image,
  splitAt = "tab",
  children,
  className,
}: {
  /** Anchor target, when the split is a link destination of its own. */
  id?: string;
  /** The short column: eyebrow, heading, lead. */
  aside: ReactNode;
  image?: { src: string; alt: string };
  /** The breakpoint the two columns go side by side at. */
  splitAt?: keyof typeof SPLIT;
  /** The long column. */
  children: ReactNode;
  className?: string;
}) {
  const split = SPLIT[splitAt];

  return (
    <div
      id={id}
      className={cn(
        "grid items-start gap-x-16 gap-y-[clamp(30px,3.2vw,46px)]",
        split.grid,
        className,
      )}
    >
      <Reveal className={split.aside}>
        {aside}
        {/* Capped in height so the pinned block still fits a laptop viewport —
            a sticky column taller than the screen can never sit still. */}
        {image && (
          <figure
            className={cn(
              "relative m-0 mt-[clamp(26px,3vw,40px)] aspect-[3/2] w-full overflow-hidden bg-stone",
              split.figure,
            )}
          >
            <SiteImage
              src={image.src}
              alt={image.alt}
              fill
              sizes={split.sizes}
              className="object-cover saturate-[.92]"
            />
          </figure>
        )}
      </Reveal>

      <div className="min-w-0">{children}</div>
    </div>
  );
}
