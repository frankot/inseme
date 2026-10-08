import { asc } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";

import { deleteFaqItem, publishFaqItem, unpublishFaqItem } from "@/app/admin/(shell)/faq/actions";
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
import { faqItems } from "@/db/schema";
import { getFeaturedSlots } from "@/lib/cms/featured";
import { faqCategoryLabel } from "@/lib/faq-categories";

export const metadata: Metadata = { title: "FAQ — panel Insieme" };

export default async function FaqListPage() {
  const [rows, featured] = await Promise.all([
    db.select().from(faqItems).orderBy(asc(faqItems.sortOrder), asc(faqItems.createdAt)),
    getFeaturedSlots("faq"),
  ]);

  return (
    <>
      <PageHeader
        title="FAQ"
        description="Najczęstsze pytania. Wszystkie opublikowane są na /faq. Które trafiają na stronę główną (najwyżej 6), wybierasz w menu wiersza albo w CMS › Strona główna › Pytania. Kategoria tematyczna (Alkohol, Narkotyki, Rodzina, Detoks, NFZ) pokazuje pytanie także na swojej stronie; Ogólne są tylko na /faq."
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
              <TableHead className="w-28">Strona główna</TableHead>
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
                <TableCell className="text-muted-foreground">{isFeatured(featured, row.id) ? "★" : "—"}</TableCell>
                <TableCell className="text-muted-foreground">{faqCategoryLabel(row.category)}</TableCell>
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
