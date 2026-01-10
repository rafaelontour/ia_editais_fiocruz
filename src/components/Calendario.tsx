import { formatarData } from "@/lib/utils";
import { Calendar } from "lucide-react";

export default function Calendario({ data }: { data?: string | undefined }) {
  return (
    <p className="flex items-center gap-2 text-sm text-gray-400">
        <Calendar size={18} />
        <span className="flex justify-center flex-col">
            <span className="text-[10px] font-semibold mb-[-5px] mt-1">Criada em</span>
            <span>{data ? formatarData(data) : "Não informado"}</span>
        </span>
    </p>
  );
}
