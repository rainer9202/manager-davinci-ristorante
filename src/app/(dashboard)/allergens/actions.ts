"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAllergen(name: string, icon: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("allergens").insert({ name, icon });
  if (error) throw new Error(error.message);
  revalidatePath("/allergens");
}

export async function updateAllergen(id: string, name: string, icon: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("allergens").update({ name, icon }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/allergens");
}

export async function deleteAllergen(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("allergens").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/allergens");
}
