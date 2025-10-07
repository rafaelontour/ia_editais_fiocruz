"use client";

import React, { Dispatch, SetStateAction } from "react";
import { useDroppable } from "@dnd-kit/core";
import type { Edital } from "@/core";
import { StatusEdital } from "@/core/edital/Edital";
import CardEdital from "./CardEdital";

export interface Categoria {
  nome: string;
  color: string;
}

interface Props {
  status: StatusEdital;
  categoria: Categoria[];
  editais: Edital[];
  funcaoAtualizarEditais: Dispatch<SetStateAction<boolean>>;
  flagEdital: boolean
}

const getStatusColor = (status: StatusEdital): string => {
  switch (status) {
      case "PENDING": return "#99A1AF";
      case "UNDER_CONSTRUCTION": return "red";
      case "WAITING_FOR_REVIEW": return "#656149";
      case "COMPLETED": return "darkgreen";
  }
};


export default function CardLista({ status, categoria, editais, funcaoAtualizarEditais, flagEdital }: Props) {
  // Droppable container com data.containerId = status
  const { setNodeRef } = useDroppable({
    id: status,
    data: { containerId: status },
  });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col gap-4 p-2 border border-gray-200 rounded-2xl bg-slate-600"
    >
      <div
        className="flex justify-between mx-2 mt-2 items-center mb-2"
      >
        <div className="flex items-center gap-2">
          {categoria.map((c) => (
            <div key={c.nome} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: c.color }} />
              <span className="text-xl text-white">{c.nome}</span>
            </div>
          ))}
        </div>

        <div className={`flex items-center justify-center w-6 h-6 bg-black rounded-full`}>
          <span className="font-semibold text-white text-md mt-0.5">{editais.length}</span>
        </div>
      </div>

      <div className="space-y-3">
        {editais.map((edital) => (
          // PASSA containerId para o cartão (necessário para usar data.containerId no useSortable)
          <CardEdital funcaoAtualizarEditais={funcaoAtualizarEditais} flagEdital={flagEdital} key={edital.id} edital={edital} containerId={status} />
        ))}
      </div>
    </div>
  );
}
