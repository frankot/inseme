"use client";

import { useRef } from "react";

import { Container } from "@/components/site/ui/container";
import { useContactPath } from "@/components/site/ui/contact-path";
import { Reveal } from "@/components/site/ui/reveal";
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
 * the numbered run starts with Ośrodek — and the choice is shared, so section
 * 03 is already showing this path's steps by the time the visitor gets there.
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
    <section id="sciezki" className="scroll-mt-[calc(var(--nav-h-sticky)+12px)]">
      <Container className="pt-section">
        <Reveal>
          <div className="mb-[clamp(24px,2.8vw,38px)] flex flex-wrap items-baseline gap-x-[clamp(16px,2vw,28px)] gap-y-3">
            <span className="text-eyebrow uppercase tracking-[0.22em] text-clay-600">
              {content.eyebrow}
            </span>
            <h2 className="text-pretty font-heading text-heading text-ink-900">
              {content.title}
            </h2>
            <span aria-hidden className="h-px flex-auto bg-line-strong" />
          </div>
        </Reveal>

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
          className="animate-step-in mt-gap bg-sand p-card"
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
                <p className="mb-1.5 text-[16.5px] tracking-[-0.015em] text-ink-900">
                  {point.title}
                </p>
                <p className="text-pretty text-[15px] leading-[1.65] text-ink-400">
                  {point.body}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-[clamp(20px,2.2vw,30px)] flex flex-wrap items-center gap-x-[clamp(22px,2.6vw,40px)] gap-y-4">
            <a
              href="#pierwszy-kontakt"
              className="link-arrow bg-ink-900 px-[24px] py-[14px] text-[15px] text-bone transition-colors hover:bg-ink-700"
            >
              <span>{active.ctaLabel}</span>
              <span aria-hidden className="text-[14px]">
                →
              </span>
            </a>
            <a
              href={active.secondaryHref}
              className="link-arrow text-[15px] text-sage-600 transition-colors hover:text-sage-700"
            >
              <span>{active.secondaryLabel}</span>
              <span aria-hidden>→</span>
            </a>
          </div>
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
    </section>
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
          : "border-line-strong bg-bone hover:bg-white",
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
          "max-w-[26em] text-pretty text-[15.5px] leading-[1.7]",
          selected ? "text-on-dark-sage-2" : "text-ink-400",
        )}
      >
        {card.body}
      </span>

      <span
        className={cn(
          "mt-auto flex items-center gap-2.5 border-t pt-[clamp(14px,1.4vw,20px)] text-[15px] transition-colors",
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
