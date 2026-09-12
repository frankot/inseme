import { asc } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";

import { deleteFaqItem, publishFaqItem, unpublishFaqItem } from "@/app/admin/(shell)/faq/actions";
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
import { faqItems } from "@/db/schema";

export const metadata: Metadata = { title: "FAQ — panel Insieme" };

export default async function FaqListPage() {
  const rows = await db
    .select()
    .from(faqItems)
    .orderBy(asc(faqItems.category), asc(faqItems.sortOrder));

  return (
    <>
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
              <TableHead className="w-36">Status</TableHead>
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
                  <RowActions
                    label={row.question}
                    editHref={`/admin/faq/${row.id}`}
                    status={row.status}
                    onPublish={publishFaqItem.bind(null, row.id)}
                    onUnpublish={unpublishFaqItem.bind(null, row.id)}
                    onDelete={deleteFaqItem.bind(null, row.id)}
                    deleteTitle="Usunąć pytanie?"
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
