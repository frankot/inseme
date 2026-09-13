import Link from "next/link";

import { Reveal } from "@/components/site/ui/reveal";
import { priceFor } from "@/content/cennik";
import type { ProgramCard } from "@/content/home";

/**
 * What a stay is made of and what each part costs, as a tariff rather than a
 * grid of cards.
 *
 * Two reasons it is a list. Visually, Zespół above and Opinie below are both
 * card grids, and a third in between made the middle of the page one texture.
 * Practically, a price belongs in a column: someone comparing ośrodki reads
 * down the right-hand edge, and four prices scattered across four boxes cannot
 * be compared at all.
 *
 * The numerals the cards carried are gone on purpose — detoks, terapia, rodzina
 * and opieka po pobycie are a menu, not a sequence, and numbering them implied
 * an order of events that does not exist.
 */
export function ProgramList({
  cards,
  noPriceLabel,
  className,
}: {
  cards: ProgramCard[];
  /** Shown in the price column until the real list is published. */
  noPriceLabel: string;
  className?: string;
}) {
  return (
    <ul className={`m-0 list-none border-t border-line-strong p-0 ${className ?? ""}`}>
      {cards.map((card, i) => (
        <Row key={card.id} card={card} delay={i * 60} noPriceLabel={noPriceLabel} />
      ))}
    </ul>
  );
}

function Row({
  card,
  delay,
  noPriceLabel,
}: {
  card: ProgramCard;
  delay: number;
  noPriceLabel: string;
}) {
  const price = priceFor(card.id);

  return (
    <Reveal
      as="li"
      id={card.id}
      delay={delay}
      className="border-b border-line-strong scroll-mt-[calc(var(--nav-h-sticky)+12px)]"
    >
      <Link
        href={`/cennik#${card.id}`}
        // Four columns so the duration and the price each get their own, rather
        // than stacking in one narrow block with a void beside it. The bleed
        // lets the hover tint run past the text to the column edge.
        className="group -mx-[clamp(8px,1vw,16px)] grid grid-cols-1 items-baseline gap-x-[clamp(20px,2.4vw,44px)] gap-y-2.5 px-[clamp(8px,1vw,16px)] py-[clamp(14px,1.5vw,20px)] transition-colors hover:bg-bone md:[grid-template-columns:minmax(0,1fr)_minmax(0,8rem)_minmax(0,11rem)_auto]"
      >
        <div className="min-w-0">
          <h3 className="font-heading text-[clamp(17px,1.45vw,21px)] leading-[1.3] tracking-[-0.025em] text-ink-900">
            {card.title}
          </h3>
          <p className="mt-1.5 max-w-[46em] text-pretty text-meta text-ink-400">
            {card.body}
          </p>
        </div>

        {/*
          Below the breakpoint the duration and the price share one line; at md
          the wrapper dissolves (`contents`) and both become grid children of
          the row again, each in its own column.
        */}
        <div className="flex items-baseline justify-between gap-x-5 md:contents">
          <span className="text-eyebrow uppercase tracking-[0.16em] text-clay-600">
            {card.meta}
          </span>

          {price ? (
            <span className="text-right md:text-right">
              <span className="font-heading text-[clamp(17px,1.45vw,21px)] leading-none tracking-[-0.03em] tabular-nums text-ink-900">
                {price.priceFrom}
              </span>
              {price.priceUnit && (
                <span className="mt-1 ml-2 text-meta text-ink-300 md:ml-0 md:block">
                  {price.priceUnit}
                </span>
              )}
            </span>
          ) : (
            <span className="text-meta text-ink-300">{noPriceLabel}</span>
          )}
        </div>

        <span
          aria-hidden
          className="hidden text-[15px] text-clay-300 transition-[color,transform] duration-300 group-hover:translate-x-1.5 group-hover:text-sage-600 md:block"
        >
          →
        </span>
      </Link>
    </Reveal>
  );
}
