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

interface BotaoExcluirProps {
  titulo: string;
  descricao: string;
  onClick: () => void;
}

export default function BotaoExcluir({
  titulo,
  descricao,
  onClick,
}: BotaoExcluirProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          title={titulo}
          className="h-8 w-8 bg-vermelho hover:bg-vermelho hover:cursor-pointer rounded-sm"
          size={"icon"}
        >
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          <DialogDescription>{descricao}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4 mt-4">
          <DialogClose
            className="transition ease-in-out rounded-md px-3 hover:cursor-pointer"
            style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
          >
            Cancelar
          </DialogClose>
          <Button
            className="flex bg-vermelho hover:bg-vermelho text-white hover:cursor-pointer"
            style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
            onClick={onClick}
          >
            Excluir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
