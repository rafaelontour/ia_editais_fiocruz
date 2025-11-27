"use client";

import { Caso } from "@/core/caso";
import Masonry from "react-masonry-css";
import CardCaso from "./CardCaso";

interface ListaCasoProps {
  casos: Caso[];
  onOpen: (caso: Caso) => void;
  onEditar: (caso: Caso) => void;
  onExcluir: (id: number) => void;
}

export default function ListaCaso({
  casos,
  onOpen,
  onEditar,
  onExcluir,
}: ListaCasoProps) {
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
      {casos.map((caso) => (
        <CardCaso
          key={caso.id}
          caso={caso}
          onOpen={() => onOpen(caso)}
          onEditar={() => onEditar(caso)}
          onExcluir={() => onExcluir(caso.id)}
        />
      ))}
    </Masonry>
  );
}
