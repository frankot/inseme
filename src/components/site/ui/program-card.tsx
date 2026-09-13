import { Cta } from "@/components/site/ui/cta";
import { Reveal } from "@/components/site/ui/reveal";
import { priceFor } from "@/content/cennik";
import type { ProgramCard as ProgramCardData } from "@/content/home";

/**
 * One element of a stay, with what it costs.
 *
 * The price is the whole point of pairing these cards with the cennik: someone
 * comparing three ośrodki is answering "what do I get" and "what does it cost"
 * at the same time, and splitting those across two sections made them do the
 * work twice. `priceFor` returns null until the real list is in, and the card
 * falls back to the honest line rather than inventing a number.
 */
export function ProgramCard({
  card,
  delay = 0,
  noPriceLabel,
}: {
  card: ProgramCardData;
  delay?: number;
  noPriceLabel: string;
}) {
  const price = priceFor(card.id);

  return (
    <Reveal
      as="article"
      delay={delay}
      className="card-surface flex min-h-[clamp(280px,26vw,340px)] flex-col justify-between gap-7 p-card"
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-eyebrow tabular-nums tracking-[0.18em] text-clay-400">
          {card.index}
        </span>
        <span className="text-eyebrow uppercase tracking-[0.16em] text-clay-600">
          {card.meta}
        </span>
      </div>

      <div>
        <h3 className="mb-[13px] font-heading text-heading text-ink-900">
          {card.title}
        </h3>
        <p className="mb-5 text-body text-ink-400">{card.body}</p>

        <p className="mb-5 border-t border-line-warm pt-4">
          {price ? (
            <>
              <span className="font-heading text-[clamp(21px,1.9vw,26px)] leading-none tracking-[-0.03em] tabular-nums text-ink-900">
                {price.priceFrom}
              </span>
              {price.priceUnit && (
                <span className="ml-2 text-meta text-ink-300">{price.priceUnit}</span>
              )}
            </>
          ) : (
            <span className="text-meta text-ink-300">{noPriceLabel}</span>
          )}
        </p>

        <Cta href={card.href}>{card.linkLabel}</Cta>
      </div>
    </Reveal>
  );
}
