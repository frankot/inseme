/**
 * Structured data for search engines. A plain <script>, not next/script — it is
 * data, not code. `<` is escaped so text from the CMS (a bio, an FAQ answer)
 * can never close the tag and inject markup.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", ...data }).replace(
          /</g,
          "\\u003c",
        ),
      }}
    />
  );
}
