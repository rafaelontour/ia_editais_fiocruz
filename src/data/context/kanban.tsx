"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Edital } from "@/core/edital/Edital";
import { Projeto, DocumentoProjeto } from "@/core/projeto/Projeto";

type StatusEdital =
  | "PENDING"
  | "UNDER_CONSTRUCTION"
  | "WAITING_FOR_REVIEW"
  | "COMPLETED";

type KanbanColumns = Record<StatusEdital, any[]>;

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

const KanbanContext = createContext<any>(null);

export function KanbanProvider({ children }: { children: React.ReactNode }) {
  const [columns, setColumns] = useState<KanbanColumns>(load);

  useEffect(() => {
    save(columns);
  }, [columns]);

  function addDocumentToRascunho(doc: any) {
    setColumns((prev) => {
      const copy = structuredClone(prev);
      copy.PENDING.unshift(doc);
      return copy;
    });
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
        const server = (cols as any)[k] ?? [];
        const local = (prev as any)[k] ?? [];
        const ids = new Set(local.map((i: any) => i.id));
        merged[k] = [...server.filter((s: any) => !ids.has(s.id)), ...local];
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
