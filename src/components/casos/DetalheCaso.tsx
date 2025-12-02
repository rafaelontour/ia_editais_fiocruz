"use client";

import { ArrowLeft, Circle } from "lucide-react";
import { Button } from "../ui/button";
import { Caso } from "@/core/caso";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FileUpload } from "../ui/file-upload";
import Calendario from "../Calendario";
import { useRouter } from "next/navigation";

interface DetalheCasoProps {
  caso: Caso;
  onVoltar: () => void;
}

export default function DetalheCaso({ caso, onVoltar }: DetalheCasoProps) {
  const router = useRouter();
  return (
    <div
      className="w-full p-6 rounded-md bg-white shadow-md flex flex-col gap-6 max-h-[65vh] overflow-y-auto"
      style={{ boxShadow: "0 0 5px rgba(0,0,0,.3)" }}
    >
      {/* Cabeçalho */}
      <div className="flex flex-row gap-3 items-center">
        <Button
          onClick={onVoltar}
          className="h-8 w-8 bg-branco border border-gray-300 hover:bg-branco hover:cursor-pointer rounded-sm"
        >
          <ArrowLeft size={18} color="black" />
        </Button>
        <h2 className="text-2xl font-semibold">{caso.name}</h2>
      </div>

      {/* GRID 4×3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Linha 1 */}
        <div className="lg:col-span-4">
          <ReadOnlyBox label="Teste associado" value={caso.teste} />
        </div>

        <div className="lg:col-span-4">
          <ReadOnlyBox label="Taxonomia associada" value={caso.taxonomia} />
        </div>

        {/* upload ocupa linha 1 e linha 2 */}
        <div className="lg:col-span-4 lg:row-span-2">
          <Label>Upload do edital *</Label>
          <div className="mt-2 h-full ">
            <FileUpload />
          </div>
        </div>

        {/* Linha 2 */}
        <div className="lg:col-span-4">
          <ReadOnlyBox label="Tipificação associada" value={caso.tipificacao} />
        </div>

        <div className="lg:col-span-4">
          <ReadOnlyBox label="Ramo associado" value={caso.ramo} />
        </div>

        {/* Linha 3 */}
        <div className="lg:col-span-4 lg:row-span-2">
          <ReadOnlyBox
            label="Feedback esperado"
            value={caso.feedbackEsperado}
            minHeight="128px"
          />
        </div>

        <div className="lg:col-span-4 lg:row-span-2">
          <ReadOnlyBox
            label="Texto de entrada"
            value={caso.textoEntrada}
            minHeight="128px"
          />
        </div>

        <div className="lg:col-span-4">
          <Label>Selecionar métricas *</Label>

          <Select value="">
            <SelectTrigger className="w-full mt-2 hover:cursor-pointer">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="t1">Teste</SelectItem>
              <SelectItem value="t2">Teste2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Linha 4 */}
        <div className="lg:col-span-4">
          <ReadOnlyBox
            label="Conformidade"
            value={caso.conformidade}
            icon={Circle}
          />
        </div>
      </div>

      {/* Botões fora do grid */}
      <div className="flex justify-between">
        <Calendario />
        <div className="flex justify-end gap-x-2 gap-y-0 ">
          <button className="rounded-md hover:cursor-pointer px-4 py-2 w-fit h-fit bg-verde text-white">
            Executar caso de teste
          </button>
          <button
            className="rounded-md hover:cursor-pointer px-4 py-2 w-fit h-fit text-white bg-zinc-400"
            onClick={() => router.push("/adm/resultados")}
          >
            Ver resultados
          </button>
        </div>
      </div>
    </div>
  );
}

interface ReadOnlyBoxProps {
  label: string;
  value: string | number | null | undefined;
  icon?: React.ElementType;
  minHeight?: string;
}

export function ReadOnlyBox({
  label,
  value,
  icon: Icon,
  minHeight = "42px",
}: ReadOnlyBoxProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>

      <div
        className={`
          bg-gray-100 
          text-gray-700 
          border 
          border-gray-300 
          rounded-md 
          p-2
          text-sm    
          max-h-32         
          overflow-y-auto  
          whitespace-pre-wrap /* mantém quebras de linha */
          `}
        style={{ minHeight }}
      >
        {Icon && <Icon className="w-4 h-4 mr-2 inline" />}
        {value ?? "---"}
      </div>
    </div>
  );
}
