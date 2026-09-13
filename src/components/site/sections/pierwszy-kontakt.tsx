"use client";

import { useRef } from "react";

import { useContactPath } from "@/components/site/ui/contact-path";
import { Cta } from "@/components/site/ui/cta";
import { Reveal } from "@/components/site/ui/reveal";
import { Section } from "@/components/site/ui/section";
import {
  contactDefaults,
  pierwszyKontaktDefaults,
  type ContactPath,
  type PierwszyKontaktContent,
  type SiteContact,
} from "@/content/home";
import { cn } from "@/lib/utils";

/** The sage rule belongs to the patient's card, the clay one to the family's. */
const ACCENTS: Record<ContactPath["id"], string> = {
  self: "border-t-sage-600",
  family: "border-t-clay-300",
};

/**
 * Section 01: pick which of the two you are, then read what happens after the
 * call. This was two sections — a fork with its own promises and CTAs, and a
 * separate run of steps behind a second tab bar — which put two differently
 * styled tablists on one piece of state and said the same thing twice.
 *
 * The cards are deliberately unequal: the self card takes the wider column and
 * is selected on arrival, because most people who ring are ringing about
 * themselves. The family card sits beside it as a visible alternative rather
 * than a choice the visitor has to make before anything will read.
 */
export function PierwszyKontakt({
  content = pierwszyKontaktDefaults,
  contact = contactDefaults,
}: {
  content?: PierwszyKontaktContent;
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
    <Section
      id="pierwszy-kontakt"
      index={content.index}
      label={content.eyebrow}
      title={active.title}
      lead={active.lead}
      // Both paths' leads run to five lines at the desktop column width; without
      // the reservation the shorter one drags the cards and steps up the page
      // the moment the visitor switches path.
      leadMinLines={5}
    >
      <div
        ref={tabsRef}
        role="tablist"
        aria-label="Dla kogo szukasz pomocy"
        onKeyDown={onKeyDown}
        className="grid gap-gap nav:[grid-template-columns:minmax(0,1.25fr)_minmax(0,1fr)]"
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
        className="animate-step-in"
      >
        {/* The three promises: the trust hit, before the process detail. */}
        <ul className="m-0 mt-[clamp(28px,3.2vw,44px)] grid list-none gap-x-[clamp(24px,3vw,56px)] gap-y-0 p-0 md:grid-cols-3">
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

        <ol className="m-0 mt-[clamp(28px,3.2vw,44px)] list-none border-t border-line-strong p-0">
          {active.steps.map((step, i) => (
            <Reveal
              as="li"
              key={step.index}
              delay={i * 60}
              className="grid grid-cols-[minmax(0,4.5em)_minmax(0,1fr)] gap-x-[clamp(20px,3vw,56px)] gap-y-5 border-b border-line-strong py-[clamp(24px,2.6vw,38px)] md:grid-cols-[minmax(0,4.5em)_minmax(0,1fr)_minmax(0,1.35fr)]"
            >
              <span className="font-heading text-[clamp(26px,2.6vw,38px)] font-light leading-[.9] tracking-[-0.04em] tabular-nums text-clay-300">
                {step.index}
              </span>
              <h3 className="text-[clamp(20px,1.8vw,26px)] leading-[1.2] tracking-[-0.026em] text-ink-900">
                {step.title}
              </h3>
              <p className="col-start-2 text-pretty text-body text-ink-400 md:col-start-3">
                {step.body}
              </p>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-[clamp(24px,2.6vw,36px)] flex flex-wrap items-center gap-x-8 gap-y-4">
          <Cta href={`tel:${contact.phoneHref}`} variant="solid">
            {active.ctaLabel}
          </Cta>
          <Cta href={active.secondaryHref}>{active.secondaryLabel}</Cta>
          <span className="text-meta text-ink-300">{active.note}</span>
        </Reveal>
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
  card: ContactPath;
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
        {card.cardTitle}
      </span>
      <span
        className={cn(
          "max-w-[26em] text-pretty text-body",
          selected ? "text-on-dark-sage-2" : "text-ink-400",
        )}
      >
        {card.cardBody}
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
