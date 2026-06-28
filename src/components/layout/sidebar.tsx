import { NavLinks } from "@/components/layout/nav-links";
import { Separator } from "@/components/ui/separator";

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-60 min-h-screen bg-card border-r flex-col">
      <div className="p-6">
        <h1 className="font-semibold text-lg">La Vita Buona</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Manager</p>
      </div>

      <Separator />

      <nav className="flex-1 p-4">
        <NavLinks />
      </nav>
    </aside>
  );
}
