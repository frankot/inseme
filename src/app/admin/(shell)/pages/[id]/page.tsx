import { desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { deletePage, publishPage, unpublishPage } from "@/app/admin/(shell)/pages/actions";
import { PageForm } from "@/app/admin/(shell)/pages/page-form";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { PageHeader } from "@/components/admin/page-header";
import { PublishControls } from "@/components/admin/publish-controls";
import { db } from "@/db";
import { media, pages } from "@/db/schema";
import { toMediaSummary } from "@/lib/media-summary";

export const metadata: Metadata = { title: "Edycja strony — panel Insieme" };

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await db.query.pages.findFirst({ where: eq(pages.id, id) });
  if (!row) notFound();

  const mediaRows = await db.select().from(media).orderBy(desc(media.uploadedAt));
  const ogImage = mediaRows.find((item) => item.id === row.ogImageId) ?? null;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title={row.title}
        description={`/${row.slug}`}
        backHref="/admin/pages"
        actions={
          <ConfirmDelete
            onConfirm={deletePage.bind(null, row.id)}
            title="Usunąć stronę?"
            redirectTo="/admin/pages"
          />
        }
      />

      <div className="mb-6 rounded-lg border px-4 py-3">
        <PublishControls
          status={row.status}
          publishedAt={row.publishedAt?.toISOString() ?? null}
          onPublish={publishPage.bind(null, row.id)}
          onUnpublish={unpublishPage.bind(null, row.id)}
        />
      </div>

      <PageForm
        id={row.id}
        defaultOgImage={ogImage ? toMediaSummary(ogImage) : null}
        mediaLibrary={mediaRows.map(toMediaSummary)}
        defaultValues={{
          title: row.title,
          slug: row.slug,
          pageType: row.pageType,
          heroTitle: row.heroTitle ?? "",
          heroSubtitle: row.heroSubtitle ?? "",
          sections: row.sections,
          ogImageId: row.ogImageId,
          metaTitle: row.metaTitle ?? "",
          metaDescription: row.metaDescription ?? "",
        }}
      />
    </div>
  );
}
