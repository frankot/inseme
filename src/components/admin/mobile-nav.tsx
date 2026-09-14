"use client";

import { Menu } from "lucide-react";
import { useState } from "react";

import { NavLinks } from "@/components/admin/nav-links";
import { SiteImage } from "@/components/site/ui/site-image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Otwórz menu" />}
      >
        <Menu className="size-5" aria-hidden />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b px-4 py-3">
          {/* The mark is the drawer's accessible name, so `alt` has to carry
              what the wordmark used to say out loud. */}
          <SheetTitle className="text-left">
            <SiteImage
              src="/placeholder/logo-insieme.png"
              alt="Insieme"
              width={244}
              height={72}
              className="h-6 w-auto"
            />
          </SheetTitle>
        </SheetHeader>
        <div className="px-2 py-3">
          <NavLinks onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
