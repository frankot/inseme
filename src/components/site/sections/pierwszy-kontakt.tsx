"use client";

import { useRef } from "react";

import { Container } from "@/components/site/ui/container";
import { useContactPath } from "@/components/site/ui/contact-path";
import { Reveal } from "@/components/site/ui/reveal";
import { SectionRule } from "@/components/site/ui/section-rule";
import {
  contactDefaults,
  pierwszyKontaktDefaults,
  type PierwszyKontaktContent,
  type SiteContact,
} from "@/content/home";

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
    <section
      id="pierwszy-kontakt"
      className="scroll-mt-[calc(var(--nav-h-sticky)+12px)]"
    >
      <Container className="pt-section-lg pb-section-sm">
        <SectionRule
          index={content.index}
          label={content.eyebrow}
          className="mb-[clamp(24px,2.8vw,40px)]"
        />

        <Reveal>
          <div
            ref={tabsRef}
            role="tablist"
            aria-label="Dla kogo szukasz pomocy"
            onKeyDown={onKeyDown}
            className="mb-[clamp(26px,3vw,40px)] inline-flex border border-line bg-bone p-1"
          >
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
                  className={`px-[clamp(14px,1.6vw,22px)] py-[11px] text-[14.5px] transition-colors ${
                    selected
                      ? "bg-ink-900 text-bone"
                      : "text-ink-400 hover:text-ink-900"
                  }`}
                >
                  {item.tabLabel}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div
          key={active.id}
          id={`panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${active.id}`}
          className="animate-step-in"
        >
          <div className="mb-[clamp(34px,4vw,60px)] flex flex-wrap items-end gap-x-[72px] gap-y-9">
            <Reveal className="flex-[1_1_18em]">
              <h2 className="max-w-[19em] text-pretty font-heading text-display text-ink-900">
                {active.title}
              </h2>
            </Reveal>
            <Reveal className="flex-[0_1_22em]">
              <p className="text-[15.5px] leading-[1.75] text-ink-300">
                {active.lead}
              </p>
            </Reveal>
          </div>

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
                <p className="col-start-2 text-pretty text-[15.5px] leading-[1.72] text-ink-400 md:col-start-3">
                  {step.body}
                </p>
              </Reveal>
            ))}
          </ol>

          <Reveal className="mt-[clamp(24px,2.6vw,36px)]">
            <p className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[15px] text-ink-300">
              <span>{active.note}</span>
              <a
                href={`tel:${contact.phoneHref}`}
                className="link-arrow text-[15px] text-sage-600 transition-colors hover:text-sage-700"
              >
                <span>{active.ctaLabel}</span>
                <span aria-hidden>→</span>
              </a>
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
