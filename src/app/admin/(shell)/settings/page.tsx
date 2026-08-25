import type { Metadata } from "next";
import { eq } from "drizzle-orm";

import { SettingsForm } from "@/app/admin/(shell)/settings/settings-form";
import { PageHeader } from "@/components/admin/page-header";
import { db } from "@/db";
import { media, settings, SETTINGS_ID } from "@/db/schema";
import { toMediaSummary } from "@/lib/media-summary";

export const metadata: Metadata = { title: "Ustawienia — panel Insieme" };

export default async function SettingsPage() {
  const row = await db.query.settings.findFirst({ where: eq(settings.id, SETTINGS_ID) });
  const ogImage = row?.defaultOgImageId
    ? await db.query.media.findFirst({ where: eq(media.id, row.defaultOgImageId) })
    : null;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Ustawienia"
        description="Dane kontaktowe i teksty używane w całym serwisie."
      />
      <SettingsForm
        defaultOgImage={ogImage ? toMediaSummary(ogImage) : null}
        defaultValues={{
          phone: row?.phone ?? "",
          secondaryPhone: row?.secondaryPhone ?? "",
          email: row?.email ?? "",
          address: row?.address ?? "",
          hours: row?.hours ?? "",
          whatsapp: row?.whatsapp ?? "",
          socialLinks: {
            facebook: row?.socialLinks?.facebook ?? "",
            instagram: row?.socialLinks?.instagram ?? "",
            youtube: row?.socialLinks?.youtube ?? "",
            linkedin: row?.socialLinks?.linkedin ?? "",
          },
          privacyNote: row?.privacyNote ?? "",
          consentBannerText: row?.consentBannerText ?? "",
          defaultOgImageId: row?.defaultOgImageId ?? null,
        }}
      />
    </div>
  );
}
