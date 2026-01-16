interface RotuloOpcionalProps {
  texto?: string;
}

export default function RotuloOpcional({ texto }: RotuloOpcionalProps) {
  return (
    <span
      style={{ boxShadow: "2px 2px 3px rgba(0, 0, 0, .5)" }}
      className="text-xs px-2 py-1 rounded-md bg-yellow-400 italic w-fit"
    >
      { texto ? texto : "opcional" }
      
    </span>
  );
}