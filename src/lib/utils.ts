import { StatusEdital } from "@/core/edital/Edital";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
      case "UNDER_CONSTRUCTION": return "red";
      case "WAITING_FOR_REVIEW": return "#656149";
      case "COMPLETED": return "darkgreen";
  }
};

export {
  formatarData,
  getStatusColor
};