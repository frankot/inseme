import type { ReactNode } from "react";

import { auth } from "@/auth";
import { MobileNav } from "@/components/admin/mobile-nav";
import { NavLinks } from "@/components/admin/nav-links";
import { UserMenu } from "@/components/admin/user-menu";
import { Toaster } from "@/components/ui/sonner";

export default async function AdminShellLayout({ children }: { children: ReactNode }) {
  // `proxy.ts` already blocks anonymous requests; this read is for the header.
  const session = await auth();

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-background px-4">
        <MobileNav />
        <span className="text-sm font-semibold tracking-tight">Insieme — panel</span>
        <div className="ml-auto">
          <UserMenu name={session?.user?.name} email={session?.user?.email} />
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-64 shrink-0 border-r px-2 py-4 lg:block">
          <NavLinks />
        </aside>
        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>

      <Toaster />
    </div>
  );
}
