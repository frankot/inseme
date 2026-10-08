"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { saveFaqItem } from "@/app/admin/(shell)/faq/actions";
import { Field } from "@/components/admin/field";
import { RecoveryNotice, useFormRecovery } from "@/components/admin/form-recovery";
import { SaveActions, SAVED_MESSAGE, type SaveMode } from "@/components/admin/save-actions";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FAQ_CATEGORIES, faqCategoryLabel } from "@/lib/faq-categories";
import { faqItemSchema, type FaqItemInput } from "@/lib/validations/content";

export function FaqForm({
  id,
  status,
  publishedAt,
  defaultValues,
}: {
  id: string | null;
  defaultValues: FaqItemInput;
  status: "draft" | "published" | null;
  publishedAt: string | null;
}) {
  const router = useRouter();
  const form = useForm<FaqItemInput>({
    resolver: zodResolver(faqItemSchema),
    defaultValues,
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = form;
  const recovery = useFormRecovery({
    form,
    storageKey: `faq:${id ?? "new"}`,
  });

  async function onSubmit(values: FaqItemInput, mode: SaveMode) {
    const result = await saveFaqItem(id, values, mode === "publish");
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    recovery.markSaved(values);
    toast.success(SAVED_MESSAGE[mode]);
    router.push("/admin/faq");
  }

  return (
    <form onSubmit={(event) => event.preventDefault()} className="flex flex-col gap-6" noValidate>
      <RecoveryNotice recovery={recovery} />

      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <Field label="Pytanie" htmlFor="question" error={errors.question?.message}>
            <Input id="question" {...register("question")} />
          </Field>

          <Field label="Odpowiedź" error={errors.answer?.message}>
            <Controller
              control={control}
              name="answer"
              render={({ field }) => (
                <RichTextEditor value={field.value ?? ""} onChange={field.onChange} />
              )}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Kategoria"
              htmlFor="category"
              hint="Każde opublikowane pytanie jest na /faq. Kategoria tematyczna pokazuje je także na swojej stronie."
              error={errors.category?.message}
            >
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(value) => field.onChange(value)}>
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue>{(value: string) => faqCategoryLabel(value)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {FAQ_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <span className="flex flex-col">
                            <span>{category.label}</span>
                            <span className="text-xs text-muted-foreground">{category.where}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
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
