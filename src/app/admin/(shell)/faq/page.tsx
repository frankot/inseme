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
import { faqItems } from "@/db/schema";

export const metadata: Metadata = { title: "FAQ — panel Insieme" };

export default async function FaqListPage() {
  const rows = await db
    .select()
    .from(faqItems)
    .orderBy(asc(faqItems.category), asc(faqItems.sortOrder));

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="FAQ"
        description="Najczęstsze pytania. Kategorie pozwalają osadzić wybraną grupę pytań na dowolnej stronie."
        actions={<Button render={<Link href="/admin/faq/new" />}>Dodaj pytanie</Button>}
      />

      {rows.length === 0 ? (
        <p className="rounded-md border border-dashed px-4 py-12 text-center text-sm text-muted-foreground">
          Brak pytań.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pytanie</TableHead>
              <TableHead className="w-40">Kategoria</TableHead>
              <TableHead className="w-24">Kolejność</TableHead>
              <TableHead className="w-32">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Link
                    href={`/admin/faq/${row.id}`}
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {row.question}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{row.category ?? "—"}</TableCell>
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
