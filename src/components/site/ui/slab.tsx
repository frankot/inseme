import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The ground a band sits on. The page alternates them so the scroll has a
 * rhythm instead of nine identical cream screens: `tinted` carries the card
 * grids, where a warm ground is what makes a bone card's edge visible, and
 * `dark` is reserved for the two moments that should stop the reader — the
 * hero and the quote.
 */
export type SectionTone = "default" | "tinted" | "dark";

const GROUND: Record<SectionTone, string> = {
  // No hairlines anywhere: every band either curves into its neighbour or is
  // covered by one, and a straight rule survives neither.
  default: "bg-cream",
  tinted: "bg-sand",
  dark: "bg-ink-950",
};

/**
 * A band's box: its ground, its vertical rhythm, and where it sits in the
 * stack. `Section` puts the masthead inside one; this decides the shape.
 *
 * The page reads as sheets of paper laid on a darker ground, and the numbering
 * is what says which is which — odd bands (01, 03, 05…) are the sheets, curved
 * at both ends and pulled out over the band above and the band below so the
 * corners have something to be seen against; even bands are the ground, square
 * and overlapped from both sides. So the alternation needs no prop: it falls
 * out of the `index` each band already passes.
 *
 * Padding is the other half of it. A raised band's edges are its own, so it
 * keeps the plain section rhythm; a covered band loses `slab` off each end to
 * the sheets above and below, and adds it back so its copy still sits a full
 * section's gap from the edge a reader can actually see.
 *
 * Subpages run the same alternation without the numerals — a page that is all
 * one subject has nothing to count — so they say `raised` outright. The prop
 * only overrides the parity; on the homepage the `index` still decides.
 */
export function Slab({
  id,
  tone = "default",
  index,
  raised,
  children,
  className,
}: {
  id?: string;
  tone?: SectionTone;
  /** The numeral, e.g. "01" — odd ones are the raised sheets. */
  index?: string;
  /** Overrides the parity, for the bands that carry no numeral. */
  raised?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const isRaised = raised ?? (index !== undefined && Number(index) % 2 === 1);

  return (
    <section
      id={id}
      className={cn(
        isRaised
          ? "relative z-10 rounded-slab -mt-slab -mb-slab py-section scroll-mt-[calc(var(--nav-h-sticky)+12px)]"
          : [
              "pt-[calc(var(--spacing-section)+var(--spacing-slab))]",
              "pb-[calc(var(--spacing-section)+var(--spacing-slab))]",
              // The sheet above hides this band's first `slab` of height, so an
              // anchored heading has to clear it as well as the sticky bar.
              "scroll-mt-[calc(var(--nav-h-sticky)+var(--spacing-slab)+12px)]",
            ],
        GROUND[tone],
        className,
      )}
    >
      {children}
    </section>
  );
}
