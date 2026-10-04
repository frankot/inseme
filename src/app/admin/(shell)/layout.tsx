import type { ReactNode } from "react";

import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { MobileNav } from "@/components/admin/mobile-nav";
import { ShellContainer } from "@/components/admin/shell-container";
import { UserMenu } from "@/components/admin/user-menu";
import { SiteImage } from "@/components/site/ui/site-image";
import { Toaster } from "@/components/ui/sonner";

export default async function AdminShellLayout({ children }: { children: ReactNode }) {
  // `proxy.ts` already blocks anonymous requests; this read is for the header.
  const session = await auth();

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-background px-4">
        <MobileNav />
        <SiteImage
          src="/placeholder/logo-insieme.png"
          alt="Insieme"
          width={244}
          height={72}
          priority
          className="h-6 w-auto"
        />
        <div className="ml-auto">
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

      <Toaster />
    </div>
  );
}
