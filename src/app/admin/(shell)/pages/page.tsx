import { asc } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";

import { deletePage, publishPage, unpublishPage } from "@/app/admin/(shell)/pages/actions";
import { PageHeader } from "@/components/admin/page-header";
import { RowActions } from "@/components/admin/row-actions";
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
import { pages } from "@/db/schema";

export const metadata: Metadata = { title: "Strony — panel Insieme" };

export default async function PagesListPage() {
  const rows = await db.select().from(pages).orderBy(asc(pages.pageType), asc(pages.title));

  return (
    <>
      <PageHeader
        title="Strony"
        description="Strony serwisu i strony usług — ten sam edytor sekcji, rozróżnia je typ strony."
        actions={<Button render={<Link href="/admin/pages/new" />}>Dodaj stronę</Button>}
      />

      {rows.length === 0 ? (
        <p className="rounded-md border border-dashed px-4 py-12 text-center text-sm text-muted-foreground">
          Brak stron.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tytuł</TableHead>
              <TableHead className="w-56">Adres</TableHead>
              <TableHead className="w-32">Typ</TableHead>
              <TableHead className="w-28">Sekcje</TableHead>
              <TableHead className="w-36">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Link
                    href={`/admin/pages/${row.id}`}
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {row.title}
                  </Link>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  /{row.slug}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {row.pageType === "service" ? "Usługa" : "Zwykła"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{row.sections.length}</TableCell>
                <TableCell>
                  <RowActions
                    label={row.title}
                    editHref={`/admin/pages/${row.id}`}
                    status={row.status}
                    onPublish={publishPage.bind(null, row.id)}
                    onUnpublish={unpublishPage.bind(null, row.id)}
                    onDelete={deletePage.bind(null, row.id)}
                    deleteTitle="Usunąć stronę?"
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
