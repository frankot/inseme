import type { Metadata } from "next";

import { TestForm } from "@/app/admin/(shell)/tests/test-form";
import { PageHeader } from "@/components/admin/page-header";

export const metadata: Metadata = { title: "Nowy test — panel Insieme" };

export default function NewTestPage() {
  return (
    <>
      <PageHeader
        title="Nowy test"
        backHref="/admin/tests"
        description="Najpierw zapisz test, potem dodaj pytania i przedziały wyniku."
      />
      <TestForm
        id={null}
        defaultValues={{
          title: "",
          slug: "",
          description: "",
          introText: "",
          disclaimerText:
            "Test ma charakter orientacyjny i nie jest diagnozą. Nie zastępuje rozmowy z terapeutą ani badania lekarskiego.",
          metaTitle: "",
          metaDescription: "",
          sortOrder: 0,
        }}
      />
    </>
  );
}
