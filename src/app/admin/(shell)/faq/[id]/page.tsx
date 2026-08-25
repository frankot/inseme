import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  deleteFaqItem,
  publishFaqItem,
  unpublishFaqItem,
} from "@/app/admin/(shell)/faq/actions";
import { FaqForm } from "@/app/admin/(shell)/faq/faq-form";
import { getFaqCategories } from "@/app/admin/(shell)/faq/queries";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { PageHeader } from "@/components/admin/page-header";
import { PublishControls } from "@/components/admin/publish-controls";
import { db } from "@/db";
import { faqItems } from "@/db/schema";

export const metadata: Metadata = { title: "Edycja pytania — panel Insieme" };

export default async function EditFaqItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await db.query.faqItems.findFirst({ where: eq(faqItems.id, id) });
  if (!row) notFound();

  const categories = await getFaqCategories();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Edycja pytania"
        backHref="/admin/faq"
        actions={
          <ConfirmDelete
            onConfirm={deleteFaqItem.bind(null, row.id)}
            title="Usunąć pytanie?"
            redirectTo="/admin/faq"
          />
        }
      />

      <div className="mb-6 rounded-lg border px-4 py-3">
        <PublishControls
          status={row.status}
          publishedAt={row.publishedAt?.toISOString() ?? null}
          onPublish={publishFaqItem.bind(null, row.id)}
          onUnpublish={unpublishFaqItem.bind(null, row.id)}
        />
      </div>

      <FaqForm
        id={row.id}
        categories={categories}
        defaultValues={{
          question: row.question,
          answer: row.answer,
          category: row.category ?? "",
          sortOrder: row.sortOrder,
        }}
      />
    </div>
  );
}
