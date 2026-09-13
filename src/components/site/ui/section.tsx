import type { ReactNode } from "react";

import { Container } from "@/components/site/ui/container";
import { Reveal } from "@/components/site/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * The ground a band sits on. The page alternates them so the scroll has a
 * rhythm instead of nine identical cream screens: `tinted` carries the card
 * grids, where a warm ground is what makes a bone card's edge visible, and
 * `dark` is reserved for the two moments that should stop the reader — the
 * hero and the quote.
 */
export type SectionTone = "default" | "tinted" | "dark";

const GROUND: Record<SectionTone, string> = {
  // The hairline is the skeleton: on the page ground it is the only thing
  // marking where one band ends, so it stays even when a tone change would
  // already separate the two.
  default: "border-t border-line bg-cream",
  tinted: "bg-sand",
  dark: "bg-ink-950",
};

const EYEBROW_INDEX: Record<SectionTone, string> = {
  default: "text-clay-400",
  tinted: "text-clay-400",
  dark: "text-on-dark-faint",
};

const EYEBROW_LABEL: Record<SectionTone, string> = {
  default: "text-clay-600",
  tinted: "text-clay-600",
  dark: "text-on-dark-muted",
};

const TITLE: Record<SectionTone, string> = {
  default: "text-ink-900",
  tinted: "text-ink-900",
  dark: "text-on-dark",
};

const LEAD: Record<SectionTone, string> = {
  default: "text-ink-500",
  tinted: "text-ink-500",
  dark: "text-on-dark-muted",
};

/**
 * Every band on the page, top to bottom: ground, vertical rhythm, and the
 * masthead that opens it.
 *
 * The masthead is one shape everywhere — `01 / OŚRODEK` under the section's
 * hairline, then the heading on the left with the lead and any link opposite
 * it. Sections used to each invent their own arrangement of numeral, rule,
 * heading and lead, which is most of why the page stopped looking like one
 * site. A section that carries its heading elsewhere (the sticky column in
 * FAQ, say) simply omits `title` and gets the eyebrow alone.
 *
 * Padding lives here rather than on each section, so the gaps between bands
 * are all the same height.
 */
export function Section({
  id,
  tone = "default",
  index,
  label,
  title,
  lead,
  action,
  children,
  className,
}: {
  id?: string;
  tone?: SectionTone;
  /** The numeral, e.g. "01". Omit on the unnumbered fork. */
  index?: string;
  /** The uppercase name of the section. */
  label: string;
  title?: ReactNode;
  lead?: ReactNode;
  /** Usually a quiet `Cta` — "Poznaj cały zespół →". */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-[calc(var(--nav-h-sticky)+12px)] py-section",
        GROUND[tone],
        className,
      )}
    >
      <Container>
        <SectionHead
          tone={tone}
          index={index}
          label={label}
          title={title}
          lead={lead}
          action={action}
        />
        {children}
      </Container>
    </section>
  );
}

function SectionHead({
  tone,
  index,
  label,
  title,
  lead,
  action,
}: {
  tone: SectionTone;
  index?: string;
  label: string;
  title?: ReactNode;
  lead?: ReactNode;
  action?: ReactNode;
}) {
  const hasBody = Boolean(title || lead || action);

  return (
    <Reveal
      className={
        hasBody ? "mb-[clamp(30px,3.4vw,52px)]" : "mb-[clamp(24px,2.6vw,38px)]"
      }
    >
      <p className="flex items-center gap-2.5 text-eyebrow uppercase tracking-[0.22em]">
        {index && (
          <>
            <span className={cn("tabular-nums", EYEBROW_INDEX[tone])}>
              {index}
            </span>
            <span aria-hidden className={cn("opacity-60", EYEBROW_INDEX[tone])}>
              /
            </span>
          </>
        )}
        <span className={EYEBROW_LABEL[tone]}>{label}</span>
      </p>

      {hasBody && (
        <div className="mt-[clamp(18px,2vw,28px)] flex flex-wrap items-start justify-between gap-x-[clamp(32px,5vw,80px)] gap-y-6">
          {title && (
            <h2
              className={cn(
                "max-w-[16em] flex-[1_1_22rem] text-pretty font-heading text-display-sm",
                TITLE[tone],
              )}
            >
              {title}
            </h2>
          )}

          {(lead || action) && (
            <div className="flex flex-[0_1_26rem] flex-col items-start gap-4">
              {lead && (
                <p className={cn("max-w-[34em] text-pretty text-lead", LEAD[tone])}>
                  {lead}
                </p>
              )}
              {action}
            </div>
          )}
        </div>
      )}
    </Reveal>
  );
}
