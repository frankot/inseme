/**
 * The homepage Ośrodek mosaic follows the design's 4-column grid: a 2×2 hero
 * tile, a 2-wide banner beside it, and two square tiles closing the second
 * row. Below the `tab` breakpoint the same spans read as a 2-column stack, so
 * the tiles keep their shapes instead of collapsing into a column of
 * identical rectangles.
 *
 * A plain module, not part of a component file: the server section and the
 * client mosaic both read it.
 */
export const OSRODEK_TILES = [
  { span: "col-span-2 row-span-2", sizes: "(max-width: 767px) 100vw, 50vw" },
  { span: "col-span-2", sizes: "(max-width: 767px) 100vw, 50vw" },
  { span: "col-span-1", sizes: "(max-width: 767px) 50vw, 25vw" },
  { span: "col-span-1", sizes: "(max-width: 767px) 50vw, 25vw" },
] as const;

export const OSRODEK_GRID =
  "grid grid-cols-2 auto-rows-[clamp(140px,15.5vw,220px)] gap-gap tab:grid-cols-4";

export const OSRODEK_CAPTION =
  "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/75 via-ink-950/35 to-transparent px-[clamp(12px,1.4vw,22px)] pb-[clamp(12px,1.1vw,18px)] pt-[clamp(28px,3.4vw,48px)] text-[clamp(13px,0.95vw,15px)] leading-[1.45] text-bone";

export const OSRODEK_IMAGE =
  "object-cover saturate-[.92] transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]";
