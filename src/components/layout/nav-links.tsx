"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Tag, UtensilsCrossed, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/categories", label: "Categorías", icon: Tag },
  { href: "/dishes", label: "Platos", icon: UtensilsCrossed },
  { href: "/allergens", label: "Alérgenos", icon: AlertCircle },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="space-y-1">
      {navItems.map(({ href, label, icon: Icon }) => (
        <li key={href}>
          <Link
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
              pathname === href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
