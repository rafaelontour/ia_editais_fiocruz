import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect } from "react";

interface FormularioTesteProps {
  initialData?: { id: number; name: string; descricao: string } | null;
  onSubmit: (data: any) => void;
  mode?: "create" | "edit";
}

export default function FormularioTeste({
  initialData,
  onSubmit,
  mode = "create",
}: FormularioTesteProps) {
  const [formState, setFormState] = useState({
    name: "",
    descricao: "",
  });

  // Preenche o form quando estiver em modo EDITAR
  useEffect(() => {
    if (initialData) {
      setFormState({
        name: initialData.name,
        descricao: initialData.descricao,
      });
    }
  }, [initialData]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(formState);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-lg">
      <div className="flex flex-col gap-2">
        <Label>Nome do Teste</Label>
        <Input
          value={formState.name}
          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Descrição</Label>
        <textarea
          className="border rounded p-2 text-sm"
          value={formState.descricao}
          onChange={(e) =>
            setFormState({ ...formState, descricao: e.target.value })
          }
        />
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          type="button"
          className="flex bg-vermelho hover:bg-vermelho text-white hover:cursor-pointer"
        >
          Cancelar
        </Button>
        <Button type="submit" className="bg-verde text-white">
          {mode === "create" ? "Salvar" : "Atualizar"}
        </Button>
      </DialogFooter>
    </form>
  );
}
