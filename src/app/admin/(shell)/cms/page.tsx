import { inArray } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";

import { publishedLabelFor } from "@/app/admin/(shell)/cms/editor-data";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cmsPageList } from "@/cms/registry";
import { db } from "@/db";
import { adminUsers, cmsPages } from "@/db/schema";

export const metadata: Metadata = { title: "CMS — panel Insieme" };

export const dynamic = "force-dynamic";

/** A card per CMS page with its publish state (plans/CMS_PLAN.md §4.2). */
export default async function CmsIndexPage() {
  const rows = await db.select().from(cmsPages);
  const userIds = rows.flatMap((row) => (row.publishedBy ? [row.publishedBy] : []));
  const users = userIds.length
    ? await db
        .select({ id: adminUsers.id, name: adminUsers.name, email: adminUsers.email })
        .from(adminUsers)
        .where(inArray(adminUsers.id, userIds))
    : [];
  const userName = (id: string | null) => {
    const user = users.find((u) => u.id === id);
    return user ? (user.name ?? user.email) : null;
  };

  return (
    <>
      <PageHeader
        title="CMS"
        description="Treść stron serwisu. Zmiany zapisują się w szkicu automatycznie; na stronie pojawiają się po kliknięciu „Opublikuj”."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {cmsPageList.map((page) => {
          const row = rows.find((r) => r.key === page.key);
          return (
            <Card key={page.key}>
              <CardHeader>
                <CardTitle>{page.label}</CardTitle>
                <a
                  href={page.route}
                  target="_blank"
                  rel="noopener"
                  className="font-mono text-xs text-muted-foreground hover:underline"
                >
                  {page.route}
                </a>
              </CardHeader>
              <CardContent className="flex flex-col items-start gap-3">
                <p className="text-sm text-muted-foreground">
                  {publishedLabelFor(row?.publishedAt ?? null, userName(row?.publishedBy ?? null))}
                </p>
                {row?.draft && (
                  <p className="text-sm font-medium text-amber-700">Szkic ma nieopublikowane zmiany</p>
                )}
                <Button size="sm" render={<Link href={`/admin/cms/${page.adminSlug}`} />}>
                  Edytuj
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
