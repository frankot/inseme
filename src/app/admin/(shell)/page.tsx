import { count, desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";

import { auth } from "@/auth";
import { StatusBadge } from "@/components/admin/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { articles, faqItems, media, pages, teamMembers } from "@/db/schema";
import { adminNav } from "@/lib/admin-nav";

export const metadata: Metadata = {
  title: "Pulpit — panel Insieme",
};

/** [total, published] for one content table. */
async function countsFor(table: typeof pages | typeof articles | typeof teamMembers | typeof faqItems) {
  const [[total], [published]] = await Promise.all([
    db.select({ value: count() }).from(table),
    db.select({ value: count() }).from(table).where(eq(table.status, "published")),
  ]);
  return { total: total.value, published: published.value };
}

export default async function AdminDashboardPage() {
  const session = await auth();

  const [pageCounts, articleCounts, teamCounts, faqCounts, [mediaCount], recent] =
    await Promise.all([
      countsFor(pages),
      countsFor(articles),
      countsFor(teamMembers),
      countsFor(faqItems),
      db.select({ value: count() }).from(media),
      db
        .select({
          id: pages.id,
          title: pages.title,
          status: pages.status,
          updatedAt: pages.updatedAt,
        })
        .from(pages)
        .orderBy(desc(pages.updatedAt))
        .limit(5),
    ]);

  const tiles = [
    { href: "/admin/pages", label: "Strony", ...pageCounts },
    { href: "/admin/articles", label: "Artykuły", ...articleCounts },
    { href: "/admin/team", label: "Zespół", ...teamCounts },
    { href: "/admin/faq", label: "FAQ", ...faqCounts },
  ];

  const upcoming = adminNav.filter((item) => !item.available);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pulpit</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Zalogowano jako {session?.user?.email}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          <CardTitle>Ostatnio edytowane strony</CardTitle>
          <CardDescription>
            W bibliotece mediów: {mediaCount.value}{" "}
            {mediaCount.value === 1 ? "plik" : "plików"}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nie utworzono jeszcze żadnej strony.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {recent.map((row) => (
                <li key={row.id} className="flex items-center justify-between gap-3 text-sm">
                  <Link
                    href={`/admin/pages/${row.id}`}
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

      <Card>
        <CardHeader>
          <CardTitle>W kolejnych fazach</CardTitle>
          <CardDescription>Moduły, które nie są jeszcze dostępne w panelu.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            {upcoming.map((item) => (
              <li
                key={item.href}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
              >
                <span className="text-muted-foreground">{item.label}</span>
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
                  {item.phase}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
