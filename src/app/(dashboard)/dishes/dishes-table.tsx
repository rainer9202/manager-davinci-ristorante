"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead className="hidden md:table-cell">Categoría</TableHead>
              <TableHead className="hidden lg:table-cell">Alérgenos</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead className="w-[100px] text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dishes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No hay platos.
                </TableCell>
              </TableRow>
            ) : (
              dishes.map((dish) => (
                <TableRow key={dish.id} className={!dish.active ? "opacity-50" : ""}>
                  <TableCell>
                    <p className="font-medium">{dish.name}</p>
                    {dish.description && (
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {dish.description}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {dish.category_id ? (
                      <Badge variant="secondary">{categoryMap[dish.category_id]}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {dish.allergen_ids.map((id) =>
                        allergenMap[id] ? (
                          <span key={id} title={allergenMap[id].name} className="text-lg">
                            {allergenMap[id].icon}
                          </span>
                        ) : null
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {dish.price.toFixed(2)} €
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={dish.active}
                      onCheckedChange={() => handleToggle(dish)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setEditing(dish)}>
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editing && (
        <DishForm
          open={!!editing}
          onClose={() => { setEditing(null); onRefresh(); }}
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
              ¿Seguro que quieres eliminar <strong>{deleting?.name}</strong>? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)} disabled={loadingDelete}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loadingDelete}>
              {loadingDelete ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
