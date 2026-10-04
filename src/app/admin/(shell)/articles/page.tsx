import { desc } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";

import {
  deleteArticle,
  publishArticle,
  unpublishArticle,
} from "@/app/admin/(shell)/articles/actions";
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
import { articles } from "@/db/schema";
import { getFeaturedSlots } from "@/lib/cms/featured";
import { isProtectedArticle } from "@/lib/protected-articles";

export const metadata: Metadata = { title: "Artykuły — panel Insieme" };

export default async function ArticlesListPage() {
  const featured = await getFeaturedSlots("article");
  const rows = await db.query.articles.findMany({
    orderBy: [desc(articles.updatedAt)],
    with: { reviewer: { columns: { name: true } } },
  });

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
            {rows.map((row) => {
              const locked = isProtectedArticle(row.slug);
              return (
                <TableRow key={row.id}>
                  <TableCell>
                    <Link
                      href={`/admin/articles/${row.id}`}
                      className="font-medium underline-offset-4 hover:underline"
                    >
                      {row.title}
                    </Link> {isFeatured(featured, row.id) && (
                      <span className="ml-2 text-xs text-amber-700" title="Na stronie głównej">★</span>
                    )}
                    <p className="font-mono text-xs text-muted-foreground">
                      /{row.slug}
                      {locked && <span className="ml-2 font-sans">· stały artykuł</span>}
                    </p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.reviewer?.name ?? row.authorReviewer ?? "—"}
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
                      onUnpublish={locked ? undefined : unpublishArticle.bind(null, row.id)}
                      onDelete={locked ? undefined : deleteArticle.bind(null, row.id)}
                      deleteTitle="Usunąć artykuł?"
                      featured={featuredToggles(featured, row.id)}
                    />
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
