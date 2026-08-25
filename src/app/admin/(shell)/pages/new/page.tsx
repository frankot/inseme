import { desc } from "drizzle-orm";
import type { Metadata } from "next";

import { PageForm } from "@/app/admin/(shell)/pages/page-form";
import { PageHeader } from "@/components/admin/page-header";
import { db } from "@/db";
import { media } from "@/db/schema";
import { toMediaSummary } from "@/lib/media-summary";

export const metadata: Metadata = { title: "Nowa strona — panel Insieme" };

export default async function NewPagePage() {
  const mediaRows = await db.select().from(media).orderBy(desc(media.uploadedAt));

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Nowa strona"
        backHref="/admin/pages"
        description="Po zapisaniu strona pozostaje szkicem — publikacja to osobny krok."
      />
      <PageForm
        id={null}
        defaultOgImage={null}
        mediaLibrary={mediaRows.map(toMediaSummary)}
        defaultValues={{
          title: "",
          slug: "",
          pageType: "standard",
          heroTitle: "",
          heroSubtitle: "",
          sections: [],
          ogImageId: null,
          metaTitle: "",
          metaDescription: "",
        }}
      />
    </div>
  );
}
