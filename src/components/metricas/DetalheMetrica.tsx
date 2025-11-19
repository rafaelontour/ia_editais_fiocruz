"use client";

import { Metrica } from "@/core/metrica";
import Calendario from "../Calendario";
import BotaoEditar from "../BotaoEditar";
import BotaoExcluir from "../BotaoExcluir";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

interface CardDetalheMetricaProps {
  metrica: Metrica;
  onEditar: () => void;
  onExcluir: () => void;
  onVoltar: () => void;
}

export default function DetalheMetrica({
  metrica,
  onEditar,
  onExcluir,
  onVoltar,
}: CardDetalheMetricaProps) {
  return (
    <div
      className="w-full p-6 rounded-md bg-white shadow-md flex flex-col gap-6"
      style={{ boxShadow: "0 0 5px rgba(0,0,0,.3)" }}
    >
      <div className="flex flex-row gap-3">
        <Button
          onClick={onVoltar}
          className="h-8 w-8 bg-branco border border-gray-300 hover:bg-branco hover:cursor-pointer rounded-sm"
        >
          <ArrowLeft size={18} color="black" />
        </Button>
        <h2 className="text-2xl font-semibold">{metrica.nome}</h2>
      </div>
      <div className="flex flex-row gap-3">
        <p className="bg-zinc-400 text-white rounded-md border-1 border-gray-300 w-fit py-1 px-2 ">
          Modelo ia: {metrica.modelo}
        </p>

        <p className="w-fit py-1 px-2 ">
          <span className="font-semibold">Nota de corte: </span>
          {metrica.notaCorte}
        </p>
      </div>

      <p>
        <span className="font-semibold">Critérios: </span>
        <br />
        {metrica.criterio}
      </p>

      <p>
        <span className="font-semibold">Passos: </span>
        <br />
        {metrica.passosAvaliacao}
      </p>

      <div className="flex justify-between items-center mt-3">
        <Calendario data={metrica.created_at} />

        <div className="flex gap-3">
          <BotaoEditar onClick={onEditar} />
          <BotaoExcluir
            titulo="Excluir Métrica"
            descricao="Tem certeza que deseja escluir a métrica"
            onClick={onExcluir}
          />
        </div>
      </div>
    </div>
  );
}
