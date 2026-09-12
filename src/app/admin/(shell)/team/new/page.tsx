import type { Metadata } from "next";

import { TeamForm } from "@/app/admin/(shell)/team/team-form";
import { PageHeader } from "@/components/admin/page-header";

export const metadata: Metadata = { title: "Nowa osoba — panel Insieme" };

export default function NewTeamMemberPage() {
  return (
    <>
      <PageHeader
        title="Nowa osoba"
        backHref="/admin/team"
        description="Po zapisaniu wpis pozostaje szkicem — publikacja to osobny krok."
      />
      <TeamForm
        id={null}
        defaultPhoto={null}
        defaultValues={{
          name: "",
          slug: "",
          role: "",
          qualifications: "",
          shortBio: "",
          longBio: "",
          photoId: null,
          sortOrder: 0,
        }}
      />
    </>
  );
}
