"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { AllergensTable } from "./allergens-table";
import { AllergenForm } from "./allergen-form";

type Allergen = { id: string; name: string; icon: string };

export default function AllergensPage() {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [creating, setCreating] = useState(false);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase.from("allergens").select("*").order("name");
    setAllergens(data ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Alérgenos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {allergens.length} alérgeno{allergens.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setCreating(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo alérgeno
        </Button>
      </div>

      <AllergensTable allergens={allergens} onRefresh={load} />

      <AllergenForm
        open={creating}
        onClose={() => { setCreating(false); load(); }}
      />
    </div>
  );
}
