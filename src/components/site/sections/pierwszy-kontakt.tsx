"use client";

import { useRef } from "react";

import { useContactPath } from "@/components/site/ui/contact-path";
import { Cta } from "@/components/site/ui/cta";
import { Reveal } from "@/components/site/ui/reveal";
import { Section } from "@/components/site/ui/section";
import {
  contactDefaults,
  pierwszyKontaktDefaults,
  type PierwszyKontaktContent,
  type SiteContact,
} from "@/content/home";
import { cn } from "@/lib/utils";

/**
 * Section 01, immediately below the fork it belongs to. The path was chosen one
 * band above, so the switch here is a quiet line of text rather than a second
 * button bar — two differently-styled tablists for one piece of state was the
 * page's most obvious seam.
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

  /** ← → walk the switch, as a tablist is expected to. */
  function onKeyDown(event: React.KeyboardEvent) {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const index = content.paths.findIndex((item) => item.id === active.id);
    const next = content.paths[(index + step + content.paths.length) % content.paths.length];
    setPath(next.id);
    tabsRef.current?.querySelector<HTMLButtonElement>(`#tab-${next.id}`)?.focus();
  }

  return (
    <Section
      id="pierwszy-kontakt"
      index={content.index}
      label={content.eyebrow}
      title={active.title}
      lead={active.lead}
      action={
        <div
          ref={tabsRef}
          role="tablist"
          aria-label="Dla kogo szukasz pomocy"
          onKeyDown={onKeyDown}
          className="flex flex-wrap items-center gap-x-5 gap-y-2 text-meta"
        >
          <span className="text-clay-600">Czytasz ścieżkę:</span>
          {content.paths.map((item) => {
            const selected = item.id === active.id;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`panel-${item.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setPath(item.id)}
                className={cn(
                  "underline-offset-[6px] transition-colors",
                  selected
                    ? "text-ink-900 underline decoration-sage-600 decoration-2"
                    : "text-ink-300 underline decoration-line-warm hover:text-ink-900",
                )}
              >
                {item.tabLabel}
              </button>
            );
          })}
        </div>
      }
    >
      <div
        key={active.id}
        id={`panel-${active.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${active.id}`}
        className="animate-step-in"
      >
        <ol className="m-0 list-none border-t border-line-strong p-0">
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
          <span className="text-meta text-ink-300">{active.note}</span>
        </Reveal>
      </div>
    </Section>
  );
}
