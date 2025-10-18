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
import useUsuario from "@/data/hooks/useUsuario";
import { formatarData } from "@/lib/utils";

export default function Editais() {
    const [montado, setMontado] = useState<boolean>(false);
    const [adicionouNovoEdital, setAdicionouNovoEdital] = useState<boolean>(false);
    const statuses: StatusEdital[] = ["PENDING", "UNDER_CONSTRUCTION", "WAITING_FOR_REVIEW", "COMPLETED"];
    const { usuario } = useUsuario();

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

    const isDialogOpen = pendingMove !== null;

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

        if ( // Somente ADM e ANALIST podem mover de RASCUNHO -> EM CONSTRUÇÃO -> EM ANALISE
            (
                activeContainer === "PENDING" && (overContainer === "UNDER_CONSTRUCTION" || overContainer === "WAITING_FOR_REVIEW" || overContainer === "COMPLETED") ||
                activeContainer === "UNDER_CONSTRUCTION" && (overContainer === "PENDING" || overContainer === "WAITING_FOR_REVIEW" || overContainer === "COMPLETED") ||
                activeContainer === "WAITING_FOR_REVIEW" && overContainer === "PENDING"
            ) &&
            !(usuario?.access_level === "ANALYST" || usuario?.access_level === "ADMIN")
        ) {
            toast.info("Você não tem permissão para mover este edital para esta coluna.");
            return;
        }

        if (activeContainer === "WAITING_FOR_REVIEW" && (overContainer === "UNDER_CONSTRUCTION" || overContainer === "PENDING" || overContainer === "COMPLETED") && usuario?.access_level === "ANALYST") {
            toast.info("Você não tem permissão para mover este edital para esta coluna.");
            return;
        }

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

        // colunas diferentes: mover
        if (activeContainer !== overContainer) {
            const source = columns[activeContainer];
            const oldIndex = source.findIndex(i => i.id === activeId);
            if (oldIndex === -1) return;
            
            const movedItem = source[oldIndex];

            // guarda a movimentação pendente e abre o diálogo
            setPendingMove({
                item: movedItem,
                from: activeContainer,
                to: overContainer,
                overId: overId,
            });

            return; // <-- não chama setColumns aqui!
        }

    };

    // confirma a movimentação
    const confirmMove = () => {
        if (!pendingMove) return;

        // Atualiza colunas primeiro
        setColumns(prev => {
            const source = structuredClone(prev[pendingMove.from]);
            const dest = structuredClone(prev[pendingMove.to]);

            const overIndex = pendingMove.overId
                ? dest.findIndex(i => i.id === pendingMove.overId)
                : -1;
            const insertIndex = overIndex === -1 ? dest.length : overIndex;

            const movedItem = structuredClone(pendingMove.item);
            movedItem.status = pendingMove.to;

            dest.splice(insertIndex, 0, movedItem);

            return {
                ...prev,
                [pendingMove.from]: source.filter(i => i.id !== movedItem.id),
                [pendingMove.to]: dest,
            };
        });

        // Guarda a referência antes de limpar pendingMove
        const move = pendingMove;
        setPendingMove(null);

        // 🔹 Chama o backend fora do setState
        switch (move.to) {
            case "PENDING":
                moverParaRascunho(move.item.id);
                break;
            case "UNDER_CONSTRUCTION":
                moverParaEmConstrucao(move.item.id);
                break;
            case "WAITING_FOR_REVIEW":
                moverParaEmAnalise(move.item.id);
                break;
            case "COMPLETED":
                moverParaConcluido(move.item.id);
                break;
        }

        setTimeout(() => {
            getEditais();
        }, 300);
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
        <div className="flex flex-col h-full relative gap-4">

            <SuperiorEditais funcaoAtualizarEditais={setAdicionouNovoEdital} flagEdital={adicionouNovoEdital} />

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex justify-between h-[85%] relative gap-3">
                    {statuses.map((status) => (
                        <div className="w-full" key={status}>
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
                        <div className="bg-white p-3 rounded shadow-l teste2">
                            {(() => {
                                const item = findItem(activeId);
                                if (!item) return null;
                                return (
                                    <>
                                        <div className="h-16 bg-gray-200 rounded-sm mb-2" />
                                        <div>
                                            <h3 className="font-semibold">{item.name}</h3>
                                            <p className="text-sm text-gray-600">Data: {formatarData(item.created_at)}</p>
                                            <p className="text-sm text-gray-600">{(item.editors && item.editors.length > 1) ? "Responsáveis" : "Responsável"}: {(item.editors ?? []).map(e => e.username).join(", ")}</p>
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
                        <Button type="button" className="bg-vermelho text-white hover:cursor-pointer" onClick={() => confirmMove()}>Confirmar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {
                columns["PENDING"].length === 0 &&
                columns["UNDER_CONSTRUCTION"].length === 0 &&
                columns["WAITING_FOR_REVIEW"].length === 0 &&
                columns["COMPLETED"].length === 0 &&
                <div className="flex justify-center items-center h-80">
                    <p className="text-xl animate-pulse">Nenhum edital cadastrado</p>
                </div>
            }
        </div>
    );
}
