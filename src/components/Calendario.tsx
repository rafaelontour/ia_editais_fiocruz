import { Calendar } from "lucide-react";

export default function Calendario() {
  return (
    <div className="flex justify-center gap-2 text-sm text-gray-400">
      <Calendar size={18} />
      <span>Criado em </span>
    </div>
  );
}
