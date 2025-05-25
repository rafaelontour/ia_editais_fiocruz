"use client"

import { useState } from "react";
import CardList from "./CardList";
//import CategoriaColor from "./CategoriaColor";
import SuperiorEditais from "./SuperiorEditais";
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { Edital, StatusEdital } from "./types";

export default function MeusEditais () {

    // Estado dos editais
    const [editais, setEditais] = useState<Edital[]>([
        { id: '1', titulo: 'Edital Fiocruz 2023/2', status: 'rascunho', data: '25/02/2025', categoria: 'compras' },
        { id: '2', titulo: 'Edital Fiocruz 2023/2', status: 'rascunho', data: '25/02/2025', categoria: 'compras' },
    ]);

    // Status disponíveis
    const statuses: StatusEdital[] = ['rascunho', 'construcao', 'analise', 'concluido'];

    // Atualiza o status quando o card é arrastado
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const editalId = active.id;
        const newStatus = over.id as StatusEdital;

        setEditais(editais.map(edital =>
        edital.id === editalId ? { ...edital, status: newStatus } : edital
        ));
    };

  // Auxiliares para formatação
    const formatStatus = (status: StatusEdital): string => {
        switch (status) {
            case 'rascunho': return 'Rascunho';
            case 'construcao': return 'Em construção';
            case 'analise': return 'Em Análise';
            case 'concluido': return 'Concluído';
        }
    };

    const getStatusColor = (status: StatusEdital): string => {
        switch (status) {
            case 'rascunho': return 'gray';
            case 'construcao': return 'red';
            case 'analise': return '#656149';
            case 'concluido': return 'darkgreen';
        }   
    }

    return(
        <div className="flex flex-1 flex-col gap-10 ">
            <div className="h-fit">
                <SuperiorEditais/>
            </div>
            <DndContext onDragEnd={handleDragEnd}>
                <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2 w-[90%]">
                
                    {statuses.map((status) => (
                        <CardList
                            key={status}
                            status={status}
                            categoria={[{ nome: formatStatus(status), color: getStatusColor(status) }]}
                            editais={editais.filter(edital => edital.status === status)}
                        />
                    ))}
                
                </div>
            </DndContext>
        </div>
    );
} 