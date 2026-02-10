import { StatusEdital } from "@/core/edital/Edital";
import { IconChecks, IconHourglassEmpty, IconHourglassFilled, IconHourglassHigh, IconHourglassLow, IconPaperBag } from "@tabler/icons-react";
import { clsx, type ClassValue } from "clsx"
import { Construction, Copy, EyeIcon } from "lucide-react";
import React from "react";
import { twMerge } from "tailwind-merge"

const CHAVE_EDITAIS_PROCESSANDO = "lista_ids_editais_processando";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function formatarData(data: any): string {
  const date = new Date(data || "");

  const formatado = date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

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

function lerLista() {
  try {
    const valor = localStorage.getItem(CHAVE_EDITAIS_PROCESSANDO);  
    return valor ? JSON.parse(valor) : [];
  } catch {
    return [];
  }
}

function salvarLista(lista: string[]) {
  localStorage.setItem(CHAVE_EDITAIS_PROCESSANDO, JSON.stringify(lista));
}


export {
  formatarData,
  getStatusColor,
  verificarStatusEdital,
  iconeParaStatusDoEdital,
  lerLista,
  salvarLista
};