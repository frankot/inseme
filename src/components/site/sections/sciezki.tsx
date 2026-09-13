"use client";

import { useRef } from "react";

import { useContactPath } from "@/components/site/ui/contact-path";
import { Cta } from "@/components/site/ui/cta";
import { Reveal } from "@/components/site/ui/reveal";
import { Section } from "@/components/site/ui/section";
import {
  contactDefaults,
  sciezkiDefaults,
  type ContactPathId,
  type HeroPath,
  type SciezkiContent,
  type SiteContact,
} from "@/content/home";
import { cn } from "@/lib/utils";

/** The sage rule belongs to the patient's card, the clay one to the family's. */
const ACCENTS: Record<ContactPathId, string> = {
  self: "border-t-sage-600",
  family: "border-t-clay-300",
};

/**
 * The fork, directly under the hero: two cards, and below them three short
 * promises made to whichever group is chosen. It is deliberately unnumbered —
 * the numbered run starts with Pierwszy kontakt — and the choice is shared, so
 * section 01 is already showing this path's steps by the time the visitor
 * scrolls one band further.
 */
export function Sciezki({
  content = sciezkiDefaults,
  contact = contactDefaults,
}: {
  content?: SciezkiContent;
  contact?: SiteContact;
}) {
  const { path, setPath } = useContactPath();
  const tabsRef = useRef<HTMLDivElement>(null);
  const active = content.paths.find((item) => item.id === path) ?? content.paths[0];

  /** ← → walk the two cards, as a tablist is expected to. */
  function onKeyDown(event: React.KeyboardEvent) {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const index = content.paths.findIndex((item) => item.id === active.id);
    const next =
      content.paths[(index + step + content.paths.length) % content.paths.length];
    setPath(next.id);
    tabsRef.current?.querySelector<HTMLButtonElement>(`#sciezka-${next.id}`)?.focus();
  }

  return (
    <Section id="sciezki" tone="tinted" label={content.eyebrow} title={content.title}>
      <div
        ref={tabsRef}
        role="tablist"
        aria-label="Dla kogo szukasz pomocy"
        onKeyDown={onKeyDown}
        className="grid gap-gap nav:grid-cols-2"
      >
        {content.paths.map((card, i) => (
          <Reveal key={card.id} delay={i * 80} className="min-w-0">
            <PathCard
              card={card}
              selected={card.id === active.id}
              onSelect={() => setPath(card.id)}
            />
          </Reveal>
        ))}
      </div>

      <div
        key={active.id}
        id={`panel-${active.id}`}
        role="tabpanel"
        aria-labelledby={`sciezka-${active.id}`}
        className="animate-step-in card-surface mt-gap p-card"
      >
        <p className="mb-[clamp(20px,2.4vw,32px)] max-w-[34em] text-pretty text-body-lg text-ink-700">
          {active.panelLead}
        </p>

        <ul className="m-0 grid list-none gap-x-[clamp(24px,3vw,56px)] gap-y-0 p-0 md:grid-cols-3">
          {active.points.map((point) => (
            <li
              key={point.title}
              className="border-t border-line-warm py-[clamp(14px,1.5vw,20px)]"
            >
              <p className="mb-1.5 text-body tracking-[-0.015em] text-ink-900">
                {point.title}
              </p>
              <p className="text-pretty text-meta text-ink-400">{point.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-[clamp(22px,2.4vw,32px)] flex flex-wrap items-center gap-x-[clamp(22px,2.6vw,40px)] gap-y-4">
          <Cta href="#pierwszy-kontakt" variant="solid">
            {active.ctaLabel}
          </Cta>
          <Cta href={active.secondaryHref}>{active.secondaryLabel}</Cta>
        </div>
      </div>

      <p className="mt-[clamp(18px,2vw,28px)] text-center text-meta text-ink-300">
        {content.note}{" "}
        <a
          href={`tel:${contact.phoneHref}`}
          className="tabular-nums text-ink-600 underline decoration-line-warm underline-offset-4 transition-colors hover:text-sage-600"
        >
          {contact.phone}
        </a>
        , {content.phoneLabel}
      </p>
    </Section>
  );
}

function PathCard({
  card,
  selected,
  onSelect,
}: {
  card: HeroPath;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      id={`sciezka-${card.id}`}
      type="button"
      role="tab"
      aria-selected={selected}
      aria-controls={`panel-${card.id}`}
      tabIndex={selected ? 0 : -1}
      onClick={onSelect}
      className={cn(
        "group flex h-full w-full flex-col gap-[14px] border border-t-2 p-card text-left transition-colors",
        ACCENTS[card.id],
        selected
          ? "border-ink-900 bg-ink-900"
          : "card-surface border-t-2 hover:bg-cream",
      )}
    >
      <span
        className={cn(
          "text-pretty font-heading text-heading",
          selected ? "text-on-dark" : "text-ink-900",
        )}
      >
        {card.title}
      </span>
      <span
        className={cn(
          "max-w-[26em] text-pretty text-body",
          selected ? "text-on-dark-sage-2" : "text-ink-400",
        )}
      >
        {card.body}
      </span>

      <span
        className={cn(
          "mt-auto flex items-center gap-2.5 border-t pt-[clamp(14px,1.4vw,20px)] text-body transition-colors",
          selected
            ? "border-white/15 text-on-dark-sage"
            : "border-line text-sage-600 group-hover:text-sage-700",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "block size-[9px] border transition-colors",
            selected ? "border-sage-300 bg-sage-300" : "border-clay-400",
          )}
        />
        <span>{selected ? card.selectedLabel : card.chooseLabel}</span>
      </span>
    </button>
  );
}
