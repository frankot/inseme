"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { saveTeamMember } from "@/app/admin/(shell)/team/actions";
import { Field } from "@/components/admin/field";
import { RecoveryNotice, useFormRecovery } from "@/components/admin/form-recovery";
import { SaveActions, SAVED_MESSAGE, type SaveMode } from "@/components/admin/save-actions";
import { MediaPicker } from "@/components/admin/media-picker";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { MediaSummary } from "@/lib/media-types";
import { slugify } from "@/lib/slug";
import { teamMemberSchema, type TeamMemberInput } from "@/lib/validations/content";

export function TeamForm({
  id,
  status,
  publishedAt,
  defaultValues,
  defaultPhoto,
}: {
  id: string | null;
  defaultValues: TeamMemberInput;
  defaultPhoto: MediaSummary | null;
  status: "draft" | "published" | null;
  publishedAt: string | null;
}) {
  const router = useRouter();
  const [photo, setPhoto] = useState<MediaSummary | null>(defaultPhoto);
  const form = useForm<TeamMemberInput>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues,
  });
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = form;
  const recovery = useFormRecovery({
    form,
    storageKey: `team:${id ?? "new"}`,
    getExtra: () => photo,
    onRestore: (_, extra) => setPhoto((extra as MediaSummary | null | undefined) ?? null),
  });

  async function onSubmit(values: TeamMemberInput, mode: SaveMode) {
    const result = await saveTeamMember(id, values, mode === "publish");
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    recovery.markSaved(values);
    toast.success(SAVED_MESSAGE[mode]);
    router.push("/admin/team");
  }

  return (
    <form onSubmit={(event) => event.preventDefault()} className="flex flex-col gap-6" noValidate>
      <RecoveryNotice recovery={recovery} />

      <Card>
        <CardHeader>
          <CardTitle>Dane osoby</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Imię i nazwisko" htmlFor="name" error={errors.name?.message}>
              <Input
                id="name"
                {...register("name", {
                  onBlur: (event) => {
                    if (!getValues("slug")) {
                      setValue("slug", slugify(event.target.value), { shouldValidate: true });
                    }
                  },
                })}
              />
            </Field>
            <Field
              label="Adres (slug)"
              htmlFor="slug"
              hint="Strona osoby: /zespol/<slug>. Zmiana zrywa istniejące linki."
              error={errors.slug?.message}
            >
              <Input id="slug" {...register("slug")} />
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
          <CardTitle>Licencje i certyfikaty</CardTitle>
        </CardHeader>
        <CardContent>
          <LicensesField form={form} />
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

      <SaveActions
        status={status}
        publishedAt={publishedAt}
        submitting={isSubmitting}
        onSave={(mode) => void handleSubmit((values) => onSubmit(values, mode))()}
      />
    </form>
  );
}

/**
 * Optional licences — name plus number — listed on the person's public page.
 * Most people have none or one; the list allows a few for those who hold both
 * a therapy and a psychotherapy certificate.
 */
function LicensesField({ form }: { form: UseFormReturn<TeamMemberInput> }) {
  const {
    control,
    register,
    formState: { errors },
  } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "licenses" });

  return (
    <div className="flex flex-col gap-4">
      {fields.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Brak. Opcjonalnie — np. „Certyfikat specjalisty psychoterapii uzależnień” i jego numer.
          Pojawią się na stronie osoby.
        </p>
      ) : (
        fields.map((field, index) => (
          <div
            key={field.id}
            className="grid items-start gap-3 sm:grid-cols-[minmax(0,1fr)_12rem_auto]"
          >
            <Field
              label="Nazwa"
              htmlFor={`licenses.${index}.name`}
              error={errors.licenses?.[index]?.name?.message}
            >
              <Input
                id={`licenses.${index}.name`}
                placeholder="np. Certyfikat specjalisty psychoterapii uzależnień"
                {...register(`licenses.${index}.name`)}
              />
            </Field>
            <Field
              label="Numer"
              htmlFor={`licenses.${index}.number`}
              error={errors.licenses?.[index]?.number?.message}
            >
              <Input
                id={`licenses.${index}.number`}
                placeholder="np. 1234"
                {...register(`licenses.${index}.number`)}
              />
            </Field>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive sm:mt-7"
              aria-label="Usuń licencję"
              onClick={() => remove(index)}
            >
              <Trash2 className="size-4" aria-hidden />
            </Button>
          </div>
        ))
      )}

      {errors.licenses?.message ? (
        <p className="text-sm text-destructive">{errors.licenses.message}</p>
      ) : null}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        disabled={fields.length >= 10}
        onClick={() => append({ name: "", number: "" })}
      >
        <Plus className="size-4" aria-hidden /> Dodaj licencję
      </Button>
    </div>
  );
}
