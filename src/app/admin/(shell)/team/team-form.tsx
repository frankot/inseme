"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Controller, FormProvider, useFieldArray, useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import {
  discardTeamMemberChanges,
  saveTeamMember,
  unpublishTeamMember,
} from "@/app/admin/(shell)/team/actions";
import { PublishedProvider } from "@/components/admin/cms/diff";
import { Field } from "@/components/admin/field";
import { RecoveryNotice, useFormRecovery } from "@/components/admin/form-recovery";
import { SaveActions, SAVED_MESSAGE, type SaveMode } from "@/components/admin/save-actions";
import { MediaPicker } from "@/components/admin/media-picker";
import { beforeHtml, PendingChangesBanner, TrackedField } from "@/components/admin/pending-changes";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { MediaSummary } from "@/lib/media-types";
import { slugify } from "@/lib/slug";
import { teamMemberSchema, type TeamMemberInput } from "@/lib/validations/content";

/** One licence per line, as the change note's preview of the published list. */
function beforeLicenses(value: unknown) {
  const list = Array.isArray(value) ? (value as TeamMemberInput["licenses"]) : [];
  return list.length ? list.map((license) => `${license.name} — ${license.number}`).join("\n") : <em>(brak)</em>;
}

export function TeamForm({
  id,
  status,
  publishedAt,
  defaultValues,
  defaultPhoto,
  published = null,
  publishedPhoto = null,
  pendingSavedAt = null,
}: {
  id: string | null;
  /** The pending changes when there are any, else the live record. */
  defaultValues: TeamMemberInput;
  defaultPhoto: MediaSummary | null;
  status: "draft" | "published" | null;
  publishedAt: string | null;
  /** The live record in the form's shape — given for a published record only. */
  published?: TeamMemberInput | null;
  publishedPhoto?: MediaSummary | null;
  /** When the pending changes were saved; null when there are none. */
  pendingSavedAt?: string | null;
}) {
  const router = useRouter();
  const [photo, setPhoto] = useState<MediaSummary | null>(defaultPhoto);
  const [pendingAt, setPendingAt] = useState(pendingSavedAt);
  const [busy, setBusy] = useState(false);
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
    const result = await saveTeamMember(id, values, mode);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    recovery.markSaved(values);
    toast.success(SAVED_MESSAGE[mode]);
    router.push("/admin/team");
  }

  const save = (mode: SaveMode) => void handleSubmit((values) => onSubmit(values, mode))();

  async function hide() {
    if (!id) return;
    setBusy(true);
    const result = await unpublishTeamMember(id);
    setBusy(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Ukryto — osoba nie jest widoczna na stronie.");
    router.refresh();
  }

  async function discard() {
    if (!id || !published) return;
    setBusy(true);
    const result = await discardTeamMemberChanges(id);
    setBusy(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    form.reset(published);
    setPhoto(publishedPhoto);
    recovery.markSaved(published);
    setPendingAt(null);
    toast.success("Odrzucono zmiany — formularz pokazuje wersję ze strony.");
    router.refresh();
  }

  return (
    <FormProvider {...form}>
      <PublishedProvider value={status === "published" ? published : null}>
        <form onSubmit={(event) => event.preventDefault()} className="flex flex-col gap-6" noValidate>
          <RecoveryNotice recovery={recovery} />
          {status === "published" && pendingAt ? (
            <PendingChangesBanner
              savedAt={pendingAt}
              busy={busy || isSubmitting}
              onPublish={() => save("publish")}
              onDiscard={() => void discard()}
            />
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Dane osoby</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <TrackedField name="name">
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
                </TrackedField>
                <TrackedField name="slug">
                  <Field
                    label="Adres (slug)"
                    htmlFor="slug"
                    hint="Strona osoby: /zespol/<slug>. Zmiana zrywa istniejące linki."
                    error={errors.slug?.message}
                  >
                    <Input id="slug" {...register("slug")} />
                  </Field>
                </TrackedField>
                <TrackedField name="role">
                  <Field label="Rola" htmlFor="role" error={errors.role?.message}>
                    <Input id="role" placeholder="np. terapeutka uzależnień" {...register("role")} />
                  </Field>
                </TrackedField>
                <TrackedField name="qualifications">
                  <Field
                    label="Kwalifikacje"
                    htmlFor="qualifications"
                    error={errors.qualifications?.message}
                  >
                    <Input id="qualifications" {...register("qualifications")} />
                  </Field>
                </TrackedField>
                <TrackedField name="sortOrder" before={(value) => String(value ?? "")}>
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
                </TrackedField>
              </div>

              <TrackedField name="shortBio">
                <Field label="Krótki opis" htmlFor="shortBio" error={errors.shortBio?.message}>
                  <Textarea id="shortBio" rows={3} {...register("shortBio")} />
                </Field>
              </TrackedField>

              <TrackedField name="longBio" before={beforeHtml}>
                <Field label="Pełny biogram" error={errors.longBio?.message}>
                  <Controller
                    control={control}
                    name="longBio"
                    render={({ field }) => (
                      <RichTextEditor value={field.value ?? ""} onChange={field.onChange} />
                    )}
                  />
                </Field>
              </TrackedField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Licencje i certyfikaty</CardTitle>
            </CardHeader>
            <CardContent>
              <TrackedField name="licenses" before={beforeLicenses}>
                <LicensesField form={form} />
              </TrackedField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Zdjęcie</CardTitle>
            </CardHeader>
            <CardContent>
              <TrackedField
                name="photoId"
                before={() =>
                  publishedPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element -- a small preview in the change note
                    <img src={publishedPhoto.url} alt="" className="h-24 w-auto rounded" />
                  ) : (
                    <em>(bez zdjęcia)</em>
                  )
                }
                onRestore={() => setPhoto(publishedPhoto)}
              >
                <MediaPicker
                  value={photo}
                  onChange={(item) => {
                    setPhoto(item);
                    setValue("photoId", item?.id ?? null, { shouldDirty: true });
                  }}
                />
              </TrackedField>
            </CardContent>
          </Card>

          <SaveActions
            status={status}
            publishedAt={publishedAt}
            submitting={isSubmitting || busy}
            pendingChanges={id ? { savedAt: pendingAt } : undefined}
            onHide={() => void hide()}
            onSave={save}
          />
        </form>
      </PublishedProvider>
    </FormProvider>
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
