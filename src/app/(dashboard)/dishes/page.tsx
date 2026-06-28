"use client";

import { useEffect, useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
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
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

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

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return dishes.filter((d) => {
      if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterCategory !== "all" && d.category_id !== filterCategory) return false;
      return true;
    });
  }, [dishes, search, filterCategory]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Platos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} plato{filtered.length !== 1 ? "s" : ""} en el menú
          </p>
        </div>
        <Button onClick={() => setCreating(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo plato
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v ?? "all")}>
          <SelectTrigger className="w-full sm:w-52">
            <span className="text-sm">
              {filterCategory === "all"
                ? <span className="text-muted-foreground">Todas las categorías</span>
                : categories.find((c) => c.id === filterCategory)?.name}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DishesTable
        dishes={filtered}
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
