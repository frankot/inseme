import Link from "next/link";

/**
 * Placeholder. The public site is a separate track (design not locked yet);
 * this repo currently ships the data layer and the admin panel.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Insieme</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Strona publiczna jest w przygotowaniu. Panel administracyjny jest już dostępny.
      </p>
      <Link href="/admin" className="text-sm underline underline-offset-4">
        Przejdź do panelu
      </Link>
    </main>
  );
}
