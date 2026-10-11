import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteScreeningTest } from "@/app/admin/(shell)/tests/actions";
import { TestEditor } from "@/app/admin/(shell)/tests/test-editor";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { screeningTests } from "@/db/schema";

export const metadata: Metadata = { title: "Edycja testu — panel Insieme" };

export default async function EditTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const row = await db.query.screeningTests.findFirst({
    where: eq(screeningTests.id, id),
    with: {
      questions: {
        orderBy: (q, { asc }) => [asc(q.sortOrder)],
        with: { options: { orderBy: (o, { asc }) => [asc(o.sortOrder)] } },
      },
      resultBands: { orderBy: (b, { asc }) => [asc(b.minScore)] },
    },
  });
  if (!row) notFound();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={row.title}
        backHref="/admin/tests"
        actions={
          <div className="flex gap-2">
            {row.status === "published" && (
              <Button variant="outline" render={<Link href={`/testy/${row.slug}`} target="_blank" />}>
                Podgląd
              </Button>
            )}
            <Button variant="outline" render={<Link href={`/admin/tests/${row.id}/submissions`} />}>
              Zgłoszenia
            </Button>
            <ConfirmDelete
              onConfirm={deleteScreeningTest.bind(null, row.id)}
              title="Usunąć test?"
              redirectTo="/admin/tests"
            />
          </div>
        }
      />

      <TestEditor
        id={row.id}
        status={row.status}
        publishedAt={row.publishedAt?.toISOString() ?? null}
        defaultValues={{
          title: row.title,
          slug: row.slug,
          description: row.description ?? "",
          introText: row.introText ?? "",
          disclaimerText: row.disclaimerText ?? "",
          metaTitle: row.metaTitle ?? "",
          metaDescription: row.metaDescription ?? "",
          sortOrder: row.sortOrder,
          questions: row.questions.map((question) => ({
            text: question.text,
            options: question.options.map((option) => ({ label: option.label, points: option.points })),
          })),
          bands: row.resultBands.map((band) => ({
            bandId: band.id,
            minScore: band.minScore,
            maxScore: band.maxScore,
            resultTitle: band.resultTitle,
            resultBody: band.resultBody,
          })),
        }}
      />
    </div>
  );
}
