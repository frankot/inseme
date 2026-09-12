import { and, desc, eq, isNull } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { deleteSubmission } from "@/app/admin/(shell)/tests/actions";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { screeningTestSubmissions, screeningTests } from "@/db/schema";
import { env } from "@/lib/env";

export const metadata: Metadata = { title: "Zgłoszenia testu — panel Insieme" };

export default async function SubmissionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const test = await db.query.screeningTests.findFirst({
    where: eq(screeningTests.id, id),
    columns: { id: true, title: true },
  });
  if (!test) notFound();

  const rows = await db.query.screeningTestSubmissions.findMany({
    where: and(
      eq(screeningTestSubmissions.testId, id),
      isNull(screeningTestSubmissions.deletedAt),
    ),
    orderBy: [desc(screeningTestSubmissions.createdAt)],
    with: { resultBand: { columns: { resultTitle: true } } },
    limit: 200,
  });

  return (
    <>
      <PageHeader
        title={`Zgłoszenia — ${test.title}`}
        backHref={`/admin/tests/${test.id}`}
        description={`Zapisujemy wyłącznie wynik i adres e-mail — pojedyncze odpowiedzi nie są przechowywane. Dane starsze niż ${env.DATA_RETENTION_MONTHS} miesięcy usuwa automat.`}
      />

      {rows.length === 0 ? (
        <p className="rounded-md border border-dashed px-4 py-12 text-center text-sm text-muted-foreground">
          Nikt jeszcze nie poprosił o wynik tego testu.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>E-mail</TableHead>
              <TableHead className="w-24">Wynik</TableHead>
              <TableHead>Przedział</TableHead>
              <TableHead className="w-36">Data</TableHead>
              <TableHead className="w-28">Wysyłka</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.email}</TableCell>
                <TableCell className="tabular-nums text-muted-foreground">
                  {row.totalScore}/{row.maxScore}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {row.resultBand?.resultTitle ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {row.createdAt.toLocaleString("pl-PL", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </TableCell>
                <TableCell>
                  {row.emailedAt ? (
                    <Badge variant="secondary">wysłano</Badge>
                  ) : (
                    <Badge variant="outline">nie wysłano</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <ConfirmDelete
                    onConfirm={deleteSubmission.bind(null, row.id, test.id)}
                    title="Usunąć zgłoszenie?"
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
