"use client";

import { useRouter } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavLinks } from "@/components/layout/nav-links";
import { toast } from "sonner";

export function Navbar() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Sesión cerrada");
    router.push("/login");
  }

  return (
    <header className="h-14 border-b bg-card px-4 flex items-center justify-between sticky top-0 z-10">
      {/* Mobile: hamburger */}
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-0">
            <div className="p-6 border-b">
              <h1 className="font-semibold text-lg">La Vita Buona</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Manager</p>
            </div>
            <nav className="p-4">
              <NavLinks />
            </nav>
          </SheetContent>
        </Sheet>

      </div>

      {/* Logout */}
      <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-muted-foreground">
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Cerrar sesión</span>
      </Button>
    </header>
  );
}
