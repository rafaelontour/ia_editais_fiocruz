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

export {
  formatarData,
  getStatusColor,
  verificarStatusEdital,
  iconeParaStatusDoEdital
};