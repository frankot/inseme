"use client";

import { Container } from "@/components/site/ui/container";
import { useContactPath } from "@/components/site/ui/contact-path";
import { Reveal } from "@/components/site/ui/reveal";
import {
  contactDefaults,
  sciezkiDefaults,
  type SciezkiContent,
  type SiteContact,
} from "@/content/home";

/** The sage rule belongs to the patient's card, the clay one to the family's. */
const ACCENTS = ["border-t-sage-600", "border-t-clay-300"] as const;

/**
 * Two cards that straddle the bottom edge of the hero: pick the path you are
 * on before reading anything else. Each one scrolls to "Pierwszy kontakt" and
 * switches that section to its own set of steps.
 *
 * The overlap is desktop-only — on phones the hero is a fixed 600px and there
 * is no room to hang anything into it.
 */
export function Sciezki({
  content = sciezkiDefaults,
  contact = contactDefaults,
}: {
  content?: SciezkiContent;
  contact?: SiteContact;
}) {
  const { setPath } = useContactPath();

  return (
    <Container className="relative z-10 mt-[clamp(14px,3vw,24px)] nav:mt-[calc(var(--hero-overhang)*-1)]">
      <div className="grid gap-gap nav:grid-cols-2">
        {content.paths.map((card, i) => (
          <Reveal
            key={card.id}
            delay={i * 80}
            className="min-w-0"
          >
            <a
              href="#pierwszy-kontakt"
              onClick={() => setPath(card.id)}
              className={`group flex h-full flex-col gap-[14px] border border-t-2 border-line-strong bg-bone p-card transition-colors hover:bg-white ${ACCENTS[i % ACCENTS.length]}`}
            >
              <h2 className="text-pretty font-heading text-heading text-ink-900">
                {card.title}
              </h2>
              <p className="max-w-[26em] text-pretty text-[15.5px] leading-[1.7] text-ink-400">
                {card.body}
              </p>
              <span className="link-arrow mt-auto border-t border-line pt-[clamp(14px,1.4vw,20px)] text-[15px] text-sage-600 transition-colors group-hover:text-sage-700">
                <span>{card.ctaLabel}</span>
                <span aria-hidden>→</span>
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      <p className="mt-[clamp(18px,2vw,28px)] text-center text-[15px] text-ink-300">
        {content.note}{" "}
        <a
          href={`tel:${contact.phoneHref}`}
          className="tabular-nums text-ink-600 underline decoration-line-warm underline-offset-4 transition-colors hover:text-sage-600"
        >
          {contact.phone}
        </a>
        , {content.phoneLabel}
      </p>
    </Container>
  );
}
