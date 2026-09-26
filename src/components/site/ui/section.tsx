import type { ReactNode } from "react";

import { Container } from "@/components/site/ui/container";
import { Reveal } from "@/components/site/ui/reveal";
import { Slab, type SectionTone } from "@/components/site/ui/slab";
import { cn } from "@/lib/utils";

export type { SectionTone };

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
 * Every band on the page, top to bottom: the masthead that opens it, inside the
 * `Slab` that gives it its ground, its rhythm and its place in the stack.
 *
 * The masthead is one shape everywhere — `01 / OŚRODEK`, then the heading on
 * the left with the lead and any link opposite it. Sections used to each invent
 * their own arrangement of numeral, rule, heading and lead, which is most of
 * why the page stopped looking like one site. A section that carries its
 * heading elsewhere (the sticky column in FAQ, say) simply omits `title` and
 * gets the eyebrow alone.
 *
 * The same `index` does double duty: it prints in the eyebrow, and `Slab` reads
 * its parity to decide whether this band is a raised sheet or the ground one is
 * laid on. Subpages have no numerals to count with, so they pass `raised`
 * instead and keep the same alternation by hand.
 */
export function Section({
  id,
  tone = "default",
  index,
  raised,
  label,
  title,
  lead,
  action,
  leadMinLines,
  above,
  children,
  className,
}: {
  id?: string;
  tone?: SectionTone;
  /** The numeral, e.g. "01". Omit on the unnumbered fork. */
  index?: string;
  /** Whether this band is a raised sheet, for the bands with no numeral. */
  raised?: boolean;
  /** The uppercase name of the section. */
  label: string;
  title?: ReactNode;
  lead?: ReactNode;
  /** Usually a quiet `Cta` — "Poznaj cały zespół →". */
  action?: ReactNode;
  /**
   * Reserve room for this many lines of lead, so a section whose copy swaps —
   * the two paths in Pierwszy kontakt — does not shift everything below it when
   * the shorter text loads. Counted in `em` against the lead's own size, which
   * is a clamp, so the reservation tracks the viewport instead of being right
   * at one width only.
   */
  leadMinLines?: number;
  /**
   * Rendered above the masthead, inside the container. For the one section that
   * has to ask something before its own heading can say anything useful:
   * Pierwszy kontakt opens on the choice of who you are, and the numeral, the
   * title and the lead all answer it.
   */
  above?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Slab id={id} tone={tone} index={index} raised={raised} className={className}>
      <Container>
        {above}
        <SectionHead
          tone={tone}
          index={index}
          label={label}
          title={title}
          lead={lead}
          action={action}
          leadMinLines={leadMinLines}
        />
        {children}
      </Container>
    </Slab>
  );
}

function SectionHead({
  tone,
  index,
  label,
  title,
  lead,
  action,
  leadMinLines,
}: {
  tone: SectionTone;
  index?: string;
  label: string;
  title?: ReactNode;
  lead?: ReactNode;
  action?: ReactNode;
  leadMinLines?: number;
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
        <div className="mt-[clamp(18px,2vw,28px)] flex flex-wrap items-start justify-between gap-x-[clamp(32px,5vw,80px)] gap-y-6 tab:flex-nowrap">
          {title && (
            <h2
              className={cn(
                "max-w-[13em] flex-[1_1_22rem] text-pretty font-heading text-display-sm",
                TITLE[tone],
              )}
            >
              {title}
            </h2>
          )}

          {(lead || action) && (
            <div className="flex flex-[0_1_26rem] flex-col items-start gap-4">
              {lead && (
                <p
                  // 1.7 is the lead step's line-height — see `--text-lead` in
                  // globals.css. Keep the two in step.
                  style={
                    leadMinLines
                      ? { minHeight: `${leadMinLines * 1.7}em` }
                      : undefined
                  }
                  className={cn("max-w-[34em] text-pretty text-lead", LEAD[tone])}
                >
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
