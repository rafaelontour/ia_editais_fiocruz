"use client";
import { Trash } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useState } from "react";
import { Fonte, Ramo, Taxonomia, Tipificacao } from "@/core";
import { Teste } from "@/core/teste";
import { Metrica } from "@/core/metrica";
import { Caso } from "@/core/caso";
import { Modelo } from "@/core/modelo";

interface BotaoExcluirProps {
  tipo: string;
  item:
    | Fonte
    | Tipificacao
    | Taxonomia
    | Ramo
    | Teste
    | Metrica
    | Caso
    | Modelo;
  funcExcluir: (id: string) => void;
}

export default function BotaoExcluir(dados: BotaoExcluirProps) {
  const [dialogOpen, setDialogOpen] = useState<string | undefined>("");

  return (
    <Dialog
      open={dialogOpen === dados.item.id}
      onOpenChange={(open) => setDialogOpen(open ? dados.item.id : undefined)}
    >
      <DialogTrigger asChild>
        <Button
          data-cy="componente-excluir"
          title={`Excluir ${dados.item}`}
          className="h-8 w-8 bg-vermelho hover:bg-vermelho hover:cursor-pointer rounded-sm"
          size={"icon"}
        >
          <Trash />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir {dados.tipo}</DialogTitle>

          <DialogDescription>
            Tem certeza que deseja excluir a {dados.tipo}{" "}
            <strong>{dados.item.name ?? dados.item.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-4 mt-4">
          <DialogClose
            className="transition ease-in-out rounded-md px-3 hover:cursor-pointer"
            style={{ boxShadow: "0 0 3px rgba(0, 0, 0, 0.5)" }}
          >
            Cancelar
          </DialogClose>

          <Button
            className="flex bg-vermelho hover:bg-vermelho text-white hover:cursor-pointer"
            style={{ boxShadow: "0 0 3px rgba(0, 0, 0, 0.5)" }}
            onClick={() => dados.funcExcluir(dados.item.id!)}
          >
            Excluir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
