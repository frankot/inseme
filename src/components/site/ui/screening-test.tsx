"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { contactDefaults, testDefaults, type SiteContact } from "@/content/home";
import type { PublicScreeningTest } from "@/lib/queries/screening";
import { sendScreeningResult } from "@/lib/screening";
import {
  screeningResultSchema,
  type ScreeningResultInput,
} from "@/lib/validations/screening";
import { HONEYPOT_FIELD } from "@/lib/honeypot";
import { cn } from "@/lib/utils";

type Stage = "intro" | "question" | "result";

/**
 * The test player. Everything it renders comes from the admin-authored test —
 * the labels around it (button captions, the consent sentence) still live in
 * `content/home.ts`, since those are chrome rather than content.
 *
 * Answers never leave the browser. Only the running total is submitted, and the
 * server re-derives the band from it; see `src/lib/screening.ts`.
 */
export function ScreeningTest({
  test,
  contact = contactDefaults,
  labels = testDefaults,
  /** Renders on a dark band — the homepage puts the test on one. */
  dark = false,
}: {
  test: PublicScreeningTest;
  contact?: SiteContact;
  labels?: typeof testDefaults;
  dark?: boolean;
}) {
  const [stage, setStage] = useState<Stage>("intro");
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  // Steps differ a lot in height — the intro is three lines, the result with
  // its e-mail form nearly double. Watching the content box lets the card
  // animate between heights instead of snapping.
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const el = contentRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => setHeight(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const total = test.questions.length;
  const band =
    [...test.bands]
      .sort((a, b) => a.minScore - b.minScore)
      .find((b) => score >= b.minScore && score <= b.maxScore) ??
    test.bands[test.bands.length - 1];

  const progress =
    stage === "intro" ? 0 : stage === "result" ? 100 : Math.round((index / total) * 100);

  function answer(points: number) {
    const next = score + points;
    setScore(next);
    if (index + 1 >= total) setStage("result");
    else setIndex(index + 1);
  }

  function reset() {
    setStage("intro");
    setIndex(0);
    setScore(0);
  }

  return (
    <div className={cn(dark ? "border border-white/12 bg-white/[0.045]" : "border border-line-strong bg-white")}>
      <div className={cn("h-0.5", dark ? "bg-white/12" : "bg-on-dark-3")}>
        <div
          className={cn("h-0.5 transition-[width] duration-500 ease-[cubic-bezier(.16,1,.3,1)]", dark ? "bg-sage-300" : "bg-sage-600")}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        className="overflow-hidden transition-[height] duration-[420ms] ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none"
        style={height === undefined ? undefined : { height }}
      >
        {/* Ref sits on the stable wrapper: the keyed child below remounts on
            every step, which would detach the observer. */}
        <div ref={contentRef}>
          <div
            key={stage === "question" ? `q${index}` : stage}
            className="animate-step-in p-[clamp(26px,2.6vw,40px)]"
          >
            {stage === "intro" && (
              <div className="flex flex-col gap-6">
                <span className={cn("text-eyebrow uppercase tracking-[0.2em]", dark ? "text-on-dark-faint" : "text-clay-400")}>
                  Samoocena · {total} {total === 1 ? "pytanie" : "pytań"} · ok. 2 minuty
                </span>
                <p className={cn("text-pretty font-heading text-[clamp(22px,2.1vw,29px)] leading-[1.18] tracking-[-0.028em]", dark ? "text-on-dark" : "text-ink-900")}>
                  {test.introText ?? labels.prompt}
                </p>
                <button
                  type="button"
                  onClick={() => setStage("question")}
                  className={cn("link-arrow self-start px-[clamp(22px,2.2vw,30px)] py-[15px] text-body transition-colors", dark ? "bg-bone text-ink-900 hover:bg-mist" : "bg-ink-900 text-bone hover:bg-ink-700")}
                >
                  <span>{labels.startLabel}</span>
                  <span aria-hidden>→</span>
                </button>
              </div>
            )}

            {stage === "question" && (
              <div className="flex flex-col gap-[clamp(20px,2.2vw,30px)]">
                <div className="flex items-baseline justify-between gap-4">
                  <span className={cn("text-eyebrow tabular-nums tracking-[0.2em]", dark ? "text-on-dark-faint" : "text-clay-400")}>
                    {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    onClick={reset}
                    className={cn("text-[12.5px] uppercase tracking-[0.1em] transition-colors", dark ? "text-on-dark-faint hover:text-sage-300" : "text-clay-400 hover:text-sage-600")}
                  >
                    Od nowa
                  </button>
                </div>

                <p className={cn("min-h-[3.6em] text-pretty font-heading text-[clamp(21px,2.05vw,28px)] leading-[1.2] tracking-[-0.028em]", dark ? "text-on-dark" : "text-ink-900")}>
                  {test.questions[index].text}
                </p>

                <div className="flex flex-col gap-[9px]">
                  {test.questions[index].options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => answer(option.points)}
                      className={cn("group flex items-center justify-between gap-4 border px-[18px] py-[15px] text-left text-body transition-colors", dark ? "border-white/12 bg-white/[0.04] text-on-dark-lead hover:border-sage-300 hover:bg-white/[0.09]" : "border-line-strong bg-cream text-ink-600 hover:border-sage-600 hover:bg-mist")}
                    >
                      <span>{option.label}</span>
                      <span
                        aria-hidden
                        className={cn("text-[13px] transition-colors", dark ? "text-on-dark-faint group-hover:text-sage-300" : "text-clay-300 group-hover:text-sage-600")}
                      >
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {stage === "result" && band && (
              <div className="flex flex-col gap-[clamp(18px,2vw,26px)]">
                <div className="flex items-baseline justify-between gap-4">
                  <span className={cn("text-eyebrow uppercase tracking-[0.2em]", dark ? "text-on-dark-faint" : "text-clay-400")}>
                    {labels.resultLabel}
                  </span>
                  <span className={cn("font-heading text-[20px] font-light tracking-[-0.03em] tabular-nums", dark ? "text-on-dark-faint" : "text-clay-300")}>
                    {score} / {test.maxScore}
                  </span>
                </div>

                <p className={cn("text-pretty font-heading text-[clamp(24px,2.4vw,34px)] leading-[1.12] tracking-[-0.03em]", dark ? "text-on-dark" : "text-ink-900")}>
                  {band.resultTitle}
                </p>
                <p className={cn("text-pretty border-b pb-[clamp(18px,2vw,24px)] text-body", dark ? "border-white/12 text-on-dark-muted" : "border-line text-ink-400")}>
                  {band.resultBody}
                </p>

                <ResultDelivery
                  testId={test.id}
                  score={score}
                  labels={labels}
                  contact={contact}
                  dark={dark}
                />

                <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pt-1">
                  <a
                    href={`tel:${contact.phoneHref}`}
                    className={cn("link-arrow text-body transition-colors", dark ? "text-on-dark-sage hover:text-on-dark" : "text-sage-600 hover:text-sage-700")}
                  >
                    <span>{labels.callLabel}</span>
                    <span aria-hidden>→</span>
                  </a>
                  <button
                    type="button"
                    onClick={reset}
                    className={cn("text-[12.5px] uppercase tracking-[0.1em] transition-colors", dark ? "text-on-dark-faint hover:text-sage-300" : "text-clay-400 hover:text-sage-600")}
                  >
                    {labels.restartLabel}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultDelivery({
  testId,
  score,
  labels,
  contact,
  dark,
}: {
  testId: string;
  score: number;
  labels: typeof testDefaults;
  contact: SiteContact;
  dark: boolean;
}) {
  const [sent, setSent] = useState(false);

  const form = useForm<ScreeningResultInput>({
    resolver: zodResolver(screeningResultSchema),
    defaultValues: { testId, email: "", consent: true, score, [HONEYPOT_FIELD]: "" },
  });

  if (sent) {
    return (
      <p className={cn("px-4 py-3.5 text-body", dark ? "bg-white/10 text-on-dark-lead" : "bg-mist text-ink-600")}>
        {labels.sentMessage.replace("669 916 005", contact.phone)}
      </p>
    );
  }

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(async (values) => {
        const result = await sendScreeningResult({ ...values, testId, score });
        if (result.ok) {
          setSent(true);
          return;
        }
        form.setError("email", { message: result.error });
      })}
      className="flex flex-col gap-3"
    >
      <span className={cn("text-meta", dark ? "text-on-dark-faint" : "text-ink-300")}>{labels.emailNote}</span>

      {/* Honeypot: off-screen, not hidden — some bots skip display:none fields. */}
      <input
        {...form.register(HONEYPOT_FIELD)}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute left-[-9999px] size-px opacity-0"
      />

      <div className="flex flex-wrap gap-2">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          aria-label="Adres e-mail"
          aria-invalid={!!form.formState.errors.email}
          placeholder={labels.emailPlaceholder}
          {...form.register("email")}
          className={cn("min-w-0 flex-auto border px-3.5 py-3 text-body outline-none", dark ? "border-white/15 bg-white/[0.06] text-on-dark placeholder:text-on-dark-faint focus-visible:border-sage-300" : "border-line-strong bg-cream text-ink-900 placeholder:text-ink-200 focus-visible:border-sage-600")}
        />
        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className={cn("link-arrow px-5 py-3 text-body transition-colors disabled:opacity-60", dark ? "bg-bone text-ink-900 hover:bg-mist" : "bg-ink-900 text-bone hover:bg-ink-700")}
        >
          <span>{form.formState.isSubmitting ? "Wysyłanie…" : labels.sendLabel}</span>
          <span aria-hidden>→</span>
        </button>
      </div>

      <label className={cn("flex cursor-pointer items-start gap-2.5 text-meta", dark ? "text-on-dark-faint" : "text-ink-300")}>
        <input
          type="checkbox"
          {...form.register("consent")}
          className={cn("mt-0.5 size-3.5 shrink-0", dark ? "accent-[var(--sage-300)]" : "accent-[var(--sage-600)]")}
        />
        <span>{labels.consentLabel}</span>
      </label>

      {(form.formState.errors.email || form.formState.errors.consent) && (
        <p role="alert" className={cn("text-meta", dark ? "text-clay-300" : "text-destructive")}>
          {form.formState.errors.email?.message ?? form.formState.errors.consent?.message}
        </p>
      )}
    </form>
  );
}
