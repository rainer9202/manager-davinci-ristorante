"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Icono</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="w-[100px] text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allergens.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  No hay alérgenos.
                </TableCell>
              </TableRow>
            ) : (
              allergens.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="text-xl">{a.icon}</TableCell>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setEditing(a)}>
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editing && (
        <AllergenForm
          open={!!editing}
          onClose={() => { setEditing(null); onRefresh(); }}
          allergen={editing}
        />
      )}

      <Dialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar alérgeno</DialogTitle>
            <DialogDescription>
              ¿Seguro que quieres eliminar <strong>{deleting?.icon} {deleting?.name}</strong>? Esta acción no se puede deshacer.
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
