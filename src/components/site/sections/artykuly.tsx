import { ArticleCard } from "@/components/site/ui/article-card";
import { Cta } from "@/components/site/ui/cta";
import { Section } from "@/components/site/ui/section";
import { articlesTeaserDefaults, type ArticlesTeaserContent } from "@/content/artykuly";
import type { ArticleCardData } from "@/lib/queries/articles";

/**
 * The four newest articles. Like Zespół it takes real rows and removes itself
 * when there are none, so an empty poradnik leaves no heading over a gap.
 */
export function Artykuly({
  articles,
  content = articlesTeaserDefaults,
}: {
  articles: ArticleCardData[];
  content?: ArticlesTeaserContent;
}) {
  if (articles.length === 0) return null;

  return (
    <Section
      id="artykuly"
      index={content.index}
      label={content.eyebrow}
      title={content.title}
      lead={content.lead}
      action={<Cta href={content.href}>{content.linkLabel}</Cta>}
    >
      <div className="grid gap-gap [grid-template-columns:repeat(auto-fit,minmax(248px,1fr))]">
        {articles.map((article, i) => (
          <ArticleCard key={article.id} article={article} delay={i * 70} />
        ))}
      </div>
    </Section>
  );
}
