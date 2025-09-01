// Teste.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
    DndContext,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import CardListaTeste from "@/components/editais/CardLista";
import type { Edital } from "@/core";
import { StatusEdital } from "@/core/edital/Edital";
import SuperiorEditais from "@/components/editais/SuperiorEditais";
import { definirStatusConcluido, definirStatusEmAnalise, definirStatusEmConstrucao, definirStatusRascunho, getEditaisService } from "@/service/edital";
import { toast } from "sonner";
import CardLista from "@/components/editais/CardLista";

export default function Editais() {
    const [montado, setMontado] = useState<boolean>(false);
    const [adicionouNovoEdital, setAdicionouNovoEdital] = useState<boolean>(false);
    const statuses: StatusEdital[] = ["PENDING", "UNDER_CONSTRUCTION", "WAITING_FOR_REVIEW", "COMPLETED"];
    
    const [columns, setColumns] = useState<Record<StatusEdital, Edital[]>>({
        PENDING: [],
        UNDER_CONSTRUCTION: [],
        WAITING_FOR_REVIEW: [],
        COMPLETED: [],
    });
    
    useEffect(() => {
        getEditais();
        setMontado(true);
    }, [])

    useEffect(() => {
        getEditais();
    }, [adicionouNovoEdital])

    async function moverParaRascunho(editalId: string) {
        const resposta = await definirStatusRascunho(editalId);

        if (resposta !== 200) {
            toast.error("Erro ao mover para rascunho");
            return
        }

    }

    async function moverParaEmConstrucao(editalId: string) {
        const resposta = await definirStatusEmConstrucao(editalId);

        if (resposta !== 200) {
            toast.error("Erro ao mover para em construção");
            return
        }

    }

    async function moverParaEmAnalise(editalId: string) {
        const resposta = await definirStatusEmAnalise(editalId);

        if (resposta !== 200) {
            toast.error("Erro ao mover para em análise");
            return
        }

    }

    async function moverParaConcluido(editalId: string) {
        const resposta = await definirStatusConcluido(editalId);

        if (resposta !== 200) {
            toast.error("Erro ao mover para concluído");
            return
        }

    }

    const getEditais = async () => {
        try {
            const resposta = await getEditaisService();
            const dados = resposta || [];

            // Agrupa os editais por status
            const novasColunas: Record<StatusEdital, Edital[]> = {
                PENDING: [],
                UNDER_CONSTRUCTION: [],
                WAITING_FOR_REVIEW: [],
                COMPLETED: [],
            };

            dados.forEach((edital) => {
                // garante que o status bate com a chave
                if (statuses.includes(edital.status as StatusEdital)) {
                    novasColunas[edital.status as StatusEdital].push(edital);
                }
            });

            setColumns(novasColunas);
        } catch (error) {
            console.error("Erro ao buscar editais", error);
        }
    };
    
    // sensor para melhorar ativação do drag
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    // id do item sendo arrastado (para o DragOverlay)
    const [activeId, setActiveId] = useState<string | null>(null);

    const findItem = (id: string) => {
        for (const s of statuses) {
            const found = columns[s].find((c) => c.id === id);
            if (found) return found;
        }
        return undefined;
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(String(event.active.id));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        // origem e destino (containerId) vindos do data do useSortable/useDroppable
        const activeContainer = active.data.current?.containerId as StatusEdital | undefined;
        const overContainer = over.data.current?.containerId as StatusEdital | undefined;

        // se não tiver container info, aborta
        if (!activeContainer || !overContainer) return;

        // mesma coluna: reordenar (se over é container vazio -> move para final)
        if (activeContainer === overContainer) {
            setColumns((prev) => {
                const col = [...prev[activeContainer]];
                const oldIndex = col.findIndex((i) => i.id === activeId);
                const overIndex = col.findIndex((i) => i.id === overId);

                // se soltou no espaço da coluna (overIndex === -1), coloca no final
                if (overIndex === -1) {
                    if (oldIndex === -1) return prev;
                    const [moved] = col.splice(oldIndex, 1);
                    col.push(moved);

                    return { ...prev, [activeContainer]: col };
                } 

                // reordena dentro da coluna
                if (oldIndex === -1) return prev;
                const reordered = arrayMove(col, oldIndex, overIndex);
                return { ...prev, [activeContainer]: reordered };
            });
            return;
        }

        // containers diferentes -> mover entre colunas
        setColumns(prev => {
            const sameColumn = activeContainer === overContainer;

            if (sameColumn) {
                const items = [...prev[activeContainer]];
                const oldIndex = items.findIndex(i => i.id === activeId);
                if (oldIndex === -1) return prev;

                const [moved] = items.splice(oldIndex, 1); // remove primeiro

                // agora procura o overId NO ARRAY JÁ SEM O ITEM
                const idx = items.findIndex(i => i.id === overId);
                const newIndex = idx === -1 ? items.length : idx;

                items.splice(newIndex, 0, moved);

                return { ...prev, [activeContainer]: items };
            }

            // movimento entre colunas diferentes
            const source = [...prev[activeContainer]];
            const dest = [...prev[overContainer]];

            const oldIndex = source.findIndex(i => i.id === activeId);
            if (oldIndex === -1) return prev;
            
            const [movedItem] = source.splice(oldIndex, 1);
            
            const overIndex = dest.findIndex(i => i.id === overId);
            const insertIndex = overIndex === -1 ? dest.length : overIndex;
            
            dest.splice(insertIndex, 0, { ...movedItem, status: overContainer });

            if (overContainer === "PENDING") {
                moverParaRascunho(movedItem.id);
            }

            if (overContainer === "UNDER_CONSTRUCTION") {
                moverParaEmConstrucao(movedItem.id);
            }
            
            if (overContainer === "WAITING_FOR_REVIEW") {
                moverParaEmAnalise(movedItem.id);
            }

            if (overContainer === "COMPLETED") {
                moverParaConcluido(movedItem.id);
            }

            return { 
                ...prev, 
                [activeContainer]: source, 
                [overContainer]: dest 
            };
        });

    };

    const formatStatus = (status: StatusEdital): string => {
        switch (status) {
            case "PENDING":
                return "Rascunho";
            case "UNDER_CONSTRUCTION":
                return "Em construção";
            case "WAITING_FOR_REVIEW":
                return "Em Análise";
            case "COMPLETED":
                return "Concluído";
        }
    };

    const getStatusColor = (status: StatusEdital): string => {
        switch (status) {
            case "PENDING":
                return "#99A1AF";
            case "UNDER_CONSTRUCTION":
                return "red";
            case "WAITING_FOR_REVIEW":
                return "#656149";
            case "COMPLETED":
                return "darkgreen";
        }
    };

    return (
        montado &&
        <div className="flex flex-col gap-4">

            <SuperiorEditais funcaoAtualizarEditais={setAdicionouNovoEdital} flagEdital={adicionouNovoEdital} />

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div
                    className="flex justify-between relative gap-4"
                >
                    {statuses.map((status) => (
                        <div className="w-full max-w-80 min-w-56" key={status}>
                            <SortableContext items={columns[status].map((c) => c.id)} strategy={verticalListSortingStrategy}>
                                <CardLista
                                    funcaoAtualizarEditais={setAdicionouNovoEdital}
                                    flagEdital={adicionouNovoEdital}
                                    status={status}
                                    categoria={[{ nome: formatStatus(status), color: getStatusColor(status) }]}
                                    editais={columns[status]}
                                />
                            </SortableContext>
                        </div>
                    ))}
                </div>

                {/* Drag overlay: renderiza por cima tudo enquanto arrasta */}
                <DragOverlay>
                    {activeId ? (
                        // renderiza uma cópia visual leve do item arrastado
                        <div className="bg-white p-3 w-full min-w-56 max-w-80 rounded shadow-lg">
                            {(() => {
                                const item = findItem(activeId);
                                if (!item) return null;
                                return (
                                    <>
                                        <div className="h-16 bg-gray-200 rounded-sm mb-2" />
                                        <div>
                                            <h3 className="font-semibold">{item.name}</h3>
                                            <p className="text-sm text-gray-600">Data: {item.created_at}</p>
                                            <p className="text-sm text-gray-600">Categoria: Comprass</p>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
