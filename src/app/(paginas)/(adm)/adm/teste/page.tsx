"use client";

import React, { useState } from "react";
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

export default function Teste() {
  const [columns, setColumns] = useState<Record<StatusEdital, Edital[]>>({
    PENDING: [
      { id: "1", name: "Edital 1", status: "PENDING", created_at: "25/02/2025", categoria: "compras" },
      { id: "2", name: "Edital 2", status: "PENDING", created_at: "25/02/2025", categoria: "compras" },
    ],
    UNDER_CONSTRUCTION: [],
    WAITING_FOR_REVIEW: [],
    COMPLETED: [],
  });

  const statuses: StatusEdital[] = ["PENDING", "UNDER_CONSTRUCTION", "WAITING_FOR_REVIEW", "COMPLETED"];

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
    setColumns((prev) => {
      const source = [...prev[activeContainer]];
      const dest = [...prev[overContainer]];

      const oldIndex = source.findIndex((i) => i.id === activeId);
      if (oldIndex === -1) return prev;

      const [movedItem] = source.splice(oldIndex, 1);

      const overIndex = dest.findIndex((i) => i.id === overId);
      const insertIndex = overIndex === -1 ? dest.length : overIndex;
      dest.splice(insertIndex, 0, { ...movedItem, status: overContainer });

      return { ...prev, [activeContainer]: source, [overContainer]: dest };
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
    <div className="flex flex-col gap-4">
      
      <SuperiorEditais />

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
                <CardListaTeste
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
                      <h3 className="font-semibold">{item.titulo}</h3>
                      <p className="text-sm text-gray-600">Data: {item.data}</p>
                      <p className="text-sm text-gray-600">Categoria: {item.categoria}</p>
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
