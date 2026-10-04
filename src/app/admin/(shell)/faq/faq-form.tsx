"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { saveFaqItem } from "@/app/admin/(shell)/faq/actions";
import { Field } from "@/components/admin/field";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  FAQ_FEATURED_MAX,
  faqItemSchema,
  type FaqItemInput,
} from "@/lib/validations/content";

export function FaqForm({
  id,
  defaultValues,
  categories,
}: {
  id: string | null;
  defaultValues: FaqItemInput;
  categories: string[];
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FaqItemInput>({
    resolver: zodResolver(faqItemSchema),
    defaultValues,
  });

  async function onSubmit(values: FaqItemInput) {
    const result = await saveFaqItem(id, values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Zapisano szkic.");
    if (!id) router.push(`/admin/faq/${result.data.id}`);
    else router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
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
              hint="Grupuje pytania i pozwala osadzić wybraną grupę w sekcji FAQ na stronie."
              error={errors.category?.message}
            >
              <Input id="category" list="faq-categories" {...register("category")} />
              <datalist id="faq-categories">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
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
            label="Na stronie głównej"
            hint={`Pokazuje pytanie w sekcji FAQ na stronie głównej (najwyżej ${FAQ_FEATURED_MAX}). Pełna lista jest zawsze na /faq.`}
          >
            <Controller
              control={control}
              name="featured"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-label="Na stronie głównej"
                />
              )}
            />
          </Field>
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
