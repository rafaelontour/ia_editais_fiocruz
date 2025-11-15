import { Search } from "lucide-react";

interface BarraDePesquisaProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function BarraDePesquisa({
  value,
  onChange,
}: BarraDePesquisaProps) {
  return (
    <div className="flex w-full relative">
      <Search className="absolute mt-1 translate-y-1/2 left-2" size={17} />
      <input
        type="text"
        placeholder="Pesquise"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="mt-1 block w-full pl-8 pr-3 py-2  rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
        style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
      />
    </div>
  );
}
