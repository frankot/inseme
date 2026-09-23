import { Cta } from "@/components/site/ui/cta";
import { Reveal } from "@/components/site/ui/reveal";
import { Section } from "@/components/site/ui/section";
import { SiteImage } from "@/components/site/ui/site-image";
import {
  formatArticleDate,
  latestArticleDefaults,
  type LatestArticleContent,
} from "@/content/artykuly";
import { getArticlePreview } from "@/lib/article-preview";
import type { ArticleDetail } from "@/lib/queries/articles";

/**
 * An alternative 04: instead of the price list, the first page of the newest
 * article. The rest of the homepage is photographs, cards and numbers; this is
 * the one band that is simply text to read — the article's own heading and
 * lead in the masthead, its opening paragraphs fading out into "Czytaj dalej",
 * and beside them an outline of what the rest covers.
 *
 * The opening and the outline are read out of the article body (see
 * `getArticlePreview`), so publishing a new text is all it takes to change it.
 */
export function Poradnik({
  article,
  content = latestArticleDefaults,
}: {
  article: ArticleDetail;
  content?: LatestArticleContent;
}) {
  const { opening, points } = getArticlePreview(article.body);
  const date = formatArticleDate(article.publishedAt);
  const href = `/artykuly/${article.slug}`;

  return (
    <Section
      id="poradnik"
      tone="tinted"
      index={content.index}
      label={content.eyebrow}
      title={article.title}
      lead={article.excerpt ?? undefined}
      action={<Cta href={content.allHref}>{content.allLabel}</Cta>}
    >
      <div className="grid items-start gap-x-[clamp(32px,5.5vw,104px)] gap-y-[clamp(36px,4vw,56px)] nav:[grid-template-columns:minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <Reveal className="min-w-0">
          {(date || article.authorReviewer) && (
            <p className="flex flex-wrap gap-x-3 gap-y-1 border-t border-line-strong pt-[14px] text-meta text-ink-300">
              {date && <span className="tabular-nums text-clay-600">{date}</span>}
              {date && article.authorReviewer && <span aria-hidden>·</span>}
              {article.authorReviewer && (
                <span>
                  {content.reviewerLabel}: <span className="text-ink-600">{article.authorReviewer}</span>
                </span>
              )}
            </p>
          )}

          {opening.length > 0 && (
            <div
              // The last lines fade out: this is the start of a text, not all of
              // it, and the fade says so before the button does.
              className="rich-text mt-[clamp(18px,2vw,28px)] max-w-[38em] [mask-image:linear-gradient(to_bottom,#000_calc(100%-5.5em),transparent)] [&>p:first-child]:text-ink-700"
            >
              {opening.map((html, i) => (
                // Sanitised on write by `sanitizeBlocks` in the save action.
                <p key={i} dangerouslySetInnerHTML={{ __html: html }} />
              ))}
            </div>
          )}

          <Cta href={href} variant="solid" className="mt-[clamp(20px,2.2vw,32px)]">
            {content.readLabel}
          </Cta>
        </Reveal>

        {(article.cover || points.length > 0) && (
          <Reveal delay={120} className="min-w-0">
            {article.cover && (
              <figure className="relative m-0 mb-[clamp(24px,2.6vw,36px)] aspect-[3/2] overflow-hidden bg-stone">
                <SiteImage
                  src={article.cover.url}
                  alt={article.cover.altText ?? ""}
                  fill
                  sizes="(max-width: 960px) 100vw, 32vw"
                  className="object-cover saturate-[.92]"
                />
              </figure>
            )}

            {points.length > 0 && (
              <>
                <p className="mb-[clamp(12px,1.3vw,18px)] text-eyebrow uppercase tracking-[0.2em] text-clay-600">
                  {content.outlineLabel}
                </p>
                <ol className="border-t border-line-strong">
                  {points.map((point, i) => (
                    <li
                      key={i}
                      className="flex gap-[clamp(14px,1.6vw,22px)] border-b border-line py-[clamp(12px,1.3vw,17px)]"
                    >
                      <span className="shrink-0 pt-[3px] text-eyebrow tabular-nums tracking-[0.18em] text-clay-400">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-heading text-[clamp(16px,1.2vw,18.5px)] leading-[1.35] tracking-[-0.02em] text-ink-900">
                        {point}
                      </span>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </Reveal>
        )}
      </div>
    </Section>
  );
}
