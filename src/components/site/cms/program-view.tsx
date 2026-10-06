import { Breadcrumb } from "@/components/site/chrome/page-intro";
import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { CmsSlot } from "@/components/site/cms/cms-slot";
import { JedenDzien } from "@/components/site/sections/jeden-dzien";
import { Container } from "@/components/site/ui/container";
import { Cta } from "@/components/site/ui/cta";
import {
  ProgramStageBand,
  ProgramStageCard,
  stageIndex,
} from "@/components/site/ui/program-stage";
import { Reveal } from "@/components/site/ui/reveal";
import { Slab, type SectionTone } from "@/components/site/ui/slab";
import { STAGE_IDS } from "@/cms/pages/program";
import { jedenDzienDefaults, type JedenDzienContent } from "@/content/home";
import { programPageDefaults, type ProgramStage } from "@/content/program";
import type { CmsPage } from "@/lib/cms/get-page";

/**
 * Where each stage band sits in the stack, by id. The page alternates sheet and
 * ground the way /osrodek does (see `Slab`): the opening is a sheet, so the
 * stationary stage is ground, the day plan a sheet again, and so on. The one
 * dark band falls on the outpatient year — the stage people know least about
 * and the one the page most needs them to stop at.
 */
const BANDS: Record<
  string,
  { tone: SectionTone; raised: boolean; sticky?: boolean; layout?: "list" | "cards" }
> = {
  stacjonarny: { tone: "tinted", raised: false },
  // These two lists are barely longer than their heading columns — pinning
  // bought nothing but a column that sat still for a few pixels.
  ambulatoryjny: { tone: "dark", raised: false, sticky: false },
  // Three titled points side by side, as cards — the shape of the overview.
  rodzina: { tone: "default", raised: true, layout: "cards" },
  pro: { tone: "tinted", raised: false },
};

type IntroData = {
  breadcrumbLabel: string;
  title: string;
  lead: string;
  body: string;
  cardLinkLabel: string;
  detoxNote: string;
  detoxLink: { label: string; href: string };
};

/**
 * The programme in full: an overview of the stages, then one band per stage,
 * with the day plan straight after the stationary stage it belongs to. Used by
 * `/program` and the editor's preview.
 */
export function ProgramView({ page }: { page: CmsPage }) {
  const intro = page.sections.intro.data as IntroData;
  const stages: ProgramStage[] = STAGE_IDS.map((id) => ({
    id,
    ...(page.sections[id].data as Omit<ProgramStage, "id">),
  }));
  // Hidden stages leave the overview as well as their band; the numbering
  // closes up behind them.
  const shown = stages.filter((stage) => page.sections[stage.id].enabled);
  const numberOf = (id: string) => stageIndex(shown.findIndex((stage) => stage.id === id));

  const band = (stage: ProgramStage) => (
    <CmsSlot key={stage.id} page={page} id={stage.id}>
      <ProgramStageBand stage={stage} index={numberOf(stage.id)} {...BANDS[stage.id]} />
    </CmsSlot>
  );
  const [stationary, ...later] = stages;

  return (
    <SubpageLayout intro={false}>
      {/* The opening sheet: title and the why, then the stages at a glance.
          `mt-0` because this sheet has no band above it to overlap. */}
      <CmsSlot page={page} id="intro">
        <Slab raised className="mt-0 pt-section-sm">
          <Container>
            <Reveal>
              <div className="text-eyebrow uppercase tracking-[0.22em] text-clay-400">
                <Breadcrumb
                  items={[
                    { label: programPageDefaults.breadcrumbHome, href: "/" },
                    { label: intro.breadcrumbLabel },
                  ]}
                />
              </div>

              <div className="mt-[clamp(18px,2vw,28px)] grid items-start gap-x-[clamp(32px,6vw,112px)] gap-y-[clamp(18px,2vw,28px)] desk:[grid-template-columns:minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <h1 className="max-w-[14em] text-pretty font-heading text-display text-ink-900">
                  {intro.title}
                </h1>
                <div className="flex max-w-[34em] flex-col gap-4">
                  <p className="text-pretty text-lead text-ink-700">{intro.lead}</p>
                  <p className="text-pretty text-lead text-ink-500">{intro.body}</p>
                </div>
              </div>
            </Reveal>

            <ol className="m-0 mt-section-sm grid list-none gap-gap p-0 tab:grid-cols-2 desk:grid-cols-4">
              {shown.map((stage, i) => (
                <ProgramStageCard
                  key={stage.id}
                  stage={stage}
                  index={stageIndex(i)}
                  linkLabel={intro.cardLinkLabel}
                  delay={i * 70}
                />
              ))}
            </ol>

            <Reveal className="mt-[clamp(20px,2.2vw,30px)] flex gap-3.5 border-t border-line-strong pt-[clamp(16px,1.6vw,22px)]">
              <span aria-hidden className="mt-[0.8em] block h-px w-[12px] shrink-0 bg-clay-300" />
              <div className="flex flex-col items-start gap-2">
                <p className="max-w-[52em] text-pretty text-body text-ink-500">{intro.detoxNote}</p>
                <Cta href={intro.detoxLink.href}>{intro.detoxLink.label}</Cta>
              </div>
            </Reveal>
          </Container>
        </Slab>
      </CmsSlot>

      {band(stationary)}

      <CmsSlot page={page} id="dzien">
        <JedenDzien
          raised
          content={{ ...jedenDzienDefaults, ...(page.sections.dzien.data as Partial<JedenDzienContent>) }}
        />
      </CmsSlot>

      {later.map(band)}
    </SubpageLayout>
  );
}
