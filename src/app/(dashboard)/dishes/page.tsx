"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { DishesTable } from "./dishes-table";
import { DishForm } from "./dish-form";

type Category = { id: string; name: string };
type Allergen = { id: string; name: string; icon: string };
type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string | null;
  active: boolean;
  allergen_ids: string[];
};

export default function DishesPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [creating, setCreating] = useState(false);

  async function load() {
    const supabase = createClient();
    const [{ data: dishData }, { data: catData }, { data: allergenData }] = await Promise.all([
      supabase
        .from("dishes")
        .select("id, name, description, price, category_id, active, dish_allergens(allergen_id)")
        .order("name"),
      supabase.from("categories").select("*").order("name"),
      supabase.from("allergens").select("*").order("name"),
    ]);

    const normalized = (dishData ?? []).map((d: any) => ({
      ...d,
      allergen_ids: (d.dish_allergens ?? []).map((da: any) => da.allergen_id),
    }));

    setDishes(normalized);
    setCategories(catData ?? []);
    setAllergens(allergenData ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Platos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {dishes.length} plato{dishes.length !== 1 ? "s" : ""} en el menú
          </p>
        </div>
        <Button onClick={() => setCreating(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo plato
        </Button>
      </div>

      <DishesTable
        dishes={dishes}
        categories={categories}
        allergens={allergens}
        onRefresh={load}
      />

      <DishForm
        open={creating}
        onClose={() => { setCreating(false); load(); }}
        categories={categories}
        allergens={allergens}
      />
    </div>
  );
}
