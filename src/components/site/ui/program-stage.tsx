import { Container } from "@/components/site/ui/container";
import { Cta } from "@/components/site/ui/cta";
import { Reveal } from "@/components/site/ui/reveal";
import { Slab, type SectionTone } from "@/components/site/ui/slab";
import { StickySplit } from "@/components/site/ui/sticky-split";
import type { ProgramPoint, ProgramStage, StageBand } from "@/content/program";
import { cn } from "@/lib/utils";

/**
 * A stage of treatment, in its two sizes: the card in the /program overview,
 * and the band further down that the card links to. Both read one
 * `ProgramStage`, and both carry the same numeral, so a reader who clicks "02"
 * lands on a band that says "02".
 */

/** The stages are numbered by position — the content has no order of its own. */
export function stageIndex(i: number) {
  return String(i + 1).padStart(2, "0");
}

export function ProgramStageCard({
  stage,
  index,
  linkLabel,
  delay,
}: {
  stage: ProgramStage;
  index: string;
  linkLabel: string;
  delay?: number;
}) {
  return (
    <Reveal as="li" delay={delay} className="min-w-0">
      <a
        href={`#${stage.id}`}
        className="card-surface group flex h-full flex-col gap-4 p-card"
      >
        <p className="flex items-center gap-2.5 text-eyebrow uppercase tracking-[0.2em]">
          <span className="tabular-nums text-clay-400">{index}</span>
          <span aria-hidden className="text-clay-400 opacity-60">
            /
          </span>
          <span className="text-clay-600">{stage.cardMeta}</span>
        </p>
        <h3 className="text-pretty font-heading text-[clamp(19px,1.6vw,23px)] leading-[1.25] tracking-[-0.025em] text-ink-900">
          {stage.cardTitle}
        </h3>
        <p className="text-pretty text-meta text-ink-500">{stage.summary}</p>
        <Cta as="span" className="mt-auto pt-2">
          {linkLabel}
        </Cta>
      </a>
    </Reveal>
  );
}

const TONE = {
  light: {
    eyebrowIndex: "text-clay-400",
    eyebrow: "text-clay-600",
    title: "text-ink-900",
    lead: "text-ink-900",
    body: "text-ink-500",
    rule: "border-line-strong",
    ruleSoft: "border-line",
    numeral: "text-clay-400",
    pointTitle: "text-ink-900",
    pointBody: "text-ink-500",
    dash: "bg-clay-300",
    closing: "border-clay-300 text-ink-900",
    link: "quiet",
  },
  dark: {
    eyebrowIndex: "text-on-dark-faint",
    eyebrow: "text-on-dark-muted",
    title: "text-on-dark",
    lead: "text-on-dark",
    body: "text-on-dark-muted",
    rule: "border-white/12",
    ruleSoft: "border-white/12",
    numeral: "text-on-dark-faint",
    pointTitle: "text-on-dark",
    pointBody: "text-on-dark-muted",
    dash: "bg-clay-300",
    closing: "border-clay-300 text-on-dark",
    link: "quiet-on-dark",
  },
} as const;

/**
 * The long form of a stage. The heading and the why stay pinned on the left
 * while the list of what the stage covers scrolls past on the right, closed by
 * the sentence that says what it is all for — the same split the day plan and
 * the FAQ use, so the page keeps one rhythm from band to band.
 */
