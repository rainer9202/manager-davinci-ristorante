"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { AllergenForm } from "./allergen-form";
import { deleteAllergen } from "./actions";
import { toast } from "sonner";

type Allergen = { id: string; name: string; icon: string };

export function AllergensTable({
  allergens,
  onRefresh,
}: {
  allergens: Allergen[];
  onRefresh: () => void;
}) {
  const [editing, setEditing] = useState<Allergen | null>(null);
  const [deleting, setDeleting] = useState<Allergen | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  async function handleDelete() {
    if (!deleting) return;
    setLoadingDelete(true);
    try {
      await deleteAllergen(deleting.id);
      toast.success("Alérgeno eliminado");
      setDeleting(null);
      onRefresh();
    } catch {
      toast.error("Error al eliminar el alérgeno");
    } finally {
      setLoadingDelete(false);
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {allergens.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 col-span-full">
            No hay alérgenos.
          </p>
        ) : (
          allergens.map((a) => (
            <Card key={a.id}>
              <CardContent className="px-4 flex items-center justify-between gap-2">
                <p className="font-medium truncate">{a.name}</p>
                <div className="flex gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditing(a)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleting(a)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {editing && (
        <AllergenForm
          open={!!editing}
          onClose={() => {
            setEditing(null);
            onRefresh();
          }}
          allergen={editing}
        />
      )}

      <Dialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar alérgeno</DialogTitle>
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
