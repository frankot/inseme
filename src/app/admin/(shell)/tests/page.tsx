import { asc, sql } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";

import {
  deleteScreeningTest,
  publishScreeningTest,
  unpublishScreeningTest,
} from "@/app/admin/(shell)/tests/actions";
import { PageHeader } from "@/components/admin/page-header";
import { RowActions } from "@/components/admin/row-actions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import {
  screeningTestQuestions,
  screeningTestSubmissions,
  screeningTests,
} from "@/db/schema";

export const metadata: Metadata = { title: "Testy przesiewowe — panel Insieme" };

export default async function TestsListPage() {
  const rows = await db
    .select({
      id: screeningTests.id,
      slug: screeningTests.slug,
      title: screeningTests.title,
      status: screeningTests.status,
      questions: sql<number>`(
        select count(*) from ${screeningTestQuestions}
        where ${screeningTestQuestions.testId} = ${screeningTests.id}
      )`.mapWith(Number),
      submissions: sql<number>`(
        select count(*) from ${screeningTestSubmissions}
        where ${screeningTestSubmissions.testId} = ${screeningTests.id}
          and ${screeningTestSubmissions.deletedAt} is null
      )`.mapWith(Number),
    })
    .from(screeningTests)
    .orderBy(asc(screeningTests.sortOrder), asc(screeningTests.title));

  return (
    <>
      <PageHeader
        title="Testy przesiewowe"
        description="Pytania, punktacja i przedziały wyniku. Test można opublikować dopiero, gdy ma pytania, odpowiedzi i przedziały."
        actions={<Button render={<Link href="/admin/tests/new" />}>Dodaj test</Button>}
      />

      {rows.length === 0 ? (
        <p className="rounded-md border border-dashed px-4 py-12 text-center text-sm text-muted-foreground">
          Nie utworzono jeszcze żadnego testu.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tytuł</TableHead>
              <TableHead className="w-24">Pytania</TableHead>
              <TableHead className="w-28">Zgłoszenia</TableHead>
              <TableHead className="w-36">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Link
                    href={`/admin/tests/${row.id}`}
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {row.title}
                  </Link>
                  <span className="block text-xs text-muted-foreground">/testy/{row.slug}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">{row.questions}</TableCell>
                <TableCell>
                  {row.submissions > 0 ? (
                    <Link
                      href={`/admin/tests/${row.id}/submissions`}
                      className="underline-offset-4 hover:underline"
                    >
                      {row.submissions}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">0</span>
                  )}
                </TableCell>
                <TableCell>
                  <RowActions
                    label={row.title}
                    editHref={`/admin/tests/${row.id}`}
                    status={row.status}
                    publicHref={`/testy/${row.slug}`}
                    onPublish={publishScreeningTest.bind(null, row.id)}
                    onUnpublish={unpublishScreeningTest.bind(null, row.id)}
                    onDelete={deleteScreeningTest.bind(null, row.id)}
                    deleteTitle="Usunąć test?"
                    deleteDescription="Zniknie razem z pytaniami, przedziałami i zgłoszeniami."
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
