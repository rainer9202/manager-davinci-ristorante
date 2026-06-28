import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { UtensilsCrossed, Tag, AlertCircle, CheckCircle } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    { count: totalDishes },
    { count: activeDishes },
    { count: totalCategories },
    { count: totalAllergens },
  ] = await Promise.all([
    supabase.from("dishes").select("*", { count: "exact", head: true }),
    supabase.from("dishes").select("*", { count: "exact", head: true }).eq("active", true),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("allergens").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    {
      title: "Platos totales",
      value: totalDishes ?? 0,
      icon: UtensilsCrossed,
      description: "en el menú",
    },
    {
      title: "Platos activos",
      value: activeDishes ?? 0,
      icon: CheckCircle,
      description: "visibles en el front",
    },
    {
      title: "Categorías",
      value: totalCategories ?? 0,
      icon: Tag,
      description: "en el menú",
    },
    {
      title: "Alérgenos",
      value: totalAllergens ?? 0,
      icon: AlertCircle,
      description: "configurados",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ title, value, icon: Icon, description }) => (
          <Card key={title}>
            <CardContent className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-xs text-muted-foreground">{title}</p>
                <p className="text-2xl font-bold leading-tight">{value}</p>
              </div>
              <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
