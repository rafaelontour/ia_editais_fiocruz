import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { RefObject } from "react";

interface BotaoAdicionarProps {
  divRefs: RefObject<Record<string, HTMLFormElement | HTMLSpanElement | HTMLDivElement | HTMLButtonElement | null>>;
  texto: string;
  onClick?: () => void;
}

export default function BotaoAdicionar({ texto, divRefs }: BotaoAdicionarProps) {
  return (
    <Button
      ref={(e) => { divRefs.current["botao_adicionar"] = e }}
      variant={"destructive"}
      className={`
        flex items-center gap-2 bg-vermelho
        hover:cursor-pointer hover:shadow-md text-white py-2 px-4 rounded-sm
      `}
      style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
    >
      <Plus size={18} />
      <span className="text-sm">{texto}</span>
    </Button>
  );
}