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


export default function CardLista({ status, categoria, editais, funcaoAtualizarEditais, flagEdital }: Props) {
  // Droppable container com data.containerId = status
  const { setNodeRef } = useDroppable({
    id: status,
    data: { containerId: status },
  });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col w-full max-w-80 min-w-56 gap-4 p-2 border border-gray-200 rounded bg-gray-50 min-h-[160px]"
    >
      <div
        className="flex justify-between items-center mb-2"
    >
        <div className="flex items-center gap-2">
          {categoria.map((c) => (
            <div key={c.nome} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: c.color }} />
              <span className="text-sm text-slate-400">{c.nome}</span>
            </div>
          ))}
        </div>
        <div className="text-sm text-slate-500">{editais.length}</div>
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
