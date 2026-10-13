import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { deleteTeamMember } from "@/app/admin/(shell)/team/actions";
import { TeamForm } from "@/app/admin/(shell)/team/team-form";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { PageHeader } from "@/components/admin/page-header";
import { db } from "@/db";
import { media, teamMembers } from "@/db/schema";
import { toMediaSummary } from "@/lib/media-summary";
import { teamFormOf } from "@/lib/record-forms";

export const metadata: Metadata = { title: "Edycja osoby — panel Insieme" };

async function findMedia(id: string | null) {
  if (!id) return null;
  const row = await db.query.media.findFirst({ where: eq(media.id, id) });
  return row ? toMediaSummary(row) : null;
}

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await db.query.teamMembers.findFirst({ where: eq(teamMembers.id, id) });
  if (!row) notFound();

  // The form opens on the pending changes when there are any; the live
  // record is what it marks changes against.
  const live = teamFormOf(row);
  const values = row.pendingChanges ?? live;
  const [photo, livePhoto] = await Promise.all([findMedia(values.photoId), findMedia(row.photoId)]);

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
        defaultPhoto={photo}
        defaultValues={values}
        published={row.status === "published" ? live : null}
        publishedPhoto={livePhoto}
        pendingSavedAt={row.pendingChanges ? (row.pendingUpdatedAt?.toISOString() ?? null) : null}
      />
    </>
  );
}
