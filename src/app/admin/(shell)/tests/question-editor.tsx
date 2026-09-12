"use client";

import { ChevronDown, ChevronUp, Copy, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  addAnswerOption,
  addQuestion,
  copyOptionsToAllQuestions,
  deleteAnswerOption,
  deleteQuestion,
  moveQuestion,
  updateAnswerOption,
  updateQuestion,
} from "@/app/admin/(shell)/tests/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ActionResult } from "@/lib/action-result";

export type EditorQuestion = {
  id: string;
  text: string;
  sortOrder: number;
  options: { id: string; label: string; points: number; sortOrder: number }[];
};

/**
 * Questions and their answer options.
 *
 * Every change is its own server action rather than one big nested form: the
 * three collections have independent ordering, and diffing them client-side to
 * produce a single submit is more code and more ways to lose an edit.
 */
export function QuestionEditor({
  testId,
  questions,
}: {
  testId: string;
  questions: EditorQuestion[];
}) {
  const [pending, start] = useTransition();
  const [draft, setDraft] = useState("");

  function run(action: () => Promise<ActionResult>, success?: string) {
    start(async () => {
      const result = await action();
      if (!result.ok) toast.error(result.error);
      else if (success) toast.success(success);
    });
  }

  const maxScore = questions.reduce(
    (total, question) => total + Math.max(0, ...question.options.map((o) => o.points)),
    0,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pytania</CardTitle>
        <CardDescription>
          {questions.length === 0
            ? "Brak pytań. Test nie da się opublikować, dopóki nie ma choć jednego."
            : `${questions.length} pytań · maksymalny wynik: ${maxScore} pkt`}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {questions.map((question, index) => (
          <div key={question.id} className="rounded-lg border p-4">
            <div className="flex items-start gap-2">
              <span className="mt-2 w-6 shrink-0 text-sm tabular-nums text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>

              <Textarea
                rows={2}
                defaultValue={question.text}
                aria-label={`Treść pytania ${index + 1}`}
                onBlur={(event) => {
                  const text = event.target.value.trim();
                  if (!text || text === question.text) return;
                  run(() => updateQuestion(question.id, testId, { text, sortOrder: question.sortOrder }));
                }}
              />

              <div className="flex shrink-0 flex-col gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="W górę"
                  disabled={pending || index === 0}
                  onClick={() => run(() => moveQuestion(question.id, testId, "up"))}
                >
                  <ChevronUp className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="W dół"
                  disabled={pending || index === questions.length - 1}
                  onClick={() => run(() => moveQuestion(question.id, testId, "down"))}
                >
                  <ChevronDown className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Usuń pytanie"
                  disabled={pending}
                  onClick={() => {
                    if (!confirm("Usunąć pytanie razem z odpowiedziami?")) return;
                    run(() => deleteQuestion(question.id, testId), "Usunięto pytanie.");
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>

            <div className="mt-3 ml-8 flex flex-col gap-2">
              {question.options.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Input
                    className="flex-1"
                    defaultValue={option.label}
                    aria-label="Treść odpowiedzi"
                    onBlur={(event) => {
                      const label = event.target.value.trim();
                      if (!label || label === option.label) return;
                      run(() =>
                        updateAnswerOption(option.id, testId, {
                          label,
                          points: option.points,
                          sortOrder: option.sortOrder,
                        }),
                      );
                    }}
                  />
                  <Input
                    className="w-20"
                    type="number"
                    min={0}
                    defaultValue={option.points}
                    aria-label="Punkty"
                    onBlur={(event) => {
                      const points = Number(event.target.value);
                      if (Number.isNaN(points) || points === option.points) return;
                      run(() =>
                        updateAnswerOption(option.id, testId, {
                          label: option.label,
                          points,
                          sortOrder: option.sortOrder,
                        }),
                      );
                    }}
                  />
                  <span className="text-xs text-muted-foreground">pkt</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Usuń odpowiedź"
                    disabled={pending}
                    onClick={() => run(() => deleteAnswerOption(option.id, testId))}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={pending}
                  onClick={() =>
                    run(() =>
                      addAnswerOption(question.id, testId, {
                        label: "Nowa odpowiedź",
                        points: question.options.length,
                        sortOrder: question.options.length,
                      }),
                    )
                  }
                >
                  <Plus className="size-4" /> Odpowiedź
                </Button>

                {question.options.length > 0 && questions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={pending}
                    onClick={() => {
                      if (!confirm("Nadpisać odpowiedzi we wszystkich pozostałych pytaniach?")) return;
                      run(
                        () => copyOptionsToAllQuestions(question.id, testId),
                        "Skopiowano skalę do pozostałych pytań.",
                      );
                    }}
                  >
                    <Copy className="size-4" /> Użyj tej skali wszędzie
                  </Button>
                )}
              </div>

              {question.options.length === 0 && (
                <p className="text-xs text-destructive">
                  Pytanie bez odpowiedzi blokuje publikację testu.
                </p>
              )}
            </div>
          </div>
        ))}

        <div className="flex items-start gap-2 rounded-lg border border-dashed p-4">
          <Textarea
            rows={2}
            value={draft}
            placeholder="Treść nowego pytania"
            aria-label="Treść nowego pytania"
            onChange={(event) => setDraft(event.target.value)}
          />
          <Button
            type="button"
            disabled={pending || !draft.trim()}
            onClick={() => {
              const text = draft.trim();
              if (!text) return;
              setDraft("");
              run(() => addQuestion(testId, { text, sortOrder: questions.length }), "Dodano pytanie.");
            }}
          >
            <Plus className="size-4" /> Dodaj
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
