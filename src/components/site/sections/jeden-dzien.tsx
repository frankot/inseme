import { Container } from "@/components/site/ui/container";
import { Reveal } from "@/components/site/ui/reveal";
import { Slab, type SectionTone } from "@/components/site/ui/slab";
import { StickySplit } from "@/components/site/ui/sticky-split";
import { jedenDzienDefaults, type JedenDzienContent } from "@/content/home";

/**
 * The day plan — a band of /program, sitting straight after the stationary
 * stage it describes: the stage says what the 28 days are for, this says what
 * one of them looks like.
 *
 * A timetable rather than a card grid, so it reads as a schedule and not as a
 * repeat of the overview cards at the top of the page. No photograph beside
 * it: the aside is long enough now that the pair would no longer fit a laptop
 * viewport while pinned.
 */
export function JedenDzien({
  content = jedenDzienDefaults,
  tone = "default",
  raised,
}: {
  content?: JedenDzienContent;
  tone?: SectionTone;
  raised?: boolean;
}) {
  return (
    <Slab id="dzien" tone={tone} raised={raised}>
      <Container>
        <StickySplit
          asideSide="right"
          aside={
            <>
              <span className="mb-4 block text-eyebrow uppercase tracking-[0.22em] text-clay-600">
                {content.eyebrow}
              </span>
              <h2 className="mb-6 max-w-[13em] text-pretty font-heading text-display-sm text-ink-900">
                {content.title}
              </h2>
              <p className="max-w-[30em] text-pretty text-body-lg text-ink-500">
                {content.lead}
              </p>
              {content.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-4 max-w-[30em] text-pretty text-body text-ink-500"
                >
                  {paragraph}
                </p>
              ))}
              <p className="mt-7 max-w-[30em] border-t border-line-warm pt-4 text-meta text-ink-400">
                {content.note}
              </p>
            </>
          }
        >
          <div className="flex items-baseline justify-between gap-4 border-b border-line-warm pb-[11px] text-eyebrow uppercase tracking-[0.18em] text-clay-400">
            <span>Godzina</span>
            <span className="text-right">{content.scheduleLabel}</span>
          </div>

          <ol>
            {content.entries.map((entry, i) => (
              <Reveal
                as="li"
                key={entry.time + entry.title}
                delay={Math.min(i, 6) * 45}
                className="flex gap-[clamp(14px,2.2vw,36px)] border-b border-line-strong py-[clamp(13px,1.35vw,19px)]"
              >
                <span className="w-[clamp(76px,8.6vw,124px)] shrink-0 pt-px font-heading text-[clamp(14px,1vw,15.5px)] leading-[1.5] tabular-nums text-sage-600">
                  {entry.time}
                </span>
                <div className="min-w-0">
                  <h3 className="font-heading text-[clamp(16.5px,1.25vw,19px)] leading-[1.35] tracking-[-0.02em] text-ink-900">
                    {entry.title}
                  </h3>
                  {entry.detail && (
                    <p className="mt-1.5 max-w-[42em] text-meta text-ink-400">
                      {entry.detail}
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </ol>
        </StickySplit>
      </Container>
    </Slab>
  );
}
