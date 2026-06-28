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
import { CategoryForm } from "./category-form";
import { deleteCategory } from "./actions";
import { toast } from "sonner";

type Category = { id: string; name: string; created_at: string };

export function CategoriesTable({
  categories,
  onRefresh,
}: {
  categories: Category[];
  onRefresh: () => void;
}) {
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  async function handleDelete() {
    if (!deleting) return;
    setLoadingDelete(true);
    try {
      await deleteCategory(deleting.id);
      toast.success("Categoría eliminada");
      setDeleting(null);
      onRefresh();
    } catch {
      toast.error("No se puede eliminar: la categoría tiene platos asignados");
    } finally {
      setLoadingDelete(false);
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 col-span-full">
            No hay categorías. Crea la primera.
          </p>
        ) : (
          categories.map((cat) => (
            <Card key={cat.id}>
              <CardContent className="px-4 flex items-center justify-between gap-2">
                <p className="font-medium truncate">{cat.name}</p>
                <div className="flex gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditing(cat)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleting(cat)}
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
        <CategoryForm
          open={!!editing}
          onClose={() => {
            setEditing(null);
            onRefresh();
          }}
          category={editing}
        />
      )}

      <Dialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar categoría</DialogTitle>
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
