import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BandEditor } from "@/app/admin/(shell)/tests/band-editor";
import {
  deleteScreeningTest,
  publishScreeningTest,
  unpublishScreeningTest,
} from "@/app/admin/(shell)/tests/actions";
import { QuestionEditor } from "@/app/admin/(shell)/tests/question-editor";
import { TestForm } from "@/app/admin/(shell)/tests/test-form";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { PageHeader } from "@/components/admin/page-header";
import { PublishControls } from "@/components/admin/publish-controls";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { screeningTests } from "@/db/schema";
import { maxScoreOf } from "@/lib/queries/screening";

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

  const maxScore = maxScoreOf(row.questions);

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

      <div className="rounded-lg border px-4 py-3">
        <PublishControls
          status={row.status}
          publishedAt={row.publishedAt?.toISOString() ?? null}
          onPublish={publishScreeningTest.bind(null, row.id)}
          onUnpublish={unpublishScreeningTest.bind(null, row.id)}
        />
      </div>

      <TestForm
        id={row.id}
        defaultValues={{
          title: row.title,
          slug: row.slug,
          description: row.description ?? "",
          introText: row.introText ?? "",
          disclaimerText: row.disclaimerText ?? "",
          metaTitle: row.metaTitle ?? "",
          metaDescription: row.metaDescription ?? "",
          sortOrder: row.sortOrder,
        }}
      />

      <QuestionEditor testId={row.id} questions={row.questions} />
      <BandEditor testId={row.id} bands={row.resultBands} maxScore={maxScore} />
    </div>
  );
}
