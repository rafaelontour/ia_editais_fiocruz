import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { forwardRef } from "react";

interface BotaoAdicionarProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  texto: string;
}

const Botao = forwardRef<HTMLButtonElement, BotaoAdicionarProps>(
  ({ texto, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        {...props}
        variant={"destructive"}
        className={`
          flex rounded-md gap-2 items-center px-4 py-2
                bg-vermelho  text-white
                hover:cursor-pointer
          ${className}
        `}
        style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
      >
        <Plus size={18} />
        <span className="text-sm">{texto}</span>
      </Button>
    );
  }
);

Botao.displayName = "Botao";

export default Botao;