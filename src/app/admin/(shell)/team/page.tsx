import { asc } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";

import {
  deleteTeamMember,
  publishTeamMember,
  unpublishTeamMember,
} from "@/app/admin/(shell)/team/actions";
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
import { teamMembers } from "@/db/schema";

export const metadata: Metadata = { title: "Zespół — panel Insieme" };

export default async function TeamListPage() {
  const rows = await db
    .select()
    .from(teamMembers)
    .orderBy(asc(teamMembers.sortOrder), asc(teamMembers.name));

  return (
    <>
      <PageHeader
        title="Zespół"
        description="Terapeuci i personel ośrodka. Kolejność ustala pole „Kolejność” — pierwsze trzy osoby trafiają też na stronę główną."
        actions={
          <Button render={<Link href="/admin/team/new" />}>Dodaj osobę</Button>
        }
      />

      {rows.length === 0 ? (
        <p className="rounded-md border border-dashed px-4 py-12 text-center text-sm text-muted-foreground">
          Nie dodano jeszcze nikogo.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imię i nazwisko</TableHead>
              <TableHead>Rola</TableHead>
              <TableHead>Adres</TableHead>
              <TableHead className="w-24">Kolejność</TableHead>
              <TableHead className="w-36">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Link href={`/admin/team/${row.id}`} className="font-medium underline-offset-4 hover:underline">
                    {row.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{row.role ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {row.status === "published" ? (
                    <a
                      href={`/zespol/${row.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline-offset-4 hover:underline"
                    >
                      /zespol/{row.slug}
                    </a>
                  ) : (
                    <span>/zespol/{row.slug}</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{row.sortOrder}</TableCell>
                <TableCell>
                  <RowActions
                    label={row.name}
                    editHref={`/admin/team/${row.id}`}
                    status={row.status}
                    publicHref={`/zespol/${row.slug}`}
                    onPublish={publishTeamMember.bind(null, row.id)}
                    onUnpublish={unpublishTeamMember.bind(null, row.id)}
                    onDelete={deleteTeamMember.bind(null, row.id)}
                    deleteTitle="Usunąć osobę?"
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
