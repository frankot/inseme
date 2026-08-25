import type { Metadata } from "next";

import { FaqForm } from "@/app/admin/(shell)/faq/faq-form";
import { PageHeader } from "@/components/admin/page-header";
import { getFaqCategories } from "@/app/admin/(shell)/faq/queries";

export const metadata: Metadata = { title: "Nowe pytanie — panel Insieme" };

export default async function NewFaqItemPage() {
  const categories = await getFaqCategories();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Nowe pytanie" backHref="/admin/faq" />
      <FaqForm
        id={null}
        categories={categories}
        defaultValues={{ question: "", answer: "", category: "", sortOrder: 0 }}
      />
    </div>
  );
}
