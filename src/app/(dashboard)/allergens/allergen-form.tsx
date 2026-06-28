"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createAllergen, updateAllergen } from "./actions";
import { toast } from "sonner";

type Allergen = { id: string; name: string; icon: string };

interface AllergenFormProps {
  open: boolean;
  onClose: () => void;
  allergen?: Allergen;
}

export function AllergenForm({ open, onClose, allergen }: AllergenFormProps) {
  const [name, setName] = useState(allergen?.name ?? "");
  const [icon, setIcon] = useState(allergen?.icon ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      if (allergen) {
        await updateAllergen(allergen.id, name.trim(), icon.trim());
        toast.success("Alérgeno actualizado");
      } else {
        await createAllergen(name.trim(), icon.trim());
        toast.success("Alérgeno creado");
      }
      onClose();
    } catch {
      toast.error("Error al guardar el alérgeno");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{allergen ? "Editar alérgeno" : "Nuevo alérgeno"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="icon">Icono (emoji)</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="🌾"
                className="w-20 text-center text-xl"
                maxLength={4}
              />
              {icon && <span className="text-2xl">{icon}</span>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Gluten"
              autoFocus
              required
            />
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
