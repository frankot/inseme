"use client";

import { Plus, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { deleteResultBand, saveResultBand } from "@/app/admin/(shell)/tests/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ActionResult } from "@/lib/action-result";

export type EditorBand = {
  id: string;
  minScore: number;
  maxScore: number;
  resultTitle: string;
  resultBody: string;
  sortOrder: number;
};

/**
 * Score ranges and the text each one shows.
 *
 * Gaps and overlaps are flagged rather than prevented — an editor mid-edit will
 * always have an inconsistent moment, and blocking the save would be worse than
 * saying so. Scoring itself falls back to the last band, so a visitor never sees
 * an empty result.
 */
export function BandEditor({
  testId,
  bands,
  maxScore,
}: {
  testId: string;
  bands: EditorBand[];
  maxScore: number;
}) {
  const [pending, start] = useTransition();

  function run(action: () => Promise<ActionResult>, success?: string) {
    start(async () => {
      const result = await action();
      if (!result.ok) toast.error(result.error);
      else if (success) toast.success(success);
    });
  }

  const ordered = [...bands].sort((a, b) => a.minScore - b.minScore);
  const problems = describeCoverage(ordered, maxScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Przedziały wyniku</CardTitle>
        <CardDescription>
          Maksymalny wynik tego testu to {maxScore} pkt. Przedziały powinny pokrywać zakres 0–
          {maxScore} bez luk.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {problems.length > 0 && (
          <ul className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            {problems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
        )}

        {ordered.map((band) => (
          <div key={band.id} className="flex flex-col gap-2 rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Input
                className="w-20"
                type="number"
                min={0}
                defaultValue={band.minScore}
                aria-label="Od (punkty)"
                onBlur={(event) =>
                  save(band, { minScore: Number(event.target.value) })
                }
              />
              <span className="text-sm text-muted-foreground">–</span>
              <Input
                className="w-20"
                type="number"
                min={0}
                defaultValue={band.maxScore}
                aria-label="Do (punkty)"
                onBlur={(event) =>
                  save(band, { maxScore: Number(event.target.value) })
                }
              />
              <span className="text-xs text-muted-foreground">pkt</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="ml-auto"
                aria-label="Usuń przedział"
                disabled={pending}
                onClick={() => run(() => deleteResultBand(band.id, testId))}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>

            <Input
              defaultValue={band.resultTitle}
              placeholder="Tytuł wyniku"
              aria-label="Tytuł wyniku"
              onBlur={(event) => save(band, { resultTitle: event.target.value })}
            />
            <Textarea
              rows={3}
              defaultValue={band.resultBody}
              placeholder="Treść wyniku"
              aria-label="Treść wyniku"
              onBlur={(event) => save(band, { resultBody: event.target.value })}
            />
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="self-start"
          disabled={pending}
          onClick={() => {
            const last = ordered[ordered.length - 1];
            const min = last ? last.maxScore + 1 : 0;
            run(
              () =>
                saveResultBand(null, testId, {
                  minScore: Math.min(min, maxScore),
                  maxScore,
                  resultTitle: "Nowy wynik",
                  resultBody: "Treść wyniku.",
                  sortOrder: ordered.length,
                }),
              "Dodano przedział.",
            );
          }}
        >
          <Plus className="size-4" /> Dodaj przedział
        </Button>
      </CardContent>
    </Card>
  );

  function save(band: EditorBand, patch: Partial<EditorBand>) {
    const next = { ...band, ...patch };
    if (
      next.minScore === band.minScore &&
      next.maxScore === band.maxScore &&
      next.resultTitle === band.resultTitle &&
      next.resultBody === band.resultBody
    ) {
      return;
    }
    run(() =>
      saveResultBand(band.id, testId, {
        minScore: next.minScore,
        maxScore: next.maxScore,
        resultTitle: next.resultTitle,
        resultBody: next.resultBody,
        sortOrder: next.sortOrder,
      }),
    );
  }
}

/** Human-readable gaps/overlaps, shown as warnings rather than enforced. */
function describeCoverage(bands: EditorBand[], maxScore: number): string[] {
  if (bands.length === 0) return ["Brak przedziałów — test nie da się opublikować."];

  const problems: string[] = [];
  if (bands[0].minScore > 0) {
    problems.push(`Wyniki 0–${bands[0].minScore - 1} pkt nie mają przypisanego przedziału.`);
  }
  for (let i = 1; i < bands.length; i += 1) {
    const previous = bands[i - 1];
    const current = bands[i];
    if (current.minScore > previous.maxScore + 1) {
      problems.push(
        `Luka między ${previous.maxScore} a ${current.minScore} pkt.`,
      );
    } else if (current.minScore <= previous.maxScore) {
      problems.push(
        `Przedziały ${previous.minScore}–${previous.maxScore} i ${current.minScore}–${current.maxScore} nachodzą na siebie.`,
      );
    }
  }
  const last = bands[bands.length - 1];
  if (last.maxScore < maxScore) {
    problems.push(`Wyniki powyżej ${last.maxScore} pkt trafią do ostatniego przedziału.`);
  }
  return problems;
}
