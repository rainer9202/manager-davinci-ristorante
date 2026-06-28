"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { DishForm } from "./dish-form";
import { deleteDish, toggleDishActive } from "./actions";
import { toast } from "sonner";

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

export function DishesTable({
  dishes,
  categories,
  allergens,
  onRefresh,
}: {
  dishes: Dish[];
  categories: Category[];
  allergens: Allergen[];
  onRefresh: () => void;
}) {
  const [editing, setEditing] = useState<Dish | null>(null);
  const [deleting, setDeleting] = useState<Dish | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  async function handleToggle(dish: Dish) {
    try {
      await toggleDishActive(dish.id, !dish.active);
      onRefresh();
    } catch {
      toast.error("Error al cambiar el estado");
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setLoadingDelete(true);
    try {
      await deleteDish(deleting.id);
      toast.success("Plato eliminado");
      setDeleting(null);
      onRefresh();
    } catch {
      toast.error("Error al eliminar el plato");
    } finally {
      setLoadingDelete(false);
    }
  }

  const allergenMap = Object.fromEntries(allergens.map((a) => [a.id, a]));
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {dishes.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 col-span-full">
            No hay platos.
          </p>
        ) : (
          dishes.map((dish) => (
            <Card key={dish.id} className={`flex flex-col${!dish.active ? " opacity-50" : ""}`}>
              <CardContent className="px-4 pt-2 flex flex-col h-full space-y-1.5">
                {dish.category_id && (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 w-fit dark:bg-green-900/30 dark:text-green-400">
                    {categoryMap[dish.category_id]}
                  </Badge>
                )}

                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{dish.name}</p>
                    {dish.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {dish.description}
                      </p>
                    )}
                  </div>
                  <p className="font-semibold text-sm shrink-0">
                    {dish.price.toFixed(2)} €
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 mt-1 mb-4">
                  {dish.allergen_ids.map((id) =>
                    allergenMap[id] ? (
                      <Badge key={id} variant="outline" className="text-xs">
                        {allergenMap[id].name}
                      </Badge>
                    ) : null,
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 mt-auto -mx-4 px-4 border-t">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={dish.active}
                      onCheckedChange={() => handleToggle(dish)}
                    />
                    <span className="text-xs text-muted-foreground">
                      {dish.active ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditing(dish)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleting(dish)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {editing && (
        <DishForm
          open={!!editing}
          onClose={() => {
            setEditing(null);
            onRefresh();
          }}
          dish={editing}
          categories={categories}
          allergens={allergens}
        />
      )}

      <Dialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar plato</DialogTitle>
            <DialogDescription>
              ¿Seguro que quieres eliminar <strong>{deleting?.name}</strong>?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleting(null)}
              disabled={loadingDelete}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loadingDelete}
            >
              {loadingDelete ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
