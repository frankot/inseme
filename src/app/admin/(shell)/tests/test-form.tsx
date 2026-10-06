"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { saveScreeningTest } from "@/app/admin/(shell)/tests/actions";
import { Field } from "@/components/admin/field";
import { RecoveryNotice, useFormRecovery } from "@/components/admin/form-recovery";
import { SaveActions, SAVED_MESSAGE, type SaveMode } from "@/components/admin/save-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/slug";
import { screeningTestSchema, type ScreeningTestInput } from "@/lib/validations/screening";

export function TestForm({
  id,
  status,
  publishedAt,
  defaultValues,
}: {
  id: string | null;
  status: "draft" | "published" | null;
  publishedAt: string | null;
  defaultValues: ScreeningTestInput;
}) {
  const router = useRouter();
  const form = useForm<ScreeningTestInput>({
    resolver: zodResolver(screeningTestSchema),
    defaultValues,
  });
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = form;
  const recovery = useFormRecovery({
    form,
    storageKey: `test:${id ?? "new"}`,
  });

  async function onSubmit(values: ScreeningTestInput, mode: SaveMode) {
    const result = await saveScreeningTest(id, values, mode === "publish");
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    recovery.markSaved(values);
    toast.success(SAVED_MESSAGE[mode]);
    // A new test has no questions yet, and they can only be added on its own
    // page — so the first save goes there instead of back to the list.
    router.push(id ? "/admin/tests" : `/admin/tests/${result.data.id}`);
  }

  return (
    <form
      noValidate
      className="flex flex-col gap-6"
      onSubmit={(event) => event.preventDefault()}
    >
      <RecoveryNotice recovery={recovery} />

      <Card>
        <CardHeader>
          <CardTitle>Test</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tytuł" htmlFor="title" error={errors.title?.message}>
              <Input
                id="title"
                {...register("title", {
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
              hint="Strona testu: /testy/<slug>."
              error={errors.slug?.message}
            >
              <Input id="slug" {...register("slug")} />
            </Field>
          </div>

          <Field
            label="Krótki opis"
            htmlFor="description"
            hint="Pokazywany na liście testów."
            error={errors.description?.message}
          >
            <Textarea id="description" rows={2} {...register("description")} />
          </Field>

          <Field
            label="Tekst wprowadzający"
            htmlFor="introText"
            hint="Widoczny zanim ktoś zacznie odpowiadać."
            error={errors.introText?.message}
          >
            <Textarea id="introText" rows={3} {...register("introText")} />
          </Field>

          <Field
            label="Zastrzeżenie"
            htmlFor="disclaimerText"
            hint="Pokazywane przy teście, przy wyniku i w PDF. Treść musi zaakceptować osoba merytorycznie odpowiedzialna."
            error={errors.disclaimerText?.message}
          >
            <Textarea id="disclaimerText" rows={3} {...register("disclaimerText")} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Meta tytuł" htmlFor="metaTitle" error={errors.metaTitle?.message}>
              <Input id="metaTitle" {...register("metaTitle")} />
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

          <Field
            label="Meta opis"
            htmlFor="metaDescription"
            error={errors.metaDescription?.message}
          >
            <Textarea id="metaDescription" rows={2} {...register("metaDescription")} />
          </Field>
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
