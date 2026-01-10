import { Search, X } from "lucide-react";
import { RefObject } from "react";

interface BarraDePesquisaProps {
  refInput?: RefObject<string>;
  funcFiltrar?: () => void;
  className?: string
}

export default function BarraDePesquisa(dados: BarraDePesquisaProps) {
  return (

    dados && dados.refInput && dados.funcFiltrar ? (
      <div className={`flex relative -mt-1 mb-3 ${dados.className}`}>
        <Search className="absolute mt-1 translate-y-1/2 left-2" size={17} />

        { 
          dados.refInput.current !== "" && (
            <span
                onClick={() => {
                  dados.refInput!.current = "";
                  dados.funcFiltrar!();
                }}
                className="hover:cursor-pointer"
                title="Limpar pesquisa"
            >
              <X className="absolute mt-1 translate-y-1/2 right-2" size={17} />
            </span>
          )
        }

        <input
          type="text"
          placeholder="Pesquise"
          value={dados.refInput.current}
          onChange={(e) => {
            dados.refInput!.current = e.target.value
            dados.funcFiltrar!()
          }}
          className="mt-1 block w-full pl-8 pr-3 py-2  rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
          style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
        />
      </div>
    ) : (
      null
    )
  );
}