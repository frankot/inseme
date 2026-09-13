import { Reveal } from "@/components/site/ui/reveal";
import { StickySplit } from "@/components/site/ui/sticky-split";
import { jedenDzienDefaults, type JedenDzienContent } from "@/content/home";

/**
 * The day plan — the second half of section 04, not a section of its own: the
 * program cards say what a stay consists of, this says what a day in it looks
 * like, and splitting them put two numerals on one idea.
 *
 * A timetable rather than a card grid, so it reads as the other half of 04 and
 * not as a repeat of the tiles above it.
 */
export function JedenDzien({
  content = jedenDzienDefaults,
}: {
  content?: JedenDzienContent;
}) {
  return (
    <StickySplit
      id="dzien"
      className="mt-[clamp(52px,6.4vw,96px)] scroll-mt-[calc(var(--nav-h-sticky)+12px)]"
      image={content.image}
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
          <p className="mt-7 max-w-[30em] border-t border-line pt-4 text-[14.5px] leading-[1.6] text-ink-300">
            {content.note}
          </p>
        </>
      }
    >
      <div>
        <div className="flex items-baseline justify-between gap-4 border-b border-line-strong pb-[11px] text-eyebrow uppercase tracking-[0.18em] text-clay-400">
          <span>Godzina</span>
          <span>{content.scheduleLabel}</span>
        </div>

        <ol>
          {content.entries.map((entry, i) => (
            <Reveal
              as="li"
              key={entry.time + entry.title}
              delay={Math.min(i, 6) * 45}
              className="flex gap-[clamp(14px,2.2vw,36px)] border-b border-line py-[clamp(13px,1.35vw,19px)]"
            >
              <span className="w-[clamp(76px,8.6vw,124px)] shrink-0 pt-px font-heading text-[clamp(14px,1vw,15.5px)] leading-[1.5] tabular-nums text-sage-600">
                {entry.time}
              </span>
              <div className="min-w-0">
                <h3 className="font-heading text-[clamp(16.5px,1.25vw,19px)] leading-[1.35] tracking-[-0.02em] text-ink-900">
                  {entry.title}
                </h3>
                {entry.detail && (
                  <p className="mt-1.5 max-w-[42em] text-[14.5px] leading-[1.6] text-ink-400">
                    {entry.detail}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </StickySplit>
  );
}
