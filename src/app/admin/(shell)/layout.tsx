import { BookOpen } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { MobileNav } from "@/components/admin/mobile-nav";
import { ShellContainer } from "@/components/admin/shell-container";
import { UserMenu } from "@/components/admin/user-menu";
import { SiteImage } from "@/components/site/ui/site-image";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

export default async function AdminShellLayout({ children }: { children: ReactNode }) {
  // `proxy.ts` already blocks anonymous requests; this read is for the header.
  const session = await auth();

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-background px-4">
        <MobileNav />
        {/* On desktop the logo box spans exactly the sidebar (w-64, cancelling
            the header's padding), so the mark sits centred over the menu. */}
        <div className="flex lg:-ml-4 lg:w-64 lg:shrink-0 lg:justify-center">
          <SiteImage
            src="/brand/logo-insieme.svg"
            alt="Insieme"
            width={930}
            height={253}
            loading="eager"
            className="h-6 w-auto"
          />
        </div>
        <div className="ml-auto flex items-center gap-1">
          {/* The client's manual for this panel (src/content/admin-manual.md). */}
          <Button variant="ghost" size="sm" render={<Link href="/admin/instrukcja" />}>
            <BookOpen aria-hidden />
            Instrukcja
          </Button>
          <UserMenu name={session?.user?.name} email={session?.user?.email} />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sticky under the 3.5rem header, so the nav stays put while a long list scrolls. */}
        <AdminSidebar />
        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8">
          <ShellContainer>{children}</ShellContainer>
        </main>
      </div>

      <Toaster position="bottom-left" />
    </div>
  );
}
