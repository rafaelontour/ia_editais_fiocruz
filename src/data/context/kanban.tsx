"use client";

import React, { createContext, useContext, useState } from "react";
import type { Edital, StatusEdital } from "@/core/edital/Edital";

type KanbanColumns = Record<StatusEdital, Edital[]>;

interface KanbanContextType {
  columns: KanbanColumns;
  setColumns: React.Dispatch<React.SetStateAction<KanbanColumns>>;
}

const KanbanContext = createContext<KanbanContextType | null>(null);

const INITIAL_COLUMNS: KanbanColumns = {
  PENDING: [],
  UNDER_CONSTRUCTION: [],
  WAITING_FOR_REVIEW: [],
  COMPLETED: [],
};

export function KanbanProvider({ children }: { children: React.ReactNode }) {
  const [columns, setColumns] = useState<KanbanColumns>(INITIAL_COLUMNS);

  return (
    <KanbanContext.Provider value={{ columns, setColumns }}>
      {children}
    </KanbanContext.Provider>
  );
}

export function useKanban() {
  const ctx = useContext(KanbanContext);
  if (!ctx) throw new Error("useKanban must be used within KanbanProvider");
  return ctx;
}
