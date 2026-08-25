"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { saveSettings } from "@/app/admin/(shell)/settings/actions";
import { Field } from "@/components/admin/field";
import { MediaPicker } from "@/components/admin/media-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { MediaSummary } from "@/lib/media-types";
import { settingsSchema, type SettingsInput } from "@/lib/validations/content";

export function SettingsForm({
  defaultValues,
  defaultOgImage,
}: {
  defaultValues: SettingsInput;
  defaultOgImage: MediaSummary | null;
}) {
  const [ogImage, setOgImage] = useState<MediaSummary | null>(defaultOgImage);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues,
  });

  async function onSubmit(values: SettingsInput) {
    const result = await saveSettings(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Zapisano ustawienia.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <Card>
        <CardHeader>
          <CardTitle>Kontakt</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Telefon" htmlFor="phone" error={errors.phone?.message}>
            <Input id="phone" {...register("phone")} />
          </Field>
          <Field label="Telefon dodatkowy" htmlFor="secondaryPhone" error={errors.secondaryPhone?.message}>
            <Input id="secondaryPhone" {...register("secondaryPhone")} />
          </Field>
          <Field label="E-mail" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" {...register("email")} />
          </Field>
          <Field label="WhatsApp" htmlFor="whatsapp" error={errors.whatsapp?.message}>
            <Input id="whatsapp" {...register("whatsapp")} />
          </Field>
          <Field label="Adres" htmlFor="address" error={errors.address?.message}>
            <Textarea id="address" rows={3} {...register("address")} />
          </Field>
          <Field
            label="Godziny pracy"
            htmlFor="hours"
            error={errors.hours?.message}
            hint="Np. pon.–pt. 8:00–20:00, dyżur telefoniczny całodobowo."
          >
            <Textarea id="hours" rows={3} {...register("hours")} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social media</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Facebook" htmlFor="facebook" error={errors.socialLinks?.facebook?.message}>
            <Input id="facebook" placeholder="https://…" {...register("socialLinks.facebook")} />
          </Field>
          <Field label="Instagram" htmlFor="instagram" error={errors.socialLinks?.instagram?.message}>
            <Input id="instagram" placeholder="https://…" {...register("socialLinks.instagram")} />
          </Field>
          <Field label="YouTube" htmlFor="youtube" error={errors.socialLinks?.youtube?.message}>
            <Input id="youtube" placeholder="https://…" {...register("socialLinks.youtube")} />
          </Field>
          <Field label="LinkedIn" htmlFor="linkedin" error={errors.socialLinks?.linkedin?.message}>
            <Input id="linkedin" placeholder="https://…" {...register("socialLinks.linkedin")} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prywatność i zgody</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Field
            label="Nota o przetwarzaniu danych"
            htmlFor="privacyNote"
            error={errors.privacyNote?.message}
            hint="Wyświetlana przy formularzach kontaktowych i testach."
          >
            <Textarea id="privacyNote" rows={4} {...register("privacyNote")} />
          </Field>
          <Field
            label="Treść banera zgód"
            htmlFor="consentBannerText"
            error={errors.consentBannerText?.message}
          >
            <Textarea id="consentBannerText" rows={3} {...register("consentBannerText")} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Domyślny obraz Open Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <MediaPicker
            value={ogImage}
            onChange={(item) => {
              setOgImage(item);
              setValue("defaultOgImageId", item?.id ?? null, { shouldDirty: true });
            }}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Zapisywanie…" : "Zapisz ustawienia"}
        </Button>
      </div>
    </form>
  );
}
