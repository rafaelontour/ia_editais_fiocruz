"use client";

import { Caso } from "@/core/caso";
import Calendario from "../Calendario";
import BotaoEditar from "../BotaoEditar";
import BotaoExcluir from "../BotaoExcluir";
import { Maximize2 } from "lucide-react";

interface CardCasoProps {
  caso: Caso;
  onOpen: () => void;
  onEditar: () => void;
  onExcluir: () => void;
}

export default function CardCaso({
  caso,
  onOpen,
  onEditar,
  onExcluir,
}: CardCasoProps) {
  return (
    <div
      style={{ boxShadow: "0 0 5px rgba(0,0,0,.3)" }}
      key={caso.id}
      className="relative flex flex-col gap-2 rounded-md p-4 w-full transition ease-in-out duration-100 mb-5"
    >
      <Maximize2
        className="absolute top-2 right-2 cursor-pointer"
        size={19}
        onClick={onOpen}
      />
      <h2 className="text-2xl font-semibold">{caso.nome}</h2>
      <p className="bg-zinc-400 text-white rounded-md border-1 border-gray-300 w-fit py-1 px-2">
        <span>Teste:</span> {caso.teste}
      </p>

      <p className="bg-zinc-400 text-white rounded-md border-1 border-gray-300 w-fit py-1 px-2">
        <span>Ramo:</span> {caso.ramo}
      </p>

      <div className="flex justify-between items-center mt-3">
        <Calendario data={caso.created_at} />

        <div className="flex gap-3">
          <BotaoEditar onClick={onEditar} />

          <BotaoExcluir
            titulo="Excluir Teste"
            descricao="Tem certeza que deseja excluir o teste"
            onClick={onExcluir}
          />
        </div>
      </div>
    </div>
  );
}
