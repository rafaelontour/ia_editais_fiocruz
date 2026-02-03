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
      className="flex flex-col max-h-full gap-2 pt-2 px-1 rounded-2xl bg-slate-700 overflow-visible"
      style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.6)" }}
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
          <span className="font-semibold text-white text-md">{editais.length}</span>
        </div>
      </div>

      <div className="space-y-3 overflow-y-auto px-1 scrollbar-style pb-2">
          {editais.map((edital) => (
            // PASSA containerId para o cartão (necessário para usar data.containerId no useSortable)
            <CardEdital funcaoAtualizarEditais={funcaoAtualizarEditais} flagEdital={flagEdital} key={edital.id} edital={edital} containerId={status} />
          ))}
      </div>
    </div>
  );
}
