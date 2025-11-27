"use client";

import { Maximize2 } from "lucide-react";
import Calendario from "../Calendario";
import BotaoEditar from "../BotaoEditar";
import { Metrica } from "@/core/metrica";
import BotaoExcluir from "../botoes/BotaoExcluir";

interface CardMetricaProps {
  metrica: Metrica;
  onOpen: () => void;
  onEditar: () => void;
  onExcluir: () => void;
}

export default function CardMetrica({
  metrica,
  onOpen,
  onEditar,
  onExcluir,
}: CardMetricaProps) {
  return (
    <div
      className="relative flex flex-col gap-2 rounded-md p-4 w-full transition ease-in-out duration-100 mb-5"
      key={metrica.id}
      style={{ boxShadow: "0 0 5px rgba(0,0,0,.3)" }}
    >
      <Maximize2
        className="absolute top-2 right-2 cursor-pointer"
        size={19}
        onClick={onOpen}
      />

      <h2 className="text-2xl font-semibold">{metrica.name}</h2>
      <div className="flex flex-row gap-3">
        <p className="bg-zinc-400 text-white rounded-md border-1 border-gray-300 w-fit py-1 px-2 ">
          Modelo ia: {metrica.modelo}
        </p>

        <p className="w-fit py-1 px-2 ">
          <span className="font-semibold">Nota de corte: </span>
          {metrica.notaCorte}
        </p>
      </div>

      <div className="flex justify-between items-center mt-3">
        <Calendario data={metrica.created_at} />

        <div className="flex gap-3">
          <BotaoEditar onClick={onEditar} />
          <BotaoExcluir funcExcluir={onExcluir} item={metrica} tipo="Métrica" />
        </div>
      </div>
    </div>
  );
}
