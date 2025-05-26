"use client"

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import CardEditais from "./CardEditais";
import { useDroppable } from "@dnd-kit/core";
import { Edital } from "@/core";
import { StatusEdital } from "@/core/edital/Edital";
//import { useState } from "react";
//import CategoriaColor from "./CategoriaColor";

export interface Categoria {
  nome: string;
  color: string;
}

interface CategoriaColorProps{
    status: StatusEdital;
    categoria: Categoria[];
    editais: Edital[];
}

export default function CardList ({status, categoria , editais} : CategoriaColorProps) {

    /*const statusMapping: Record<string, StatusEdital> = {
        'rascunho': 'rascunho',
        'emconstrucao': 'construcao',
        'emanálise': 'analise',
        'concluído': 'concluido'
    };*/

    const { setNodeRef } = useDroppable({ id: status, data: { status } });

    return(
        <div ref={setNodeRef} className="flex flex-col  w-56 gap-5">
            <div className="flex flex-row justify-between">
                {categoria.map((item) => (
                    <div key={item.nome} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-xs" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-400">{item.nome}</span>
                    </div>
                ))}
                <p>{editais.length}</p>
            </div>
            <SortableContext items={editais.map(e => e.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                    {editais.map((edital) => (
                        <CardEditais key={edital.id} edital={edital} />
                    ))}
                </div>
            </SortableContext>
            
        </div>
    );
}