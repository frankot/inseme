import { asc } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
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
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Zespół"
        description="Terapeuci i personel ośrodka. Kolejność ustala pole „Kolejność”."
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
              <TableHead className="w-24">Kolejność</TableHead>
              <TableHead className="w-32">Status</TableHead>
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
                <TableCell className="text-muted-foreground">{row.sortOrder}</TableCell>
                <TableCell>
                  <StatusBadge status={row.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
