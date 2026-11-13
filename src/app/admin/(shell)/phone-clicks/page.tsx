import type { Metadata } from "next";

import { PageHeader } from "@/components/admin/page-header";
import { INBOX_TABS, SectionTabs } from "@/components/admin/section-tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LOCATION_LABELS, type PhoneClickSource, SOURCE_LABELS } from "@/lib/phone-clicks";
import { getNewContactCount } from "@/lib/queries/leads";
import { getPhoneClickStats } from "@/lib/queries/phone-clicks";

export const metadata: Metadata = { title: "Kliknięcia w telefon — panel Insieme" };

const formatDay = (day: string) =>
  new Date(`${day}T12:00:00`).toLocaleDateString("pl-PL", { day: "numeric", month: "short" });

const share = (part: number, whole: number) => (whole ? `${Math.round((part / whole) * 100)}%` : "—");

function Breakdown({
  title,
  head,
  rows,
  whole,
}: {
  title: string;
  head: string;
  rows: { label: string; total: number }[];
  whole: number;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-base font-semibold">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Brak kliknięć w tym okresie.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{head}</TableHead>
              <TableHead className="w-24 text-right">Kliknięcia</TableHead>
              <TableHead className="w-20 text-right">Udział</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.label}>
                <TableCell className="max-w-96 truncate" title={row.label}>
                  {row.label}
                </TableCell>
                <TableCell className="text-right tabular-nums">{row.total}</TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">
                  {share(row.total, whole)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}

export default async function PhoneClicksPage() {
  const [stats, newMessages] = await Promise.all([getPhoneClickStats(), getNewContactCount()]);

  return (
    <>
      <SectionTabs tabs={INBOX_TABS(newMessages)} current="/admin/phone-clicks" />
      <PageHeader
        title="Kliknięcia w telefon"
        description="Ile razy ktoś dotknął numeru telefonu na stronie, u wszystkich odwiedzających, bez plików cookies i bez danych o osobie. Kliknięcie to próba połączenia, nie odebrana rozmowa; z komputera zwykle nie kończy się telefonem. Wejścia z panelu (przeglądarki zespołu) nie są liczone."
      />

      {stats === null ? (
        <p className="rounded-md border border-dashed px-4 py-12 text-center text-sm text-muted-foreground">
          Licznik nie jest jeszcze włączony: w bazie brakuje tabeli. Trzeba uruchomić migrację (npm run
          db:migrate).
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Ostatnie 7 dni", value: String(stats.last7) },
              { label: "Ostatnie 30 dni", value: String(stats.last30) },
              { label: "Z telefonu komórkowego (30 dni)", value: share(stats.mobile30, stats.last30) },
              {
                label: "Liczymy od",
                value: stats.firstDay ? formatDay(stats.firstDay) : "pierwszego kliknięcia",
              },
            ].map((tile) => (
              <div key={tile.label} className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">{tile.label}</p>
                <p className="mt-1 text-2xl font-semibold">{tile.value}</p>
              </div>
            ))}
          </div>

          <Breakdown
            title="Tygodniowo (ostatnie 12 tygodni)"
            head="Tydzień od"
            rows={stats.weeks.map((row) => ({ label: formatDay(row.week), total: row.total }))}
            whole={stats.weeks.reduce((sum, row) => sum + row.total, 0)}
          />
          <Breakdown
            title="Skąd przyszli (30 dni)"
            head="Źródło wejścia"
            rows={stats.bySource.map((row) => ({
              label: SOURCE_LABELS[row.key as PhoneClickSource] ?? row.key,
              total: row.total,
            }))}
            whole={stats.last30}
          />
          <Breakdown
            title="Od której strony zaczęli (30 dni)"
            head="Pierwsza otwarta strona"
            rows={stats.byLanding.map((row) => ({ label: row.key, total: row.total }))}
            whole={stats.last30}
          />
          <Breakdown
            title="Gdzie kliknęli (30 dni)"
            head="Strona · przycisk"
            rows={stats.byPage.map((row) => ({
              label: `${row.page} · ${LOCATION_LABELS[row.location] ?? row.location}`,
              total: row.total,
            }))}
            whole={stats.last30}
          />
        </div>
      )}
    </>
  );
}
