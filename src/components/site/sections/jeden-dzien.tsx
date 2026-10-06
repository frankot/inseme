import { Container } from "@/components/site/ui/container";
import { Reveal } from "@/components/site/ui/reveal";
import { Slab, type SectionTone } from "@/components/site/ui/slab";
import { jedenDzienDefaults, type DayEntry, type JedenDzienContent } from "@/content/home";
import { cn } from "@/lib/utils";

/**
 * The day plan — a band of /program, sitting straight after the stationary
 * stage it describes: the stage says what the 28 days are for, this says what
 * one of them looks like.
 *
 * The bands around it are all the same split — heading pinned on one side, a
 * ruled list on the other — so this one is deliberately not. The heading runs
 * across the top, and the day below it is cut into three parts, each a short
 * vertical timeline on its own rail. Eleven entries would be a cramped strip as
 * one horizontal line; as three columns of three or four they stay readable,
 * and stack into one timeline on a phone.
 *
 * Markers come from the times themselves: a moment ("6:45") is a dot, a span
 * ("9:00–12:00") a bar running the height of its entry — so the shape of the
 * day shows at a glance without anyone tagging entries in the CMS.
 */

/** The parts of the day the entries are grouped into, by starting hour. */
const PHASES = [
  { label: "Przed południem", until: 12 },
  { label: "Po południu", until: 18 },
  { label: "Wieczorem", until: Infinity },
] as const;

const SUNDAY_LABEL = "Niedziela";

/** "9:00–12:00" → 9; "Wieczór" → null. */
function startHour(time: string): number | null {
  const match = time.trim().match(/^(\d{1,2})[:.]\d{2}/);
  return match ? Number(match[1]) : null;
}

const isSpan = (time: string) => /\d\s*[–-]\s*\d/.test(time);

/**
 * Entries in the order given, split by the hour they start. One with no
 * readable hour ("Wieczór") stays in the part of the day before it, so an
 * editor's wording never throws an entry into the wrong column.
 */
function groupByPhase(entries: DayEntry[]) {
  const groups: DayEntry[][] = PHASES.map(() => []);
  let phase = 0;
  for (const entry of entries) {
    const hour = startHour(entry.time);
    if (hour !== null) phase = PHASES.findIndex((p) => hour < p.until);
    groups[phase].push(entry);
  }
  return PHASES.map((p, i) => ({ label: p.label, entries: groups[i] })).filter(
    (group) => group.entries.length > 0,
  );
}

const COLUMNS: Record<number, string> = {
  1: "",
  2: "desk:grid-cols-2",
  3: "desk:grid-cols-3",
};

export function JedenDzien({
  content = jedenDzienDefaults,
  tone = "default",
  raised,
}: {
  content?: JedenDzienContent;
  tone?: SectionTone;
  raised?: boolean;
}) {
  const phases = groupByPhase(content.entries);

  return (
    <Slab id="dzien" tone={tone} raised={raised}>
      <Container>
        <Reveal>
          <span className="block text-eyebrow uppercase tracking-[0.22em] text-clay-600">
            {content.eyebrow}
          </span>
          <div className="mt-[clamp(18px,2vw,28px)] grid items-start gap-x-[clamp(32px,6vw,112px)] gap-y-[clamp(18px,2vw,28px)] desk:[grid-template-columns:minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <h2 className="max-w-[13em] text-pretty font-heading text-display-sm text-ink-900">
              {content.title}
            </h2>
            <div className="flex max-w-[34em] flex-col gap-4">
              <p className="text-pretty text-body-lg text-ink-500">{content.lead}</p>
              {content.body.map((paragraph) => (
                <p key={paragraph} className="text-pretty text-body text-ink-500">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-section-sm">
          <Reveal
            as="div"
            className="border-b border-line-warm pb-[11px] text-eyebrow uppercase tracking-[0.18em] text-clay-400"
          >
            {content.scheduleLabel}
          </Reveal>

          <div
            className={cn(
              "grid gap-x-[clamp(28px,3.4vw,56px)]",
              COLUMNS[phases.length] ?? "desk:grid-cols-3",
            )}
          >
            {phases.map((phase, p) => (
              <Reveal as="section" key={phase.label} delay={p * 80} className="min-w-0">
                <h3 className="border-b border-line-strong py-[clamp(14px,1.5vw,20px)] font-heading text-[clamp(18px,1.5vw,22px)] leading-[1.3] tracking-[-0.025em] text-ink-900">
                  {phase.label}
                </h3>
                <ol className="relative m-0 list-none p-0 pt-[clamp(18px,2vw,26px)] pb-[clamp(10px,1.2vw,16px)]">
                  {/* The rail, centred under the 11px marker column. */}
                  <span
                    aria-hidden
                    className="absolute top-[calc(clamp(18px,2vw,26px)+6px)] bottom-[calc(clamp(16px,1.7vw,22px)+clamp(10px,1.2vw,16px))] left-[5px] w-px bg-line-warm"
                  />
                  {phase.entries.map((entry) => (
                    <Entry key={entry.time + entry.title} entry={entry} />
                  ))}
                </ol>
              </Reveal>
            ))}
          </div>

          <Reveal className="grid gap-x-[clamp(28px,3.4vw,56px)] gap-y-2 border-t border-line-warm pt-[clamp(16px,1.8vw,24px)] tab:[grid-template-columns:minmax(0,12rem)_minmax(0,1fr)]">
            <span className="text-eyebrow uppercase tracking-[0.18em] text-clay-600">
              {SUNDAY_LABEL}
            </span>
            <p className="max-w-[48em] text-pretty text-body text-ink-500">{content.note}</p>
          </Reveal>
        </div>
      </Container>
    </Slab>
  );
}

function Entry({ entry }: { entry: DayEntry }) {
  const span = isSpan(entry.time);

  return (
    <li className="relative grid grid-cols-[11px_minmax(0,1fr)] gap-x-[clamp(14px,1.4vw,20px)] pb-[clamp(16px,1.7vw,22px)]">
      {span ? (
        <span aria-hidden className="relative mt-[5px] w-[11px] rounded-full bg-sage-600" />
      ) : (
        <span
          aria-hidden
          className="relative mt-[5px] size-[11px] rounded-full border-2 border-sage-600 bg-bone"
        />
      )}
      <div className="min-w-0">
        <span className="block font-heading text-[clamp(13.5px,1vw,15px)] leading-[1.5] tabular-nums text-sage-600">
          {entry.time}
        </span>
        <p
          className={cn(
            "mt-0.5 font-heading leading-[1.35] tracking-[-0.02em] text-ink-900",
            span ? "text-[clamp(17px,1.35vw,20px)]" : "text-[clamp(16px,1.2vw,18px)]",
          )}
        >
          {entry.title}
        </p>
        {entry.detail && (
          <p className="mt-1.5 max-w-[34em] text-pretty text-meta text-ink-400">{entry.detail}</p>
        )}
      </div>
    </li>
  );
}
