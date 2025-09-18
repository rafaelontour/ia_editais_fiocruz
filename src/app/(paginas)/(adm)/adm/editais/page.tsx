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
import type { Edital } from "@/core";
import { StatusEdital } from "@/core/edital/Edital";
import SuperiorEditais from "@/components/editais/SuperiorEditais";
import { definirStatusConcluido, definirStatusEmAnalise, definirStatusEmConstrucao, definirStatusRascunho, getEditaisService } from "@/service/edital";
import { toast } from "sonner";
import CardLista from "@/components/editais/CardLista";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

    // NOVO: estado para guardar movimentação pendente
    const [pendingMove, setPendingMove] = useState<{
        item: Edital
        from: StatusEdital
        to: StatusEdital
        overId: string | null
    } | null>(null);

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
            console.log(resposta);
            if (!resposta) throw new Error();

            const dados = resposta || [];

            const novasColunas: Record<StatusEdital, Edital[]> = {
                PENDING: [],
                UNDER_CONSTRUCTION: [],
                WAITING_FOR_REVIEW: [],
                COMPLETED: [],
            };

            dados.forEach((edital) => {
                const status = edital.history?.[0]?.status as StatusEdital;

                if (status && statuses.includes(status)) {
                    novasColunas[status].push(edital);
                }
            });

            setColumns(novasColunas);
        } catch (e) {
            toast.error("Erro ao buscar editais!");
        }
    };


    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
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

        const activeContainer = active.data.current?.containerId as StatusEdital | undefined;
        const overContainer = over.data.current?.containerId as StatusEdital | undefined;

        if (!activeContainer || !overContainer) return;

        // mesma coluna: reordenar
        if (activeContainer === overContainer) {
            setColumns((prev) => {
                const col = [...prev[activeContainer]];
                const oldIndex = col.findIndex((i) => i.id === activeId);
                const overIndex = col.findIndex((i) => i.id === overId);

                if (overIndex === -1) {
                    if (oldIndex === -1) return prev;
                    const [moved] = col.splice(oldIndex, 1);
                    col.push(moved);

                    return { ...prev, [activeContainer]: col };
                }

                if (oldIndex === -1) return prev;
                const reordered = arrayMove(col, oldIndex, overIndex);
                return { ...prev, [activeContainer]: reordered };
            });
            return;
        }

        // containers diferentes: aqui adicionamos confirmação
        setColumns(prev => {
            const source = [...prev[activeContainer]];
            const dest = [...prev[overContainer]];

            const oldIndex = source.findIndex(i => i.id === activeId);
            if (oldIndex === -1) return prev;

            const [movedItem] = source.splice(oldIndex, 1);

            // guarda movimentação pendente e abre Dialog
            setPendingMove({
                item: movedItem,
                from: activeContainer,
                to: overContainer,
                overId: overId,
            });

            // não move nada ainda
            return prev;
        });
    };

    // confirma a movimentação
    const confirmMove = () => {
        if (!pendingMove) return;

        setColumns(prev => {
            const source = [...prev[pendingMove.from]];
            const dest = [...prev[pendingMove.to]];

            const overIndex = pendingMove.overId
                ? dest.findIndex(i => i.id === pendingMove.overId)
                : -1;
            const insertIndex = overIndex === -1 ? dest.length : overIndex;

            dest.splice(insertIndex, 0, { ...pendingMove.item, status: pendingMove.to });

            if (pendingMove.to === "PENDING") moverParaRascunho(pendingMove.item.id);
            if (pendingMove.to === "UNDER_CONSTRUCTION") moverParaEmConstrucao(pendingMove.item.id);
            if (pendingMove.to === "WAITING_FOR_REVIEW") moverParaEmAnalise(pendingMove.item.id);
            if (pendingMove.to === "COMPLETED") moverParaConcluido(pendingMove.item.id);

            return {
                ...prev,
                [pendingMove.from]: source.filter(i => i.id !== pendingMove.item.id),
                [pendingMove.to]: dest,
            };
        });

        setPendingMove(null);
    };

    const cancelMove = () => setPendingMove(null);

    const formatStatus = (status: StatusEdital | undefined): string => {
        switch (status) {
            case "PENDING": return "Rascunho";
            case "UNDER_CONSTRUCTION": return "Em construção";
            case "WAITING_FOR_REVIEW": return "Em Análise";
            case "COMPLETED": return "Concluído";
            default: return "";
        }
    };

    const getStatusColor = (status: StatusEdital): string => {
        switch (status) {
            case "PENDING": return "#99A1AF";
            case "UNDER_CONSTRUCTION": return "red";
            case "WAITING_FOR_REVIEW": return "#656149";
            case "COMPLETED": return "darkgreen";
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
                <div className="flex justify-between relative gap-4">
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

                <DragOverlay>
                    {activeId ? (
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

            {/* DIALOG DE CONFIRMAÇÃO */}
            <Dialog open={!!pendingMove} onOpenChange={cancelMove}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar movimentação</DialogTitle>
                    </DialogHeader>
                    <p>
                        Tem certeza que deseja mover <strong>{pendingMove?.item.name}</strong> para <strong>{formatStatus(pendingMove?.to || undefined)}</strong>?
                    </p>
                    <DialogFooter className="flex justify-end gap-2">
                        <Button variant="outline" className="hover:cursor-pointer" onClick={cancelMove}>Cancelar</Button>
                        <Button className="bg-vermelho text-white hover:cursor-pointer" onClick={confirmMove}>Confirmar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
