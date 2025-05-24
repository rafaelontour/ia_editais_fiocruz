"use client"

import CardEditais from "@/components/editais/CardEditais";
import CardList from "@/components/editais/CardList";
import SuperiorEditais from "@/components/editais/SuperiorEditais";
import { Edital, StatusEdital } from "@/components/editais/types";
import { closestCenter, DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { useState } from "react";

export default function MeusEditais () {

    // Estado dos editais (exemplo com dados iniciais)
    const [editais, setEditais] = useState<Edital[]>([
        { id: '1', titulo: 'Edital Fiocruz 2023/2', status: 'rascunho', data: '26/02/2025', categoria: 'compras' },
        { id: '2', titulo: 'Edital Fiocruz 2024/1', status: 'rascunho', data: '25/02/2025', categoria: 'compras' },
        { id: '3', titulo: 'Edital Fiocruz 2025/1', status: 'rascunho', data: '25/02/2025', categoria: 'compras' },
        { id: '4', titulo: 'Edital Fiocruz 2023/1', status: 'construcao', data: '25/02/2025', categoria: 'compras' },
        { id: '5', titulo: 'Edital Fiocruz 2022/2', status: 'analise', data: '25/02/2025', categoria: 'compras' },
        { id: '6', titulo: 'Edital Fiocruz 2022/1', status: 'analise', data: '25/02/2025', categoria: 'compras' },
    ]);

    const [activeId, setActiveId] = useState<string | null>(null);


    // Status disponíveis
    const statuses: StatusEdital[] = ['rascunho', 'construcao', 'analise', 'concluido'];
    
    // Atualiza o status quando o card é arrastado
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over?.data?.current?.status){
            setActiveId(null);
            return; 
        } // nada muda — o card original já não saiu da lista

        const editalId = active.id;
        const newStatus = over.id as StatusEdital;

        setEditais(editais.map(edital =>
        edital.id === editalId ? { ...edital, status: newStatus } : edital
        ));
        setActiveId(null);
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
            
            <DndContext 
                onDragStart={e => setActiveId(e.active.id as string)}
                onDragEnd={handleDragEnd}
                onDragCancel={() => setActiveId(null)}
                collisionDetection={closestCenter}
            >
                
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
                <DragOverlay>
                    {activeId ? (
                    <CardEditais
                        key={activeId}
                        edital={editais.find(e => e.id === activeId)!}
                    />
                    ) : null}
                </DragOverlay>
            </DndContext>
           
                
        </div>
    );
} 