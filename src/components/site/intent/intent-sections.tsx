import { Breadcrumb } from "@/components/site/chrome/page-intro";
import { Container } from "@/components/site/ui/container";
import { Cta } from "@/components/site/ui/cta";
import { FaqList } from "@/components/site/ui/faq-list";
import { JsonLd } from "@/components/site/ui/json-ld";
import { Reveal } from "@/components/site/ui/reveal";
import { Section, type SectionTone } from "@/components/site/ui/section";
import { SiteImage } from "@/components/site/ui/site-image";
import { Slab } from "@/components/site/ui/slab";
import { StickySplit } from "@/components/site/ui/sticky-split";
import type { SiteContact } from "@/content/home";
import type {
  IntentCards,
  IntentFeature,
  IntentImage,
  IntentIntro,
  IntentPageContent,
  IntentStatement,
  IntentSteps,
} from "@/content/intent/types";
import type { ProgramPoint } from "@/content/program";
import type { FaqEntry } from "@/lib/queries/faq";
import { faqJsonLd } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

/**
 * The sections an intent page is built from, one form per slot. Each borrows
 * its shape from a homepage band — the hero's photograph, Pierwszy kontakt's
 * step rows, the dark Opinie band, Ośrodek's figures, the FAQ split — so the
 * subpage reads as the same site, not as a template beside it.
 */

type Placement = { raised: boolean; tone: SectionTone };

/** Several paragraphs inside a `Section` lead, which renders one <p>. */
function Paragraphs({ lines }: { lines: string[] }) {
  return lines.map((line, i) => (
    <span key={line} className={i > 0 ? "mt-3 block" : "block"}>
      {line}
    </span>
  ));
}

