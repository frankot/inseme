import { count, desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";

import { auth } from "@/auth";
import { StatusBadge } from "@/components/admin/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { articles, faqItems, media, teamMembers } from "@/db/schema";
import { getLeadStats, getNewContactCount } from "@/lib/queries/leads";

export const metadata: Metadata = {
  title: "Pulpit — panel Insieme",
};

/** [total, published] for one content table. */
async function countsFor(table: typeof articles | typeof teamMembers | typeof faqItems) {
  const [[total], [published]] = await Promise.all([
    db.select({ value: count() }).from(table),
    db.select({ value: count() }).from(table).where(eq(table.status, "published")),
  ]);
  return { total: total.value, published: published.value };
}

export default async function AdminDashboardPage() {
  const session = await auth();

  const [
    articleCounts,
    teamCounts,
    faqCounts,
    [mediaCount],
    recent,
    newMessages,
    leadStats,
  ] = await Promise.all([
      countsFor(articles),
      countsFor(teamMembers),
      countsFor(faqItems),
      db.select({ value: count() }).from(media),
      db
        .select({
          id: articles.id,
          title: articles.title,
          status: articles.status,
          updatedAt: articles.updatedAt,
        })
        .from(articles)
        .orderBy(desc(articles.updatedAt))
        .limit(5),
      getNewContactCount(),
      getLeadStats(),
    ]);

  const tiles = [
    { href: "/admin/articles", label: "Artykuły", ...articleCounts },
    { href: "/admin/team", label: "Zespół", ...teamCounts },
    { href: "/admin/faq", label: "FAQ", ...faqCounts },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pulpit</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Zalogowano jako {session?.user?.email}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/contact"
          className="rounded-lg border p-4 transition-colors hover:border-ring data-[waiting=true]:border-ring"
          data-waiting={newMessages > 0}
        >
          <p className="text-sm text-muted-foreground">Nowe wiadomości</p>
          <p className="mt-1 text-2xl font-semibold">{newMessages}</p>
          <p className="text-xs text-muted-foreground">
            {newMessages === 0 ? "Skrzynka pusta." : "Czekają na odpowiedź."}
          </p>
        </Link>
        <Link
          href="/admin/leads"
          className="rounded-lg border p-4 transition-colors hover:border-ring"
        >
          <p className="text-sm text-muted-foreground">Zebrane adresy</p>
          <p className="mt-1 text-2xl font-semibold">{leadStats.unique}</p>
          <p className="text-xs text-muted-foreground">
            {leadStats.signups} z zapisu, {leadStats.tests} z testów
          </p>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {tiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="rounded-lg border p-4 transition-colors hover:border-ring"
          >
            <p className="text-sm text-muted-foreground">{tile.label}</p>
            <p className="mt-1 text-2xl font-semibold">{tile.total}</p>
            <p className="text-xs text-muted-foreground">
              {tile.published} opublikowanych, {tile.total - tile.published} szkiców
            </p>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ostatnio edytowane artykuły</CardTitle>
          <CardDescription>
            W bibliotece mediów: {mediaCount.value}{" "}
            {mediaCount.value === 1 ? "plik" : "plików"}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nie utworzono jeszcze żadnego artykułu.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {recent.map((row) => (
                <li key={row.id} className="flex items-center justify-between gap-3 text-sm">
                  <Link
                    href={`/admin/articles/${row.id}`}
                    className="truncate underline-offset-4 hover:underline"
                  >
                    {row.title}
                  </Link>
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {row.updatedAt.toLocaleDateString("pl-PL")}
                    </span>
                    <StatusBadge status={row.status} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
