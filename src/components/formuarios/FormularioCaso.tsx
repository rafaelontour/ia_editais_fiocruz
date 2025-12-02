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

interface FormularioCasoProps {
  initialData?: {
    id: number;
    name: string;
    taxonomia: string;
    tipificacao: string;
    ramo: string;
    teste: string;
    conformidade: string;
    feedbackEsperado: string;
    textoEntrada: string;
    created_at?: string;
  };
  onSubmit: (data: any) => void;
  mode?: "create" | "edit";
}

export default function FormularioCaso({
  initialData,
  onSubmit,
  mode = "create",
}: FormularioCasoProps) {
  const [formState, setFormState] = useState({
    name: "",
    taxonomia: "",
    tipificacao: "",
    ramo: "",
    teste: "",
    conformidade: "",
    feedbackEsperado: "",
    textoEntrada: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormState({
        name: initialData.name,
        taxonomia: initialData.taxonomia,
        tipificacao: initialData.tipificacao,
        ramo: initialData.ramo,
        teste: initialData.teste,
        conformidade: initialData.conformidade,
        feedbackEsperado: initialData.feedbackEsperado,
        textoEntrada: initialData.textoEntrada,
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
        <Label>Nome do caso</Label>
        <Input
          value={formState.name}
          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Taxonomia associada</Label>
        <Select
          value={formState.taxonomia}
          onValueChange={(valor) =>
            setFormState({ ...formState, taxonomia: valor })
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
      <div className="flex flex-col gap-2">
        <Label>Tipificação associada</Label>
        <Select
          value={formState.tipificacao}
          onValueChange={(valor) =>
            setFormState({ ...formState, tipificacao: valor })
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
      <div className="flex flex-col gap-2">
        <Label>Ramo associada</Label>
        <Select
          value={formState.ramo}
          onValueChange={(valor) => setFormState({ ...formState, ramo: valor })}
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
      <div className="flex justify-between gap-2">
        <div className="flex flex-col gap-2 w-1/2">
          <Label>Teste associado</Label>
          <Input
            value={formState.teste}
            onChange={(e) =>
              setFormState({ ...formState, teste: e.target.value })
            }
          />
        </div>

        <div className="flex flex-col gap-2 w-1/2">
          <Label>Conformidade com o ramo?</Label>
          <Input
            value={formState.conformidade}
            onChange={(e) =>
              setFormState({ ...formState, conformidade: e.target.value })
            }
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Feedback esperado</Label>
        <textarea
          className="border rounded p-2 text-sm"
          value={formState.feedbackEsperado}
          onChange={(e) =>
            setFormState({ ...formState, feedbackEsperado: e.target.value })
          }
          rows={2.5}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Texto de entrada</Label>
        <textarea
          className="border rounded p-2 text-sm"
          value={formState.textoEntrada}
          onChange={(e) =>
            setFormState({ ...formState, textoEntrada: e.target.value })
          }
          rows={2.5}
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
        <Button type="submit" className="bg-verde text-white cursor-pointer">
          {mode === "create" ? "Salvar" : "Atualizar"}
        </Button>
      </DialogFooter>
    </form>
  );
}
