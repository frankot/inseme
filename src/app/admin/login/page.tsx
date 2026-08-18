import type { Metadata } from "next";

import { LoginForm } from "@/app/admin/login/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Logowanie — panel Insieme",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl, error } = await searchParams;

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Panel Insieme</CardTitle>
          <CardDescription>Zaloguj się, aby zarządzać treścią serwisu.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {error ? (
            <p
              role="alert"
              className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error === "CredentialsSignin"
                ? "Nieprawidłowy e-mail lub hasło."
                : "Logowanie nie powiodło się. Spróbuj ponownie."}
            </p>
          ) : null}
          <LoginForm callbackUrl={callbackUrl} />
        </CardContent>
      </Card>
    </main>
  );
}
