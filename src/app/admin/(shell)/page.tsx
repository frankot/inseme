import type { Metadata } from "next";

import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { adminNav } from "@/lib/admin-nav";

export const metadata: Metadata = {
  title: "Pulpit — panel Insieme",
};

export default async function AdminDashboardPage() {
  const session = await auth();
  const upcoming = adminNav.filter((item) => !item.available);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pulpit</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Zalogowano jako {session?.user?.email}.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Faza B1 — fundamenty</CardTitle>
          <CardDescription>
            Baza danych, logowanie i szkielet panelu są gotowe. Liczniki wiadomości, zgłoszeń
            i zapisów pojawią się tutaj, gdy powstaną odpowiadające im typy treści.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h2 className="text-sm font-medium">W kolejnych fazach</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {upcoming.map((item) => (
              <li
                key={item.href}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
              >
                <span className="text-muted-foreground">{item.label}</span>
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
                  {item.phase}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
