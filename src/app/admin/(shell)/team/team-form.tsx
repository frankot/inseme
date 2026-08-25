"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { saveTeamMember } from "@/app/admin/(shell)/team/actions";
import { Field } from "@/components/admin/field";
import { MediaPicker } from "@/components/admin/media-picker";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { MediaSummary } from "@/lib/media-types";
import { teamMemberSchema, type TeamMemberInput } from "@/lib/validations/content";

export function TeamForm({
  id,
  defaultValues,
  defaultPhoto,
}: {
  id: string | null;
  defaultValues: TeamMemberInput;
  defaultPhoto: MediaSummary | null;
}) {
  const router = useRouter();
  const [photo, setPhoto] = useState<MediaSummary | null>(defaultPhoto);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TeamMemberInput>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues,
  });

  async function onSubmit(values: TeamMemberInput) {
    const result = await saveTeamMember(id, values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Zapisano szkic.");
    if (!id) router.push(`/admin/team/${result.data.id}`);
    else router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <Card>
        <CardHeader>
          <CardTitle>Dane osoby</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Imię i nazwisko" htmlFor="name" error={errors.name?.message}>
              <Input id="name" {...register("name")} />
            </Field>
            <Field label="Rola" htmlFor="role" error={errors.role?.message}>
              <Input id="role" placeholder="np. terapeutka uzależnień" {...register("role")} />
            </Field>
            <Field
              label="Kwalifikacje"
              htmlFor="qualifications"
              error={errors.qualifications?.message}
            >
              <Input id="qualifications" {...register("qualifications")} />
            </Field>
            <Field
              label="Kolejność"
              htmlFor="sortOrder"
              hint="Niższa liczba = wyżej na liście."
              error={errors.sortOrder?.message}
            >
              <Input
                id="sortOrder"
                type="number"
                min={0}
                {...register("sortOrder", { valueAsNumber: true })}
              />
            </Field>
          </div>

          <Field label="Krótki opis" htmlFor="shortBio" error={errors.shortBio?.message}>
            <Textarea id="shortBio" rows={3} {...register("shortBio")} />
          </Field>

          <Field label="Pełny biogram" error={errors.longBio?.message}>
            <Controller
              control={control}
              name="longBio"
              render={({ field }) => (
                <RichTextEditor value={field.value ?? ""} onChange={field.onChange} />
              )}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zdjęcie</CardTitle>
        </CardHeader>
        <CardContent>
          <MediaPicker
            value={photo}
            onChange={(item) => {
              setPhoto(item);
              setValue("photoId", item?.id ?? null, { shouldDirty: true });
            }}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Zapisywanie…" : "Zapisz szkic"}
        </Button>
      </div>
    </form>
  );
}
