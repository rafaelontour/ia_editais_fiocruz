import { StatusEdital } from "@/core/edital/Edital";
import { IconChecks } from "@tabler/icons-react";
import { clsx, type ClassValue } from "clsx"
import { Construction, Copy, EyeIcon } from "lucide-react";
import React from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function formatarData(data: any, log?: boolean, somenteHora?: boolean): string {
  const date = new Date(data || "");

  if (somenteHora) {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  const formatado = !log ? 
  date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }) : date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
  
  return formatado;
}

function getStatusColor(status: StatusEdital): string {
  switch (status) {
      case "PENDING": return "#99A1AF";
      case "UNDER_CONSTRUCTION": return "#FF0000";
      case "WAITING_FOR_REVIEW": return "#656149";
      case "COMPLETED": return "#016630";
  }
};

function verificarStatusEdital(status: StatusEdital): string {
  switch (status) {
      case "PENDING": return "Rascunho";
      case "UNDER_CONSTRUCTION": return "Em construção";
      case "WAITING_FOR_REVIEW": return "Em Análise";
      case "COMPLETED": return "Concluído";
      default: return "";
  }
}

function iconeParaStatusDoEdital(status: StatusEdital): React.ReactNode {
  switch (status) {
      case "PENDING": return <Copy size={20} />;
      case "UNDER_CONSTRUCTION": return <Construction size={20} />;
      case "WAITING_FOR_REVIEW": return <EyeIcon size={20} />;
      case "COMPLETED": return <IconChecks size={20} />;
      default: return "";
  }
}

export interface ReferenciaPagina {
  chunk_id?: string;
  text_snippet?: string | null;
  page?: number | null;
  rects?: Array<{ x1: number; y1: number; x2: number; y2: number }> | null;
}

export interface DestinoPagina {
  /** Página em base humana (1 = primeira página) */
  pagina: number;
  rects: Array<{ x1: number; y1: number; x2: number; y2: number }>;
}

export function destinosDasReferencias(
  refs?: ReferenciaPagina[] | null,
): DestinoPagina[] {
  if (!refs?.length) return [];
  const mapa = new Map<number, DestinoPagina>();
  for (const ref of refs) {
    if (typeof ref.page !== "number") continue;
    const rects = ref.rects ?? [];
    const temCoords = rects.length > 0;
    // page é 0-based no back; exibimos/navegamos em base 1.
    // Referências antigas podem ter page=0 sem rects e ficam sem botão.
    if (!(ref.page > 0 || temCoords)) continue;
    const pagina = ref.page + 1;
    const atual = mapa.get(pagina) ?? { pagina, rects: [] };
    atual.rects.push(...rects);
    mapa.set(pagina, atual);
  }
  // Mantém a ordem de chegada das referências (relevância),
  // em vez de reordenar por página.
  return [...mapa.values()];
}

export {
  formatarData,
  getStatusColor,
  verificarStatusEdital,
  iconeParaStatusDoEdital
};