function Photo({
  image,
  sizes,
  className,
  imgClassName,
  preload,
}: {
  image: IntentImage;
  sizes: string;
  className?: string;
  /** Where the crop anchors, e.g. `object-top` for a portrait in a wide frame. */
  imgClassName?: string;
  preload?: boolean;
}) {
  return (
    <figure className="m-0">
      <div className={cn("relative w-full overflow-hidden bg-stone", className)}>
        <SiteImage
          src={image.src}
          alt={image.alt}
          fill
          preload={preload}
          sizes={sizes}
          className={cn("object-cover saturate-[.92]", imgClassName)}
        />
      </div>
      {image.caption && (
        <figcaption className="mt-3 text-meta text-ink-400">{image.caption}</figcaption>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------------ intro */

/**
 * The opening sheet: title, lead and the short answer on the left, a tall
 * photograph opposite — the hero's photograph brought down to subpage scale.
 * The call sits under the answer, where the hero puts it.
 */
export function IntentIntroSection({
  intro,
  crumbs,
  contact,
}: {
  intro: IntentIntro;
  crumbs: { label: string; href?: string }[];
  contact: SiteContact;
}) {
  const [first, ...rest] = intro.lead;

  return (
    <Slab raised className="mt-0 pt-section-sm">
      <Container>
        <Reveal className="text-eyebrow uppercase tracking-[0.22em] text-clay-400">
          <Breadcrumb items={crumbs} />
        </Reveal>

        <div className="mt-[clamp(18px,2vw,28px)] grid items-start gap-x-[clamp(32px,5vw,96px)] gap-y-[clamp(28px,3vw,40px)] desk:[grid-template-columns:minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <Reveal>
            <h1 className="max-w-[14em] text-pretty font-heading text-display text-ink-900">
              {intro.title}
            </h1>
            <p className="mt-[clamp(16px,1.8vw,24px)] max-w-[34em] text-pretty text-lead text-ink-700">
              {first}
            </p>
            {rest.map((paragraph) => (
              <p key={paragraph} className="mt-3 max-w-[34em] text-pretty text-lead text-ink-500">
                {paragraph}
              </p>
            ))}

            <div className="mt-[clamp(26px,3vw,40px)] max-w-[36em] border-t border-line-strong">
              <p className="pt-3.5 pb-1 text-eyebrow uppercase tracking-[0.2em] text-clay-600">
                {intro.summaryTitle}
              </p>
              <ul className="m-0 list-none p-0">
                {intro.summary.map((line) => (
                  <li
                    key={line}
                    className="flex gap-3 border-b border-line py-3 text-pretty text-body text-ink-700"
                  >
                    <span aria-hidden className="mt-[0.62em] block size-[5px] shrink-0 bg-sage-600" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Cta
              href={`tel:${contact.phoneHref}`}
              variant="solid"
              className="mt-[clamp(22px,2.4vw,32px)] tabular-nums"
            >
              Zadzwoń: {contact.phone}
            </Cta>
          </Reveal>

          <Reveal delay={120}>
            <Photo
              image={intro.image}
              preload
              sizes="(max-width: 1023px) 100vw, 44vw"
              className="aspect-[4/3] desk:aspect-[4/5]"
              // Faces sit high in a portrait photo; a centred 4:3 crop cuts them.
              imgClassName="object-top desk:object-center"
            />
          </Reveal>
        </div>
      </Container>
    </Slab>
  );
}

/* ------------------------------------------------------------------ steps */

/** Pierwszy kontakt's step rows: big light numeral, the step, what it means. */
export function IntentStepsSection({
  steps,
  index,
  placement,
}: {
  steps: IntentSteps;
  index: string;
  placement: Placement;
}) {
  return (
    <Section
      id={steps.id}
      index={index}
      {...placement}
      label={steps.label}
      title={steps.title}
      lead={<Paragraphs lines={steps.lead} />}
    >
      <ol className="m-0 list-none border-t border-line-strong p-0">
        {steps.steps.map((step, i) => (
          <Reveal
            as="li"
            key={step.title}
            delay={i * 60}
            className="grid grid-cols-[minmax(0,4.5em)_minmax(0,1fr)] gap-x-[clamp(20px,3vw,56px)] gap-y-3 border-b border-line-strong py-[clamp(22px,2.4vw,34px)] last:border-b-0 tab:grid-cols-[minmax(0,4.5em)_minmax(0,1fr)_minmax(0,1.35fr)]"
          >
            <span className="font-heading text-[clamp(26px,2.6vw,38px)] font-light leading-[.9] tracking-[-0.04em] tabular-nums text-clay-300">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-[clamp(20px,1.8vw,26px)] leading-[1.2] tracking-[-0.026em] text-ink-900">
              {step.title}
            </h3>
            <p className="col-start-2 text-pretty text-body text-ink-400 tab:col-start-3">
              {step.body}
            </p>
          </Reveal>
        ))}
      </ol>

      {(steps.note || steps.link) && (
        <Reveal className="mt-[clamp(22px,2.4vw,32px)] flex flex-wrap items-center justify-between gap-x-10 gap-y-4">
          {steps.note && (
            <p className="max-w-[40em] text-pretty text-body text-ink-500">{steps.note}</p>
          )}
          {steps.link && <Cta href={steps.link.href}>{steps.link.label}</Cta>}
        </Reveal>
      )}
    </Section>
  );
}

/* -------------------------------------------------------------- statement */

/**
 * The page's one dark band, like Opinie on the homepage: a single sentence set
 * at quote size, the explanation under it, and the detail in columns.
 */
export function IntentStatementSection({
  statement,
  index,
  raised = false,
}: {
  statement: IntentStatement;
  index: string;
  /** Normally ground; a sheet only when sections above it are switched off. */
  raised?: boolean;
}) {
  const titled = statement.points.every((point) => point.title);

  return (
    <Slab id={statement.id} tone="dark" raised={raised}>
      <Container>
        <Reveal>
          <p className="flex items-center gap-2.5 text-eyebrow uppercase tracking-[0.22em]">
            <span className="tabular-nums text-on-dark-faint">{index}</span>
            <span aria-hidden className="text-on-dark-faint opacity-60">
              /
            </span>
            <span className="text-on-dark-muted">{statement.label}</span>
          </p>
          <h2 className="mt-[clamp(20px,2.4vw,34px)] max-w-[22em] text-balance font-heading text-quote font-light text-on-dark">
            {statement.statement}
          </h2>
        </Reveal>

        <Reveal className="mt-[clamp(24px,2.8vw,40px)] grid gap-x-16 gap-y-4 tab:grid-cols-2">
          {statement.body.map((paragraph) => (
            <p key={paragraph} className="max-w-[34em] text-pretty text-body-lg text-on-dark-muted">
              {paragraph}
            </p>
          ))}
        </Reveal>

        {statement.points.length === 0 ? null : titled ? (
          <ul className="m-0 mt-[clamp(32px,3.6vw,56px)] grid list-none gap-x-[clamp(24px,3vw,56px)] p-0 tab:grid-cols-3">
            {statement.points.map((point, i) => (
              <Reveal
                as="li"
                key={point.title}
                delay={i * 70}
                className="border-t border-white/12 py-[clamp(16px,1.7vw,22px)]"
              >
                <h3 className="font-heading text-[clamp(18px,1.5vw,22px)] leading-[1.3] tracking-[-0.025em] text-on-dark">
                  {point.title}
                </h3>
                <p className="mt-2 text-pretty text-body text-on-dark-muted">{point.body}</p>
              </Reveal>
            ))}
          </ul>
        ) : (
          <DashList points={statement.points} dark />
        )}

        {statement.closing && (
          <Reveal className="mt-[clamp(20px,2.4vw,32px)] flex max-w-[52em] gap-3.5 border-l-2 border-clay-300 pl-[clamp(16px,1.6vw,24px)]">
            <p className="text-pretty font-heading text-[clamp(17px,1.4vw,20px)] font-light leading-[1.5] tracking-[-0.015em] text-on-dark">
              {statement.closing}
            </p>
          </Reveal>
        )}
      </Container>
    </Slab>
  );
}

function DashList({ points, dark }: { points: ProgramPoint[]; dark?: boolean }) {
  return (
    <ul
      className={cn(
        "m-0 mt-[clamp(28px,3vw,44px)] grid list-none gap-x-16 border-t p-0 tab:grid-cols-2",
        dark ? "border-white/12" : "border-line-strong",
      )}
    >
      {points.map((point) => (
        <li
          key={point.body}
          className={cn(
            "flex gap-3.5 border-b py-3.5 text-body",
            dark ? "border-white/12 text-on-dark" : "border-line text-ink-700",
          )}
        >
          <span aria-hidden className="mt-[0.8em] block h-px w-[12px] shrink-0 bg-clay-300" />
          <span className="text-pretty">{point.body}</span>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ cards */

/** A set of answers to compare side by side, as the /osrodek amenities do. */
export function IntentCardsSection({
  cards,
  index,
  placement,
}: {
  cards: IntentCards;
  index: string;
  placement: Placement;
}) {
  return (
    <Section
      id={cards.id}
      index={index}
      {...placement}
      label={cards.label}
      title={cards.title}
      lead={cards.lead}
    >
      <div className="grid gap-gap [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
        {cards.cards.map((card, i) => (
          <Reveal
            key={card.title}
            as="article"
            delay={(i % 4) * 70}
            className="card-surface flex min-w-0 flex-col gap-3 p-card"
          >
            {cards.numbered && (
              <span className="font-heading text-[clamp(22px,2vw,30px)] font-light leading-none tracking-[-0.04em] tabular-nums text-clay-300">
                {String(i + 1).padStart(2, "0")}
              </span>
            )}
            <h3 className="text-pretty font-heading text-[clamp(17px,1.45vw,21px)] leading-[1.3] tracking-[-0.025em] text-ink-900">
              {card.title}
            </h3>
            <p className="text-pretty text-meta text-ink-500">{card.body}</p>
          </Reveal>
        ))}
      </div>

      {(cards.note || cards.link) && (
        <Reveal className="mt-[clamp(22px,2.4vw,32px)] flex flex-wrap items-center justify-between gap-x-10 gap-y-4">
          {cards.note && (
            <p className="max-w-[44em] text-pretty text-body text-ink-500">{cards.note}</p>
          )}
          {cards.link && <Cta href={cards.link.href}>{cards.link.label}</Cta>}
        </Reveal>
      )}
    </Section>
  );
}

/* ---------------------------------------------------------------- feature */

/**
 * A photograph beside the text — the mirror of the intro, photo on the left
 * this time — closing on figures in the homepage's stat style or on points.
 */
export function IntentFeatureSection({
  feature,
  index,
  placement,
}: {
  feature: IntentFeature;
  index: string;
  placement: Placement;
}) {
  return (
    <Slab id={feature.id} tone={placement.tone} raised={placement.raised}>
      <Container>
        <div className="grid items-center gap-x-[clamp(32px,5vw,96px)] gap-y-[clamp(28px,3vw,40px)] desk:[grid-template-columns:minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Reveal>
            <Photo
              image={feature.image}
              sizes="(max-width: 1023px) 100vw, 42vw"
              className="aspect-[3/2] desk:aspect-[4/5]"
            />
          </Reveal>

          <Reveal delay={100}>
            <p className="flex items-center gap-2.5 text-eyebrow uppercase tracking-[0.22em]">
              <span className="tabular-nums text-clay-400">{index}</span>
              <span aria-hidden className="text-clay-400 opacity-60">
                /
              </span>
              <span className="text-clay-600">{feature.label}</span>
            </p>
            <h2 className="mt-[clamp(18px,2vw,28px)] max-w-[14em] text-pretty font-heading text-display-sm text-ink-900">
              {feature.title}
            </h2>
            {feature.body.map((paragraph, i) => (
              <p
                key={paragraph}
                className={cn(
                  "max-w-[34em] text-pretty text-lead",
                  i === 0 ? "mt-[clamp(16px,1.8vw,24px)] text-ink-700" : "mt-3 text-ink-500",
                )}
              >
                {paragraph}
              </p>
            ))}

            {feature.facts && feature.facts.length > 0 && (
              <div className="mt-[clamp(26px,3vw,40px)] grid grid-cols-2 gap-x-[clamp(20px,3vw,48px)] gap-y-6">
                {feature.facts.map((fact) => (
                  <div key={fact.label} className="border-t border-line-warm pt-[14px]">
                    <span className="block text-eyebrow uppercase tracking-[0.2em] text-clay-600">
                      {fact.label}
                    </span>
                    <span className="mt-2.5 block font-heading text-[clamp(24px,2.2vw,32px)] leading-none tracking-[-0.03em] tabular-nums text-ink-900">
                      {fact.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {feature.points && feature.points.length > 0 && (
              <ul className="m-0 mt-[clamp(24px,2.8vw,36px)] list-none border-t border-line-strong p-0">
                {feature.points.map((point) => (
                  <li key={point.title ?? point.body} className="border-b border-line py-3.5">
                    {point.title && (
                      <p className="text-body tracking-[-0.015em] text-ink-900">{point.title}</p>
                    )}
                    <p className="mt-1 text-pretty text-meta text-ink-500">{point.body}</p>
                  </li>
                ))}
              </ul>
            )}

            {feature.note && (
              <p className="mt-[clamp(18px,2vw,26px)] max-w-[36em] text-pretty text-meta text-ink-400">
                {feature.note}
              </p>
            )}

            {feature.link && (
              <Cta href={feature.link.href} className="mt-[clamp(18px,2vw,26px)]">
                {feature.link.label}
              </Cta>
            )}
          </Reveal>
        </div>
      </Container>
    </Slab>
  );
}

/* -------------------------------------------------------------------- faq */

/** The homepage FAQ band: heading pinned on the left, the accordion beside. */
export function IntentFaqSection({
  faq,
  items,
  index,
  placement,
}: {
  faq: IntentPageContent["faq"];
  items: FaqEntry[];
  index: string;
  placement: Placement;
}) {
  return (
    <Section id="pytania" index={index} {...placement} label={faq.label}>
      <JsonLd data={faqJsonLd(items)} />
      <StickySplit
        aside={
          <>
            <h2 className="mb-5 max-w-[13em] text-pretty font-heading text-display-sm text-ink-900">
              {faq.title}
            </h2>
            <p className="max-w-[26em] text-pretty text-lead text-ink-500">{faq.lead}</p>
          </>
        }
      >
        <FaqList items={items} />
      </StickySplit>
    </Section>
  );
}

/* ---------------------------------------------------------------- related */

/** Where to read next, then the call on the page's one dark card. */
export function IntentRelatedSection({
  related,
  call,
  contact,
  placement,
}: {
  related: IntentPageContent["related"];
  call: IntentPageContent["call"];
  contact: SiteContact;
  placement: Placement;
}) {
  return (
    <Section {...placement} label={related.label} title={related.title}>
      <ul className="m-0 grid list-none gap-gap p-0 tab:grid-cols-3">
        {related.links.map((link, i) => (
          <Reveal as="li" key={link.href} delay={i * 70} className="min-w-0">
            <a href={link.href} className="card-surface group flex h-full flex-col gap-3 p-card">
              <span className="font-heading text-[clamp(19px,1.6vw,23px)] leading-[1.25] tracking-[-0.025em] text-ink-900">
                {link.title}
              </span>
              <span className="text-pretty text-meta text-ink-500">{link.body}</span>
              <Cta as="span" className="mt-auto pt-2">
                {related.linkLabel}
              </Cta>
            </a>
          </Reveal>
        ))}
      </ul>

      <Reveal className="mt-gap grid items-end gap-x-16 gap-y-6 bg-ink-950 p-[clamp(26px,3.2vw,52px)] tab:[grid-template-columns:minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <h2 className="max-w-[14em] text-pretty font-heading text-display-sm text-on-dark">
          {call.title}
        </h2>
        <div className="flex flex-col items-start gap-[clamp(18px,2vw,24px)]">
          <p className="max-w-[30em] text-pretty text-body-lg text-on-dark-muted">{call.body}</p>
          <Cta href={`tel:${contact.phoneHref}`} variant="light" className="tabular-nums">
            {call.ctaLabel}: {contact.phone}
          </Cta>
        </div>
      </Reveal>
    </Section>
  );
}
