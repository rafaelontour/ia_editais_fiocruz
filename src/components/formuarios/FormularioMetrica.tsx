import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface FormularioMetricaProps {
  initialData?: {
    id: number;
    nome: string;
    modelo: string;
    notaCorte: number;
    criterio: string;
    passosAvaliacao: string;
  };
  onSubmit: (data: any) => void;
  mode?: "create" | "edit";
}

export default function FormularioMetrica({
  initialData,
  onSubmit,
  mode = "create",
}: FormularioMetricaProps) {
  const [formState, setFormState] = useState({
    nome: "",
    modelo: "",
    notaCorte: 0,
    criterio: "",
    passosAvaliacao: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormState({
        nome: initialData.nome,
        modelo: initialData.modelo,
        notaCorte: initialData.notaCorte,
        criterio: initialData.criterio,
        passosAvaliacao: initialData.passosAvaliacao,
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
        <Label>Nome da métrica</Label>
        <Input
          value={formState.nome}
          onChange={(e) => setFormState({ ...formState, nome: e.target.value })}
        />
      </div>

      <div className="flex justify-between gap-2">
        <div className="flex flex-col gap-2 w-1/2">
          <Label>Modelo de ia</Label>
          <Select
            value={formState.modelo}
            onValueChange={(valor) =>
              setFormState({ ...formState, modelo: valor })
            }
          >
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="teste">
                Teste
              </SelectItem>
              <SelectItem className="cursor-pointer" value="teste2">
                Teste2
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2 w-1/2">
          <Label>Nota de corte</Label>
          <Input
            type="number"
            value={formState.notaCorte}
            onChange={(e) =>
              setFormState({ ...formState, notaCorte: Number(e.target.value) })
            }
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Critério da métrica</Label>
        <textarea
          className="border rounded p-2 text-sm"
          value={formState.criterio}
          onChange={(e) =>
            setFormState({ ...formState, criterio: e.target.value })
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Passos de avaliação da métrica</Label>
        <textarea
          className="border rounded p-2 text-sm"
          value={formState.passosAvaliacao}
          onChange={(e) =>
            setFormState({ ...formState, passosAvaliacao: e.target.value })
          }
        />
      </div>

      <DialogFooter>
        <Button
          className="flex bg-vermelho hover:bg-vermelho text-white hover:cursor-pointer"
          type="button"
          variant="outline"
        >
          Cancelar
        </Button>
        <Button type="submit" className="bg-verde text-white ">
          {mode === "create" ? "Salvar" : "Atualizar"}
        </Button>
      </DialogFooter>
    </form>
  );
}
