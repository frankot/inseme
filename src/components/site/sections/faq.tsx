"use client";

import { useState } from "react";

import { Container } from "@/components/site/ui/container";
import { Reveal } from "@/components/site/ui/reveal";
import { SectionRule } from "@/components/site/ui/section-rule";
import { faqDefaults, type FaqContent } from "@/content/home";
import { cn } from "@/lib/utils";

export function Faq({ content = faqDefaults }: { content?: FaqContent }) {
  // Matches the design: the first question starts open.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-[calc(var(--nav-h-sticky)+12px)]">
      <Container className="pt-section pb-section-sm">
        <SectionRule
          index={content.index}
          label={content.eyebrow}
          className="mb-[clamp(28px,3.2vw,48px)]"
        />

        <div className="grid items-start gap-[clamp(24px,3vw,64px)] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          <Reveal className="lg:sticky lg:top-[calc(var(--nav-h-sticky)+32px)]">
            <h2 className="mb-5 max-w-[13em] text-pretty font-heading text-display-sm text-ink-900">
              {content.title}
            </h2>
            <p className="max-w-[26em] text-[15.5px] leading-[1.75] text-ink-300">
              {content.note}
            </p>
          </Reveal>

          <div>
            {content.items.map((item, i) => {
              const open = openIndex === i;
              return (
                <div
                  key={item.question}
                  className="border-b border-line-strong"
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? null : i)}
                    className={cn(
                      "flex w-full items-baseline justify-between gap-5 py-[clamp(18px,1.9vw,24px)] text-left transition-colors",
                      open
                        ? "text-ink-900"
                        : "text-ink-900 hover:text-sage-600",
                    )}
                  >
                    <span className="font-heading text-[clamp(17.5px,1.55vw,21px)] leading-[1.32] tracking-[-0.022em]">
                      {item.question}
                    </span>
                    <span
                      aria-hidden
                      className="relative mt-[5px] size-[13px] shrink-0 text-clay-400"
                    >
                      <span className="absolute top-1.5 left-0 block h-px w-[13px] bg-current" />
                      <span
                        className={cn(
                          "absolute top-0 left-1.5 block h-[13px] w-px bg-current transition-transform duration-[350ms] ease-[cubic-bezier(.16,1,.3,1)]",
                          open && "rotate-90",
                        )}
                      />
                    </span>
                  </button>

                  {open && (
                    <p className="reveal-shown max-w-[38em] text-pretty pr-[clamp(24px,3vw,60px)] pb-[clamp(22px,2.2vw,28px)] text-[15.5px] leading-[1.75] text-ink-400">
                      {item.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
