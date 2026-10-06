import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  deleteTeamMember,
} from "@/app/admin/(shell)/team/actions";
import { TeamForm } from "@/app/admin/(shell)/team/team-form";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { PageHeader } from "@/components/admin/page-header";
import { db } from "@/db";
import { media, teamMembers } from "@/db/schema";
import { toMediaSummary } from "@/lib/media-summary";

export const metadata: Metadata = { title: "Edycja osoby — panel Insieme" };

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await db.query.teamMembers.findFirst({ where: eq(teamMembers.id, id) });
  if (!row) notFound();

  const photo = row.photoId
    ? await db.query.media.findFirst({ where: eq(media.id, row.photoId) })
    : null;

  return (
    <>
      <PageHeader
        title={row.name}
        backHref="/admin/team"
        actions={
          <ConfirmDelete
            onConfirm={deleteTeamMember.bind(null, row.id)}
            title="Usunąć osobę?"
            redirectTo="/admin/team"
          />
        }
      />

      <TeamForm
        id={row.id}
        status={row.status}
        publishedAt={row.publishedAt?.toISOString() ?? null}
        defaultPhoto={photo ? toMediaSummary(photo) : null}
        defaultValues={{
          name: row.name,
          slug: row.slug,
          role: row.role ?? "",
          qualifications: row.qualifications ?? "",
          licenses: row.licenses,
          shortBio: row.shortBio ?? "",
          longBio: row.longBio ?? "",
          photoId: row.photoId,
          sortOrder: row.sortOrder,
        }}
      />
    </>
  );
}