export function ProgramStageBand({
  stage,
  index,
  tone = "default",
  raised,
  sticky = true,
}: {
  stage: StageBand;
  index: string;
  tone?: SectionTone;
  raised?: boolean;
  /** Pin the heading column while the list scrolls past. */
  sticky?: boolean;
}) {
  const t = TONE[tone === "dark" ? "dark" : "light"];
  const [first, ...rest] = stage.intro;

  return (
    <Slab id={stage.id} tone={tone} raised={raised}>
      <Container>
        <StickySplit
          splitAt="desk"
          sticky={sticky}
          aside={
            <>
              <p className="flex flex-wrap items-center gap-2.5 text-eyebrow uppercase tracking-[0.22em]">
                <span className={cn("tabular-nums", t.eyebrowIndex)}>{index}</span>
                {stage.meta && (
                  <>
                    <span aria-hidden className={cn("opacity-60", t.eyebrowIndex)}>
                      /
                    </span>
                    <span className={t.eyebrow}>{stage.meta}</span>
                  </>
                )}
              </p>
              <h2
                className={cn(
                  "mt-[clamp(18px,2vw,28px)] max-w-[13em] text-pretty font-heading text-display-sm",
                  t.title,
                )}
              >
                {stage.title}
              </h2>
              {first && (
                <p
                  className={cn(
                    "mt-[clamp(18px,2vw,28px)] max-w-[32em] text-pretty font-heading text-[clamp(18px,1.6vw,22px)] font-light leading-[1.45] tracking-[-0.02em]",
                    t.lead,
                  )}
                >
                  {first}
                </p>
              )}
              {rest.map((paragraph) => (
                <p
                  key={paragraph}
                  className={cn("mt-4 max-w-[34em] text-pretty text-body-lg", t.body)}
                >
                  {paragraph}
                </p>
              ))}
            </>
          }
        >
          {stage.pointsTitle && (
            <Reveal
              as="div"
              className={cn(
                "border-b pb-[11px] text-eyebrow uppercase tracking-[0.18em]",
                t.rule,
                t.eyebrow,
              )}
            >
              {stage.pointsTitle}
            </Reveal>
          )}

          <ul
            className={cn(
              "m-0 list-none p-0",
              !stage.pointsTitle && cn("border-t", t.rule),
            )}
          >
            {stage.points.map((point, i) => (
              <Point
                key={point.title ?? point.body}
                point={point}
                index={stageIndex(i)}
                delay={Math.min(i, 5) * 55}
                t={t}
              />
            ))}
          </ul>

          {stage.closing && (
            <Reveal
              className={cn(
                "mt-[clamp(28px,3vw,44px)] flex flex-col gap-3 border-l-2 pl-[clamp(16px,1.6vw,24px)]",
                t.closing,
              )}
            >
              {stage.closing.map((paragraph) => (
                <p
                  key={paragraph}
                  className="max-w-[36em] text-pretty font-heading text-[clamp(17px,1.4vw,20px)] font-light leading-[1.5] tracking-[-0.015em]"
                >
                  {paragraph}
                </p>
              ))}
            </Reveal>
          )}

          {stage.link && (
            <Reveal className="mt-[clamp(22px,2.4vw,32px)]">
              <Cta href={stage.link.href} variant={t.link}>
                {stage.link.label}
              </Cta>
            </Reveal>
          )}
        </StickySplit>
      </Container>
    </Slab>
  );
}

/**
 * A titled point is a numbered row — heading, then what it means. An untitled
 * one is a line of an enumeration ("program obejmuje …") and gets the site's
 * short clay dash instead of a numeral, since its order means nothing.
 */
function Point({
  point,
  index,
  delay,
  t,
}: {
  point: ProgramPoint;
  index: string;
  delay: number;
  t: (typeof TONE)[keyof typeof TONE];
}) {
  if (!point.title) {
    return (
      <Reveal
        as="li"
        delay={delay}
        className={cn(
          "flex gap-3.5 border-b py-[clamp(13px,1.35vw,18px)] text-body-lg",
          t.ruleSoft,
          t.pointTitle,
        )}
      >
        <span aria-hidden className={cn("mt-[0.86em] block h-px w-[12px] shrink-0", t.dash)} />
        <span className="text-pretty">{point.body}</span>
      </Reveal>
    );
  }

  return (
    <Reveal
      as="li"
      delay={delay}
      className={cn(
        "grid gap-x-[clamp(14px,1.6vw,26px)] border-b py-[clamp(18px,1.9vw,26px)] [grid-template-columns:auto_minmax(0,1fr)]",
        t.rule,
      )}
    >
      <span
        aria-hidden
        className={cn("pt-[5px] font-heading text-eyebrow tabular-nums", t.numeral)}
      >
        {index}
      </span>
      <div className="min-w-0">
        <h3
          className={cn(
            "font-heading text-[clamp(18px,1.5vw,22px)] leading-[1.3] tracking-[-0.025em]",
            t.pointTitle,
          )}
        >
          {point.title}
        </h3>
        <p className={cn("mt-1.5 max-w-[44em] text-pretty text-body", t.pointBody)}>
          {point.body}
        </p>
      </div>
    </Reveal>
  );
}
