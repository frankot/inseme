"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { Container } from "@/components/site/ui/container";
import { Reveal } from "@/components/site/ui/reveal";
import { SectionRule } from "@/components/site/ui/section-rule";
import {
  contactDefaults,
  testDefaults,
  type SiteContact,
  type TestContent,
} from "@/content/home";
import { sendScreeningResult } from "@/lib/screening";
import {
  screeningResultSchema,
  type ScreeningResultInput,
} from "@/lib/validations/screening";

type Stage = "intro" | "question" | "result";

export function TestPrzesiewowy({
  content = testDefaults,
  contact = contactDefaults,
}: {
  content?: TestContent;
  contact?: SiteContact;
}) {
  const [stage, setStage] = useState<Stage>("intro");
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  /**
   * Steps differ a lot in length — the intro is three lines, a result with the
   * e-mail form is nearly double. Watching the content box lets the card
   * animate to each new height instead of snapping.
   */
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => setHeight(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const total = content.questions.length;
  const maxScore = total * Math.max(...content.options.map((o) => o.value));
  const band =
    content.bands.find((b) => score <= b.max) ??
    content.bands[content.bands.length - 1];

  const progress =
    stage === "intro"
      ? 0
      : stage === "result"
        ? 100
        : Math.round((index / total) * 100);

  function answer(value: number) {
    const next = score + value;
    if (index + 1 >= total) {
      setScore(next);
      setStage("result");
      return;
    }
    setScore(next);
    setIndex(index + 1);
  }

  function reset() {
    setStage("intro");
    setIndex(0);
    setScore(0);
  }

  return (
    <section id="test" className="scroll-mt-[calc(var(--nav-h-sticky)+12px)]">
      <Container className="pt-section pb-section-sm">
        <SectionRule
          index={content.index}
          label={content.eyebrow}
          className="mb-[clamp(28px,3.2vw,48px)]"
        />

        <div className="grid items-start gap-[clamp(24px,3vw,64px)] [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
          <Reveal>
            <h2 className="mb-[clamp(18px,2vw,26px)] max-w-[14em] text-pretty font-heading text-display-sm text-ink-900">
              {content.title}
            </h2>
            <p className="mb-[22px] max-w-[30em] text-base leading-[1.75] text-ink-500">
              {content.lead}
            </p>
            <p className="flex max-w-[30em] gap-3 border-t border-line-strong pt-[18px] text-[13.5px] leading-[1.65] text-ink-200">
              <span aria-hidden className="shrink-0 text-clay-300">
                !
              </span>
              <span>{content.disclaimer}</span>
            </p>
          </Reveal>

          <Reveal className="border border-line bg-white">
            <div className="h-0.5 bg-on-dark-3">
              <div
                className="h-0.5 bg-sage-600 transition-[width] duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div
              className="overflow-hidden transition-[height] duration-[420ms] ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none"
              style={height === undefined ? undefined : { height }}
            >
              {/* Ref sits on the stable wrapper: the keyed child below remounts
                  on every step, which would detach the observer. */}
              <div ref={contentRef}>
                <div
                  key={stage === "question" ? `q${index}` : stage}
                  className="animate-step-in p-[clamp(26px,2.6vw,40px)]"
                >
                  {stage === "intro" && (
                    <div className="flex flex-col gap-6">
                      <span className="text-eyebrow uppercase tracking-[0.2em] text-clay-400">
                        {content.meta}
                      </span>
                      <p className="text-pretty font-heading text-[clamp(22px,2.1vw,29px)] leading-[1.18] tracking-[-0.028em] text-ink-900">
                        {content.prompt}
                      </p>
                      <button
                        type="button"
                        onClick={() => setStage("question")}
                        className="link-arrow self-start border border-ink-900 bg-ink-900 px-[26px] py-[15px] text-[15.5px] text-bone transition-colors hover:bg-transparent hover:text-ink-900"
                      >
                        <span>{content.startLabel}</span>
                        <span aria-hidden>→</span>
                      </button>
                    </div>
                  )}

                  {stage === "question" && (
                    <div className="flex flex-col gap-[clamp(20px,2.2vw,30px)]">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="text-eyebrow tabular-nums tracking-[0.2em] text-clay-400">
                          {String(index + 1).padStart(2, "0")} /{" "}
                          {String(total).padStart(2, "0")}
                        </span>
                        <button
                          type="button"
                          onClick={reset}
                          className="text-[12.5px] uppercase tracking-[0.1em] text-clay-400 transition-colors hover:text-sage-600"
                        >
                          Od nowa
                        </button>
                      </div>

                      <p className="min-h-[3.6em] text-pretty font-heading text-[clamp(21px,2.05vw,28px)] leading-[1.2] tracking-[-0.028em] text-ink-900">
                        {content.questions[index]}
                      </p>

                      <div className="flex flex-col gap-[9px]">
                        {content.options.map((option) => (
                          <button
                            key={option.label}
                            type="button"
                            onClick={() => answer(option.value)}
                            className="group flex items-center justify-between gap-4 border border-line bg-cream px-[18px] py-[15px] text-left text-[15.5px] text-ink-600 transition-colors hover:border-sage-600 hover:bg-mist"
                          >
                            <span>{option.label}</span>
                            <span
                              aria-hidden
                              className="text-[13px] text-clay-300 transition-colors group-hover:text-sage-600"
                            >
                              →
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {stage === "result" && (
                    <div className="flex flex-col gap-[clamp(18px,2vw,26px)]">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="text-eyebrow uppercase tracking-[0.2em] text-clay-400">
                          {content.resultLabel}
                        </span>
                        <span className="font-heading text-[20px] font-light tracking-[-0.03em] tabular-nums text-clay-300">
                          {score} / {maxScore}
                        </span>
                      </div>

                      <p className="text-pretty font-heading text-[clamp(24px,2.4vw,34px)] leading-[1.12] tracking-[-0.03em] text-ink-900">
                        {band.title}
                      </p>
                      <p className="text-pretty border-b border-line pb-[clamp(18px,2vw,24px)] text-[15.5px] leading-[1.72] text-ink-400">
                        {band.body}
                      </p>

                      <ResultDelivery
                        content={content}
                        score={score}
                        contact={contact}
                      />

                      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pt-1">
                        <a
                          href={`tel:${contact.phoneHref}`}
                          className="link-arrow text-[14.5px] text-sage-600 transition-colors hover:text-sage-700"
                        >
                          <span>{content.callLabel}</span>
                          <span aria-hidden>→</span>
                        </a>
                        <button
                          type="button"
                          onClick={reset}
                          className="text-[12.5px] uppercase tracking-[0.1em] text-clay-400 transition-colors hover:text-sage-600"
                        >
                          {content.restartLabel}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function ResultDelivery({
  content,
  score,
  contact,
}: {
  content: TestContent;
  score: number;
  contact: SiteContact;
}) {
  const [sent, setSent] = useState(false);

  const form = useForm<ScreeningResultInput>({
    resolver: zodResolver(screeningResultSchema),
    defaultValues: { email: "", consent: true, score },
  });

  if (sent) {
    return (
      <p className="bg-mist px-4 py-3.5 text-[14.5px] leading-[1.7] text-ink-600">
        {content.sentMessage.replace("669 916 005", contact.phone)}
      </p>
    );
  }

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(async (values) => {
        const result = await sendScreeningResult({ ...values, score });
        if (result.ok) {
          setSent(true);
          return;
        }
        form.setError("email", { message: result.error });
      })}
      className="flex flex-col gap-3"
    >
      <span className="text-[13.5px] leading-[1.65] text-ink-300">
        {content.emailNote}
      </span>

      <div className="flex flex-wrap gap-2">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          aria-label="Adres e-mail"
          aria-invalid={!!form.formState.errors.email}
          placeholder={content.emailPlaceholder}
          {...form.register("email")}
          className="min-w-0 flex-auto border border-line bg-cream px-3.5 py-3 text-[15px] text-ink-900 outline-none placeholder:text-ink-200 focus-visible:border-sage-600"
        />
        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="link-arrow border border-ink-900 bg-ink-900 px-5 py-3 text-[15px] text-bone transition-colors hover:bg-transparent hover:text-ink-900 disabled:opacity-60"
        >
          <span>{content.sendLabel}</span>
          <span aria-hidden>→</span>
        </button>
      </div>

      <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-[1.6] text-ink-300">
        <input
          type="checkbox"
          {...form.register("consent")}
          className="mt-0.5 size-3.5 shrink-0 accent-[var(--sage-600)]"
        />
        <span>{content.consentLabel}</span>
      </label>

      {(form.formState.errors.email || form.formState.errors.consent) && (
        <p role="alert" className="text-[13px] text-destructive">
          {form.formState.errors.email?.message ??
            form.formState.errors.consent?.message}
        </p>
      )}
    </form>
  );
}
