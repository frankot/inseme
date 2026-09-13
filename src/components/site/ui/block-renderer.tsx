import { SiteImage } from "@/components/site/ui/site-image";
import { Reveal } from "@/components/site/ui/reveal";
import type { Block, CtaBlock, FaqEmbedBlock, ImageTextBlock, StepListBlock } from "@/lib/blocks";
import { getPublishedFaq, type FaqEntry } from "@/lib/queries/faq";
import { getMediaByIds } from "@/lib/queries/media";
import type { MediaSummary } from "@/lib/media-types";
import { cn } from "@/lib/utils";

/**
 * The public half of the block editor: renders the typed blocks an editor
 * stacks in /admin (articles today, `pages` when those get a route). Every type
 * in `src/lib/blocks.ts` needs a case here, or it renders as nothing.
 *
 * Blocks reference media and FAQ rows by id rather than carrying them, so the
 * lookups happen once up front instead of per block.
 */
export async function BlockRenderer({ blocks }: { blocks: Block[] }) {
  const mediaIds = blocks
    .filter((block): block is ImageTextBlock => block.type === "image_text")
    .map((block) => block.mediaId)
    .filter((id): id is string => Boolean(id));

  const faqCategories = blocks
    .filter((block): block is FaqEmbedBlock => block.type === "faq_embed")
    .map((block) => block.category);

  const [media, faqGroups] = await Promise.all([
    getMediaByIds(mediaIds),
    Promise.all(faqCategories.map((category) => getPublishedFaq(category || undefined))),
  ]);
  const faqByCategory = new Map(faqCategories.map((category, i) => [category, faqGroups[i]]));

  return (
    <div className="flex flex-col gap-[clamp(36px,4.4vw,68px)]">
      {blocks.map((block) => {
        switch (block.type) {
          case "richtext":
            return (
              <Reveal key={block.id}>
                {/* Sanitised on write by `sanitizeBlocks` in the save action. */}
                <div
                  className="rich-text max-w-[38em]"
                  dangerouslySetInnerHTML={{ __html: block.html }}
                />
              </Reveal>
            );
          case "image_text":
            return (
              <ImageText
                key={block.id}
                block={block}
                image={block.mediaId ? (media.get(block.mediaId) ?? null) : null}
              />
            );
          case "cta":
            return <Cta key={block.id} block={block} />;
          case "step_list":
            return <StepList key={block.id} block={block} />;
          case "faq_embed":
            return (
              <FaqEmbed
                key={block.id}
                block={block}
                items={faqByCategory.get(block.category) ?? []}
              />
            );
        }
      })}
    </div>
  );
}

function ImageText({ block, image }: { block: ImageTextBlock; image: MediaSummary | null }) {
  return (
    <Reveal className="grid items-start gap-x-[clamp(24px,3vw,56px)] gap-y-7 nav:grid-cols-2">
      {image && (
        <figure
          className={cn(
            "relative m-0 aspect-[4/3] overflow-hidden bg-stone",
            block.imagePosition === "right" && "nav:order-2",
          )}
        >
          <SiteImage
            src={image.url}
            alt={image.altText ?? ""}
            fill
            sizes="(max-width: 960px) 100vw, 45vw"
            className="object-cover saturate-[.92]"
          />
        </figure>
      )}
      <div>
        {block.heading && (
          <h2 className="mb-4 font-heading text-heading text-ink-900">{block.heading}</h2>
        )}
        <div className="rich-text" dangerouslySetInnerHTML={{ __html: block.html }} />
      </div>
    </Reveal>
  );
}

function Cta({ block }: { block: CtaBlock }) {
  return (
    <Reveal className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 bg-ink-900 p-card">
      <div className="max-w-[30em]">
        {block.heading && (
          <h2 className="mb-3 font-heading text-heading text-on-dark">{block.heading}</h2>
        )}
        {block.text && <p className="text-[15.5px] leading-[1.68] text-on-dark-sage-2">{block.text}</p>}
      </div>
      {block.buttonLabel && block.buttonHref && (
        <a
          href={block.buttonHref}
          className="link-arrow bg-bone px-[26px] py-[15px] text-[15px] text-ink-900 transition-colors hover:bg-mist"
        >
          <span>{block.buttonLabel}</span>
          <span aria-hidden>→</span>
        </a>
      )}
    </Reveal>
  );
}

function StepList({ block }: { block: StepListBlock }) {
  return (
    <Reveal>
      {block.heading && (
        <h2 className="mb-[clamp(16px,1.8vw,26px)] font-heading text-heading text-ink-900">
          {block.heading}
        </h2>
      )}
      <ol className="border-t border-line-strong">
        {block.steps.map((step, i) => (
          <li
            key={step.id}
            className="flex gap-[clamp(14px,2.2vw,34px)] border-b border-line py-[clamp(14px,1.5vw,20px)]"
          >
            <span className="shrink-0 pt-1 text-eyebrow tabular-nums tracking-[0.18em] text-clay-400">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <h3 className="font-heading text-[clamp(16.5px,1.25vw,19px)] leading-[1.35] tracking-[-0.02em] text-ink-900">
                {step.title}
              </h3>
              {step.description && (
                <p className="mt-1.5 max-w-[42em] text-[14.5px] leading-[1.6] text-ink-400">
                  {step.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

/**
 * Questions from the FAQ table, open rather than folded: inside an article the
 * answers are the content, and an accordion would hide it from the reader and
 * from search engines alike.
 */
function FaqEmbed({ block, items }: { block: FaqEmbedBlock; items: FaqEntry[] }) {
  if (items.length === 0) return null;

  return (
    <Reveal>
      {block.heading && (
        <h2 className="mb-[clamp(16px,1.8vw,26px)] font-heading text-heading text-ink-900">
          {block.heading}
        </h2>
      )}
      <dl className="border-t border-line-strong">
        {items.map((item) => (
          <div key={item.id} className="border-b border-line py-[clamp(16px,1.7vw,24px)]">
            <dt className="font-heading text-[clamp(16.5px,1.3vw,20px)] leading-[1.32] tracking-[-0.022em] text-ink-900">
              {item.question}
            </dt>
            <dd
              className="mt-2.5 ml-0 max-w-[38em] text-[15.5px] leading-[1.75] text-ink-400 [&_a]:text-sage-600 [&_a]:underline [&_p+p]:mt-3"
              dangerouslySetInnerHTML={{ __html: item.answer }}
            />
          </div>
        ))}
      </dl>
    </Reveal>
  );
}
