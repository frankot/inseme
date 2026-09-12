import { desc, isNull } from "drizzle-orm";
import type { Metadata } from "next";

import { deleteContactSubmission } from "@/app/admin/(shell)/contact/actions";
import { StatusToggle } from "@/app/admin/(shell)/contact/status-toggle";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { db } from "@/db";
import { contactSubmissions } from "@/db/schema";
import { env } from "@/lib/env";

export const metadata: Metadata = { title: "Wiadomości — panel Insieme" };

export default async function ContactInboxPage() {
  const rows = await db
    .select()
    .from(contactSubmissions)
    .where(isNull(contactSubmissions.deletedAt))
    .orderBy(desc(contactSubmissions.createdAt))
    .limit(200);

  const unhandled = rows.filter((row) => row.status === "new").length;

  return (
    <>
      <PageHeader
        title="Wiadomości"
        description={`${unhandled} nowych. Dane starsze niż ${env.DATA_RETENTION_MONTHS} miesięcy usuwa automat.`}
      />

      {rows.length === 0 ? (
        <p className="rounded-md border border-dashed px-4 py-12 text-center text-sm text-muted-foreground">
          Skrzynka jest pusta.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {rows.map((row) => (
            <li
              key={row.id}
              className="rounded-lg border p-4 data-[new=true]:border-ring"
              data-new={row.status === "new"}
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="font-medium">{row.name?.trim() || "Bez imienia"}</span>
                <Badge variant={row.status === "new" ? "default" : "secondary"}>
                  {row.status === "new" ? "nowa" : "załatwione"}
                </Badge>
                <span className="ml-auto text-xs text-muted-foreground">
                  {row.createdAt.toLocaleString("pl-PL", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
              </div>

              <dl className="mb-3 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
                <dt className="text-muted-foreground">Telefon</dt>
                <dd>
                  {row.phone ? (
                    <a href={`tel:${row.phone}`} className="underline-offset-4 hover:underline">
                      {row.phone}
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
                <dt className="text-muted-foreground">E-mail</dt>
                <dd>
                  {row.email ? (
                    <a href={`mailto:${row.email}`} className="underline-offset-4 hover:underline">
                      {row.email}
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
                <dt className="text-muted-foreground">Woli kontakt</dt>
                <dd>{row.preferredContactMethod === "phone" ? "telefonicznie" : "e-mailem"}</dd>
              </dl>

              <p className="mb-4 whitespace-pre-wrap rounded-md bg-muted px-3 py-2 text-sm">
                {row.message}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <StatusToggle id={row.id} status={row.status} />
                <div className="ml-auto">
                  <ConfirmDelete
                    onConfirm={deleteContactSubmission.bind(null, row.id)}
                    title="Usunąć wiadomość?"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
