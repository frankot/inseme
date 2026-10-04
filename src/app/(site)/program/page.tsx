import type { Metadata } from "next";

import { Breadcrumb } from "@/components/site/chrome/page-intro";
import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { JedenDzien } from "@/components/site/sections/jeden-dzien";
import { Container } from "@/components/site/ui/container";
import {
  ProgramStageBand,
  ProgramStageCard,
  stageIndex,
} from "@/components/site/ui/program-stage";
import { Reveal } from "@/components/site/ui/reveal";
import { Slab, type SectionTone } from "@/components/site/ui/slab";
import { programPageDefaults as copy } from "@/content/program";

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: { canonical: "/program" },
};

/**
 * Where each stage band sits in the stack, by id. The page alternates sheet and
 * ground the way /osrodek does (see `Slab`): the opening is a sheet, so the
 * stationary stage is ground, the day plan a sheet again, and so on. The one
 * dark band falls on the outpatient year — the stage people know least about
 * and the one the page most needs them to stop at.
 */
const BANDS: Record<
  string,
  { tone: SectionTone; raised: boolean; sticky?: boolean }
> = {
  stacjonarny: { tone: "tinted", raised: false },
  // These two lists are barely longer than their heading columns — pinning
  // bought nothing but a column that sat still for a few pixels.
  ambulatoryjny: { tone: "dark", raised: false, sticky: false },
  rodzina: { tone: "default", raised: true, sticky: false },
  pro: { tone: "tinted", raised: false },
};

/**
 * The programme in full: an overview of the stages, then one band per stage,
 * with the day plan straight after the stationary stage it belongs to.
 */
export default function ProgramPage() {
  const [stationary, ...later] = copy.stages;

  return (
    <SubpageLayout intro={false}>
      {/* The opening sheet: title and the why, then the stages at a glance.
          `mt-0` because this sheet has no band above it to overlap. */}
      <Slab raised className="mt-0 pt-section-sm">
        <Container>
          <Reveal>
            <div className="text-eyebrow uppercase tracking-[0.22em] text-clay-400">
              <Breadcrumb
                items={[
                  { label: copy.breadcrumbHome, href: "/" },
                  { label: copy.breadcrumbLabel },
                ]}
              />
            </div>

            <div className="mt-[clamp(18px,2vw,28px)] grid items-start gap-x-[clamp(32px,6vw,112px)] gap-y-[clamp(18px,2vw,28px)] desk:[grid-template-columns:minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <h1 className="max-w-[14em] text-pretty font-heading text-display text-ink-900">
                {copy.title}
              </h1>
              <div className="flex max-w-[34em] flex-col gap-4">
                <p className="text-pretty text-lead text-ink-700">{copy.lead}</p>
                <p className="text-pretty text-lead text-ink-500">{copy.body}</p>
              </div>
            </div>
          </Reveal>

          <ol className="m-0 mt-section-sm grid list-none gap-gap p-0 tab:grid-cols-2 desk:grid-cols-4">
            {copy.stages.map((stage, i) => (
              <ProgramStageCard
                key={stage.id}
                stage={stage}
                index={stageIndex(i)}
                linkLabel={copy.cardLinkLabel}
                delay={i * 70}
              />
            ))}
          </ol>

          <Reveal className="mt-[clamp(20px,2.2vw,30px)] flex gap-3.5 border-t border-line-strong pt-[clamp(16px,1.6vw,22px)]">
            <span aria-hidden className="mt-[0.8em] block h-px w-[12px] shrink-0 bg-clay-300" />
            <p className="max-w-[52em] text-pretty text-body text-ink-500">
              {copy.detoxNote}
            </p>
          </Reveal>
        </Container>
      </Slab>

      <ProgramStageBand
        stage={stationary}
        index={stageIndex(0)}
        {...BANDS[stationary.id]}
      />

      <JedenDzien raised />

      {later.map((stage, i) => (
        <ProgramStageBand
          key={stage.id}
          stage={stage}
          index={stageIndex(i + 1)}
          {...BANDS[stage.id]}
        />
      ))}
    </SubpageLayout>
  );
}
