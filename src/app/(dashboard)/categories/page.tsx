"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { CategoriesTable } from "./categories-table";
import { CategoryForm } from "./category-form";

type Category = { id: string; name: string; created_at: string };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [creating, setCreating] = useState(false);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    setCategories(data ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Categorías</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {categories.length} categoría{categories.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setCreating(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva categoría
        </Button>
      </div>

      <CategoriesTable categories={categories} onRefresh={load} />

      <CategoryForm
        open={creating}
        onClose={() => { setCreating(false); load(); }}
      />
    </div>
  );
}
