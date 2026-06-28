"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface DishPayload {
  name: string;
  description: string;
  price: number;
  category_id: string | null;
  active: boolean;
  allergen_ids: string[];
}

export async function createDish(payload: DishPayload) {
  const supabase = await createClient();

  const { data: dish, error } = await supabase
    .from("dishes")
    .insert({
      name: payload.name,
      description: payload.description,
      price: payload.price,
      category_id: payload.category_id || null,
      active: payload.active,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  if (payload.allergen_ids.length > 0) {
    await supabase.from("dish_allergens").insert(
      payload.allergen_ids.map((allergen_id) => ({ dish_id: dish.id, allergen_id }))
    );
  }

  revalidatePath("/dishes");
}

export async function updateDish(id: string, payload: DishPayload) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("dishes")
    .update({
      name: payload.name,
      description: payload.description,
      price: payload.price,
      category_id: payload.category_id || null,
      active: payload.active,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  await supabase.from("dish_allergens").delete().eq("dish_id", id);

  if (payload.allergen_ids.length > 0) {
    await supabase.from("dish_allergens").insert(
      payload.allergen_ids.map((allergen_id) => ({ dish_id: id, allergen_id }))
    );
  }

  revalidatePath("/dishes");
}

export async function toggleDishActive(id: string, active: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("dishes").update({ active }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dishes");
}

export async function deleteDish(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("dishes").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dishes");
}
