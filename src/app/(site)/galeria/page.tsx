import type { Metadata } from "next";

import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { Container } from "@/components/site/ui/container";
import { GalleryGrid } from "@/components/site/ui/gallery-grid";
import { Pagination } from "@/components/site/ui/pagination";
import { galeriaPageDefaults as copy } from "@/content/galeria";
import { getGalleryPage, parsePageParam } from "@/lib/queries/gallery";

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
};

/**
 * Reading `?page=` makes this route dynamic — search params only exist on a
 * live request. The queries behind it are still cached on the same five-minute
 * window as the rest of the site (see `getGalleryPage`), and the admin actions
 * bust that cache on every change, so paging costs a DB round trip once per
 * page per window rather than once per visitor.
 */
export default async function GaleriaPage(props: PageProps<"/galeria">) {
  const params = await props.searchParams;
  const { photos, page, pageCount, total } = await getGalleryPage(parsePageParam(params.page));

  return (
    <SubpageLayout
      eyebrow={copy.eyebrow}
      title={copy.title}
      lead={copy.lead}
      breadcrumb={[{ label: copy.breadcrumbHome, href: "/" }, { label: copy.breadcrumbLabel }]}
    >
      <Container className="pb-section-lg">
        {total === 0 ? (
          <p className="max-w-[34em] border-t border-line pt-[clamp(24px,3vw,40px)] text-body-lg text-ink-300">
            {copy.emptyNote}
          </p>
        ) : (
          <>
            <GalleryGrid photos={photos} />
            <Pagination
              page={page}
              pageCount={pageCount}
              // Page 1 is the bare URL, so the canonical entry point has no
              // query string to duplicate it.
              hrefFor={(target) => (target === 1 ? "/galeria" : `/galeria?page=${target}`)}
              labels={copy.pagination}
              className="mt-section-sm"
            />
          </>
        )}
      </Container>
    </SubpageLayout>
  );
}
