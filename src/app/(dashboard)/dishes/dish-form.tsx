"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createDish, updateDish } from "./actions";
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

interface DishFormProps {
  open: boolean;
  onClose: () => void;
  dish?: Dish;
  categories: Category[];
  allergens: Allergen[];
}

export function DishForm({ open, onClose, dish, categories, allergens }: DishFormProps) {
  const [name, setName] = useState(dish?.name ?? "");
  const [description, setDescription] = useState(dish?.description ?? "");
  const [price, setPrice] = useState(dish?.price?.toString() ?? "");
  const [categoryId, setCategoryId] = useState<string>(dish?.category_id ?? "");
  const [active, setActive] = useState(dish?.active ?? true);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(dish?.allergen_ids ?? []);
  const [loading, setLoading] = useState(false);

  function toggleAllergen(id: string) {
    setSelectedAllergens((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !price) return;
    setLoading(true);

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category_id: categoryId || null,
      active,
      allergen_ids: selectedAllergens,
    };

    try {
      if (dish) {
        await updateDish(dish.id, payload);
        toast.success("Plato actualizado");
      } else {
        await createDish(payload);
        toast.success("Plato creado");
      }
      onClose();
    } catch {
      toast.error("Error al guardar el plato");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dish ? "Editar plato" : "Nuevo plato"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Pasta al pomodoro"
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción breve del plato"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Precio (IVA inc.) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="pl-7"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? "")}>
                <SelectTrigger>
                  <span className="flex flex-1 text-left text-sm">
                    {categoryId
                      ? categories.find((c) => c.id === categoryId)?.name
                      : <span className="text-muted-foreground">Sin categoría</span>}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Visible en el menú</p>
              <p className="text-xs text-muted-foreground">El plato aparece en el front</p>
            </div>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>

          <div className="space-y-2">
            <Label>Alérgenos</Label>
            <div className="grid grid-cols-2 gap-2 rounded-lg border p-3">
              {allergens.map((a) => (
                <label
                  key={a.id}
                  className="flex items-center gap-2 cursor-pointer text-sm"
                >
                  <Checkbox
                    checked={selectedAllergens.includes(a.id)}
                    onCheckedChange={() => toggleAllergen(a.id)}
                  />
                  <span>{a.name}</span>
                </label>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
