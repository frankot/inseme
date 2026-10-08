import type { Metadata } from "next";

import { FaqForm } from "@/app/admin/(shell)/faq/faq-form";
import { PageHeader } from "@/components/admin/page-header";

export const metadata: Metadata = { title: "Nowe pytanie — panel Insieme" };

export default async function NewFaqItemPage() {
  return (
    <>
      <PageHeader title="Nowe pytanie" backHref="/admin/faq" />
      <FaqForm
        id={null}
        status={null}
        publishedAt={null}
        defaultValues={{ question: "", answer: "", category: "ogolne", sortOrder: 0 }}
      />
    </>
  );
}
