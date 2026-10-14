import { asc, count, isNull } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";

import {
  deleteScreeningTest,
  publishScreeningTest,
  unpublishScreeningTest,
} from "@/app/admin/(shell)/tests/actions";
import { featuredToggles, isFeatured } from "@/components/admin/featured-toggles";
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
import { getFeaturedSlots } from "@/lib/cms/featured";

export const metadata: Metadata = { title: "Testy przesiewowe — panel Insieme" };

export default async function TestsListPage() {
  const featured = await getFeaturedSlots("test");
  // Counted in grouped queries rather than correlated subqueries: in a
  // single-table select drizzle renders `${table.column}` without its table
  // name, so `test_id = id` resolved both sides to the inner table and every
  // count came out 0.
  const [tests, questionCounts, submissionCounts] = await Promise.all([
    db
      .select({
        id: screeningTests.id,
        slug: screeningTests.slug,
        title: screeningTests.title,
        status: screeningTests.status,
      })
      .from(screeningTests)
      .orderBy(asc(screeningTests.sortOrder), asc(screeningTests.title)),
    db
      .select({ testId: screeningTestQuestions.testId, value: count() })
      .from(screeningTestQuestions)
      .groupBy(screeningTestQuestions.testId),
    db
      .select({ testId: screeningTestSubmissions.testId, value: count() })
      .from(screeningTestSubmissions)
      .where(isNull(screeningTestSubmissions.deletedAt))
      .groupBy(screeningTestSubmissions.testId),
  ]);

  const questionsBy = new Map(questionCounts.map((row) => [row.testId, row.value]));
  const submissionsBy = new Map(submissionCounts.map((row) => [row.testId, row.value]));
  const rows = tests.map((test) => ({
    ...test,
    questions: questionsBy.get(test.id) ?? 0,
    submissions: submissionsBy.get(test.id) ?? 0,
  }));

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
                  </Link> {isFeatured(featured, row.id) && (
                    <span className="ml-2 text-xs text-amber-700" title="Na stronie głównej">★</span>
                  )}
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
                    featured={featuredToggles(featured, row.id)}
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
