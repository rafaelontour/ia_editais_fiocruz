"use client";

import Masonry from "react-masonry-css";
import CardMetrica from "./CardMetrica";
import { Metrica } from "@/core/metrica";

interface ListaMetricasProps {
  metricas: Metrica[];
  onOpen: (metrica: Metrica) => void; // para o maximize
  onEditar: (metrica: Metrica) => void;
  onExcluir: (id: string) => void;
}

export default function ListaMetricas({
  metricas,
  onOpen,
  onEditar,
  onExcluir,
}: ListaMetricasProps) {
  const breakpointColumns = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex relative gap-5 mb-10 px-1"
    >
      {metricas.map((metrica) => (
        <CardMetrica
          key={metrica.id}
          metrica={metrica}
          onOpen={() => onOpen(metrica)}
          onEditar={() => onEditar(metrica)}
          onExcluir={() => onExcluir(metrica.id)}
        />
      ))}
    </Masonry>
  );
}
