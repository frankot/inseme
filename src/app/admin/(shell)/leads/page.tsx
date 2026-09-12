import { desc, isNull } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";

import { deleteLeadSignup } from "@/app/admin/(shell)/leads/actions";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
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
import { leadSignups } from "@/db/schema";
import { env } from "@/lib/env";
import { getLeadRows, getLeadStats } from "@/lib/queries/leads";

export const metadata: Metadata = { title: "Adresy — panel Insieme" };

export default async function LeadsPage() {
  const [stats, rows, signups] = await Promise.all([
    getLeadStats(),
    getLeadRows(),
    db
      .select()
      .from(leadSignups)
      .where(isNull(leadSignups.deletedAt))
      .orderBy(desc(leadSignups.createdAt)),
  ]);

  // Only widget signups can be deleted here; a test e-mail is deleted with its
  // submission, on the test's own page, so the two never disagree.
  const deletable = new Map(signups.map((row) => [`${row.email}|${row.createdAt.getTime()}`, row.id]));

  return (
    <>
      <PageHeader
        title="Adresy"
        description={`Zapisy ze strony i prośby o wynik testu w jednym miejscu. Dane starsze niż ${env.DATA_RETENTION_MONTHS} miesięcy usuwa automat.`}
        actions={
          rows.length > 0 ? (
            <Button render={<Link href="/admin/leads/export" prefetch={false} />}>
              Pobierz .xlsx
            </Button>
          ) : undefined
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Unikalnych adresów", value: stats.unique },
          { label: "Zapisów ze strony", value: stats.signups },
          { label: "Z testów", value: stats.tests },
        ].map((tile) => (
          <div key={tile.label} className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">{tile.label}</p>
            <p className="mt-1 text-2xl font-semibold">{tile.value}</p>
          </div>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="rounded-md border border-dashed px-4 py-12 text-center text-sm text-muted-foreground">
          Nikt jeszcze nie zostawił adresu.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>E-mail</TableHead>
              <TableHead className="w-40">Źródło</TableHead>
              <TableHead>Szczegóły</TableHead>
              <TableHead className="w-36">Data</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const id = deletable.get(`${row.email}|${row.createdAt.getTime()}`);
              return (
                <TableRow key={`${row.email}-${row.createdAt.getTime()}`}>
                  <TableCell className="font-medium">{row.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{row.source}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{row.detail ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.createdAt.toLocaleString("pl-PL", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </TableCell>
                  <TableCell>
                    {id ? (
                      <ConfirmDelete
                        onConfirm={deleteLeadSignup.bind(null, id)}
                        title="Usunąć adres?"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">w teście</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </>
  );
}
