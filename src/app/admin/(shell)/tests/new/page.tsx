import type { Metadata } from "next";

import { emptyTest } from "@/app/admin/(shell)/tests/defaults";
import { TestEditor } from "@/app/admin/(shell)/tests/test-editor";
import { PageHeader } from "@/components/admin/page-header";

export const metadata: Metadata = { title: "Nowy test — panel Insieme" };

export default function NewTestPage() {
  return (
    <>
      <PageHeader
        title="Nowy test"
        backHref="/admin/tests"
        description="Wpisz podstawy, pytania z odpowiedziami i opisy wyników — wszystko na tej stronie, zapisywane razem."
      />
      <TestEditor id={null} status={null} publishedAt={null} defaultValues={emptyTest()} />
    </>
  );
}
