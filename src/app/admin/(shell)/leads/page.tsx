import type { Metadata } from "next";
import Link from "next/link";

import { deleteLeadSignup } from "@/app/admin/(shell)/leads/actions";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { PageHeader } from "@/components/admin/page-header";
import { INBOX_TABS, SectionTabs } from "@/components/admin/section-tabs";
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
import { env } from "@/lib/env";
import { getLeadRows, getLeadStats, getNewContactCount } from "@/lib/queries/leads";

export const metadata: Metadata = { title: "Adresy e-mail — panel Insieme" };

export default async function LeadsPage() {
  const [stats, rows, newMessages] = await Promise.all([
    getLeadStats(),
    getLeadRows(),
    getNewContactCount(),
  ]);

  return (
    <>
      <SectionTabs tabs={INBOX_TABS(newMessages)} current="/admin/leads" />
      <PageHeader
        title="Adresy e-mail"
        description={`Każdy adres zostawiony na stronie: zapisy, prośby o wynik testu i formularz kontaktowy. Adres z formularza dostaliśmy po to, żeby odpowiedzieć — nie do wysyłki ofert. Dane starsze niż ${env.DATA_RETENTION_MONTHS} miesięcy usuwa automat.`}
        actions={
          rows.length > 0 ? (
            <Button render={<Link href="/admin/leads/export" prefetch={false} />}>
              Pobierz .xlsx
            </Button>
          ) : undefined
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Unikalnych adresów", value: stats.unique },
          { label: "Zapisów ze strony", value: stats.signups },
          { label: "Z testów", value: stats.tests },
          { label: "Z formularza kontaktowego", value: stats.messages },
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
              <TableHead className="w-44">Źródło</TableHead>
              <TableHead className="w-64">Szczegóły</TableHead>
              <TableHead className="w-36">Data</TableHead>
              <TableHead className="w-28" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={`${row.kind}-${row.id}`}>
                <TableCell className="font-medium">{row.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{row.source}</Badge>
                </TableCell>
                {/* Fixed width: long test titles are cut, the full text is on hover. */}
                <TableCell className="max-w-64 truncate text-muted-foreground" title={row.detail ?? undefined}>
                  {row.detail ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {row.createdAt.toLocaleString("pl-PL", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  {/* Each address is deleted where it lives, so the lists never disagree. */}
                  {row.kind === "signup" ? (
                    <ConfirmDelete
                      onConfirm={deleteLeadSignup.bind(null, row.id)}
                      title="Usunąć adres?"
                    />
                  ) : row.kind === "contact" ? (
                    <Link
                      href="/admin/contact"
                      className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                    >
                      w wiadomościach
                    </Link>
                  ) : (
                    <span className="text-xs text-muted-foreground">w teście</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
