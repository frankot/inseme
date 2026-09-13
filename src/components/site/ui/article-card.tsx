import Link from "next/link";

import { Reveal } from "@/components/site/ui/reveal";
import { SiteImage } from "@/components/site/ui/site-image";
import { formatArticleDate } from "@/content/artykuly";
import type { ArticleCardData } from "@/lib/queries/articles";
import { cn } from "@/lib/utils";

/**
 * One article, on the homepage teaser and on /artykuly alike. Follows the card
 * grammar the rest of the site uses — square corners, hairline borders, a cover
 * that drifts on hover, an arrow link that opens up.
 */
export function ArticleCard({
  article,
  delay = 0,
  sizes = "(max-width: 960px) 100vw, 25vw",
  className,
}: {
  article: ArticleCardData;
  delay?: number;
  sizes?: string;
  className?: string;
}) {
  const date = formatArticleDate(article.publishedAt);

  return (
    <Reveal as="article" delay={delay} className={cn("min-w-0", className)}>
      <Link
        href={`/artykuly/${article.slug}`}
        className="group flex h-full flex-col border border-line bg-bone transition-colors hover:border-line-warm"
      >
        <div className="relative aspect-[3/2] overflow-hidden bg-stone">
          {article.cover ? (
            <SiteImage
              src={article.cover.url}
              alt={article.cover.altText ?? ""}
              fill
              sizes={sizes}
              className="object-cover saturate-[.92] transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]"
            />
          ) : (
            // No cover yet: a hairline field rather than an empty grey rectangle.
            <span aria-hidden className="absolute inset-0 border-b border-line bg-mist" />
          )}
        </div>

        <div className="flex flex-auto flex-col p-[clamp(18px,1.8vw,26px)]">
          {date && (
            <span className="mb-2.5 text-eyebrow uppercase tracking-[0.18em] text-clay-600">
              {date}
            </span>
          )}

          <h3 className="font-heading text-[clamp(18px,1.5vw,22px)] leading-[1.28] tracking-[-0.025em] text-ink-900">
            {article.title}
          </h3>

          {article.excerpt && (
            <p className="mt-3 text-[14.5px] leading-[1.65] text-ink-400">{article.excerpt}</p>
          )}

          <span className="link-arrow mt-auto pt-5 text-[14.5px] text-sage-600 transition-colors group-hover:text-sage-700">
            <span>Czytaj</span>
            <span aria-hidden>→</span>
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
