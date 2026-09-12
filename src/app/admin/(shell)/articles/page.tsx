import { desc } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";

import {
  deleteArticle,
  publishArticle,
  unpublishArticle,
} from "@/app/admin/(shell)/articles/actions";
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
import { articles } from "@/db/schema";

export const metadata: Metadata = { title: "Artykuły — panel Insieme" };

export default async function ArticlesListPage() {
  const rows = await db.select().from(articles).orderBy(desc(articles.updatedAt));

  return (
    <>
      <PageHeader
        title="Artykuły"
        description="Poradnik. Każdy artykuł wymaga wskazania osoby weryfikującej przed publikacją."
        actions={<Button render={<Link href="/admin/articles/new" />}>Dodaj artykuł</Button>}
      />

      {rows.length === 0 ? (
        <p className="rounded-md border border-dashed px-4 py-12 text-center text-sm text-muted-foreground">
          Brak artykułów.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tytuł</TableHead>
              <TableHead className="w-48">Weryfikacja</TableHead>
              <TableHead className="w-40">Aktualizacja</TableHead>
              <TableHead className="w-36">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Link
                    href={`/admin/articles/${row.id}`}
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {row.title}
                  </Link>
                  <p className="font-mono text-xs text-muted-foreground">/{row.slug}</p>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {row.authorReviewer ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {row.updatedAt.toLocaleDateString("pl-PL")}
                </TableCell>
                <TableCell>
                  <RowActions
                    label={row.title}
                    editHref={`/admin/articles/${row.id}`}
                    status={row.status}
                    onPublish={publishArticle.bind(null, row.id)}
                    onUnpublish={unpublishArticle.bind(null, row.id)}
                    onDelete={deleteArticle.bind(null, row.id)}
                    deleteTitle="Usunąć artykuł?"
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
