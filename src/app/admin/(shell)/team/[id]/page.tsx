import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  deleteTeamMember,
  publishTeamMember,
  unpublishTeamMember,
} from "@/app/admin/(shell)/team/actions";
import { TeamForm } from "@/app/admin/(shell)/team/team-form";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { PageHeader } from "@/components/admin/page-header";
import { PublishControls } from "@/components/admin/publish-controls";
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
    <div className="mx-auto max-w-3xl">
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

      <div className="mb-6 rounded-lg border px-4 py-3">
        <PublishControls
          status={row.status}
          publishedAt={row.publishedAt?.toISOString() ?? null}
          onPublish={publishTeamMember.bind(null, row.id)}
          onUnpublish={unpublishTeamMember.bind(null, row.id)}
        />
      </div>

      <TeamForm
        id={row.id}
        defaultPhoto={photo ? toMediaSummary(photo) : null}
        defaultValues={{
          name: row.name,
          role: row.role ?? "",
          qualifications: row.qualifications ?? "",
          shortBio: row.shortBio ?? "",
          longBio: row.longBio ?? "",
          photoId: row.photoId,
          sortOrder: row.sortOrder,
        }}
      />
    </div>
  );
}
