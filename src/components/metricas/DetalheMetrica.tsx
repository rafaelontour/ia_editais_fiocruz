"use client";

import { Metrica } from "@/core/metrica";
import Calendario from "../Calendario";

import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import BotaoExcluir from "../BotaoExcluir";
import BotaoEditar from "../BotaoEditar";

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
        <h2 className="text-2xl font-semibold">{metrica.name}</h2>
      </div>

      <p>
        <span className="font-semibold">Nota de corte: </span>
        {metrica.threshold}
      </p>

      <p>
        <span className="font-semibold">Critérios: </span>
        <br />
        {metrica.criteria}
      </p>

      <p>
        <span className="font-semibold">Passos: </span>
        <br />
        {metrica.evaluation_steps}
      </p>

      <div className="flex justify-between items-center mt-3">
        <Calendario data={metrica.created_at} />

        <div className="flex gap-3">
          <BotaoEditar onClick={onEditar} title="Editar Métrica" />
          <BotaoExcluir funcExcluir={onExcluir} item={metrica} tipo="métrica" />
        </div>
      </div>
    </div>
  );
}
