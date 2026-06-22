"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Edital, StatusEdital } from "@/core/edital/Edital";

type KanbanColumns = Record<StatusEdital, Edital[]>;

interface KanbanContextType {
  columns: KanbanColumns;
  setColumns: React.Dispatch<React.SetStateAction<KanbanColumns>>;
  addDocumentToRascunho: (doc: Edital) => void;
  mergeInitial: (cols: KanbanColumns) => void;
}

const KanbanContext = createContext<KanbanContextType | null>(null);

const KEY = "ia_kanban_v1";

function load(): KanbanColumns {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw)
      return {
        PENDING: [],
        UNDER_CONSTRUCTION: [],
        WAITING_FOR_REVIEW: [],
        COMPLETED: [],
      };
    return JSON.parse(raw) as KanbanColumns;
  } catch (e) {
    return {
      PENDING: [],
      UNDER_CONSTRUCTION: [],
      WAITING_FOR_REVIEW: [],
      COMPLETED: [],
    };
  }
}

function save(cols: KanbanColumns) {
  localStorage.setItem(KEY, JSON.stringify(cols));
}

export function KanbanProvider({ children }: { children: React.ReactNode }) {
  const [columns, setColumns] = useState<KanbanColumns>(load);

  useEffect(() => {
    save(columns);
  }, [columns]);

  function addDocumentToRascunho(doc: Edital) {
    console.log('[kanban] addDocumentToRascunho chamado com:', doc);
    const novaColunas: KanbanColumns = structuredClone(columns) as KanbanColumns;
    novaColunas.PENDING.unshift(doc);
    setColumns(novaColunas);
    save(novaColunas);
  }

  function mergeInitial(cols: KanbanColumns) {
    setColumns((prev) => {
      // coloca itens do servidor ao lado dos já mockados, sem duplicar
      const merged: KanbanColumns = {
        PENDING: [],
        UNDER_CONSTRUCTION: [],
        WAITING_FOR_REVIEW: [],
        COMPLETED: [],
      };
      (Object.keys(merged) as StatusEdital[]).forEach((k) => {
        const server = cols[k] ?? [];
        const local = prev[k] ?? [];
        const ids = new Set(local.map((i) => i.id));
        merged[k] = [...server.filter((s) => !ids.has(s.id)), ...local];
      });
      return merged;
    });
  }

  return (
    <KanbanContext.Provider
      value={{ columns, setColumns, addDocumentToRascunho, mergeInitial }}
    >
      {children}
    </KanbanContext.Provider>
  );
}

export function useKanban() {
  const ctx = useContext(KanbanContext);
  if (!ctx) throw new Error("useKanban must be used within KanbanProvider");
  return ctx;
}
