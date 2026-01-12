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
import { useEffect, useState } from "react";
import { executarTesteService } from "@/service/executarTeste";
import { Metrica } from "@/core/metrica";
import { getMetricasService } from "@/service/metrica";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ExecucaoFormData,
  ExecucaoSchema,
} from "@/core/schemas/execucao.schema";
import { toast } from "sonner";

interface DetalheCasoProps {
  caso: Caso;
  onVoltar: () => void;
  getNomeTeste: (id: string) => string;
  getNomeRamo: (id: string) => string;
  getNomeEdital: (id: string) => string;
  getNomeTaxonomiaPorBranchId: (id: string) => string;
  getNomeTipificacaoPorBranchId: (id: string) => string;
}

export default function DetalheCaso({
  caso,
  onVoltar,
  getNomeTeste,
  getNomeRamo,
  getNomeEdital,
  getNomeTaxonomiaPorBranchId,
  getNomeTipificacaoPorBranchId,
}: DetalheCasoProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [metricas, setMetricas] = useState<Metrica[]>([]);
  const [metricId, setMetricId] = useState<string>("");
  const [modeloIa, setModeloIa] = useState<string>("");

  const [executando, setExecutando] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExecucaoFormData>({
    resolver: zodResolver(ExecucaoSchema),
    defaultValues: {
      metrica_id: [],
    },
  });

  useEffect(() => {
    async function carregarMetricas() {
      try {
        const lista = await getMetricasService();
        if (lista) {
          setMetricas(lista);
          console.log("Metricas carregadas:", lista);
        }
      } catch (error) {
        console.error("Erro ao buscar métricas", error);
      }
    }
    carregarMetricas();
  }, []);

  const onSubmit = async (data: ExecucaoFormData) => {
    try {
      console.log("=== DEBUG INICIO ===");

      console.log("FILE ESTÁ AQUI?", file);
      console.log("TIPO DO FILE:", file?.type);
      console.log("TAMANHO DO FILE:", file?.size);

      console.log("MÉTRICA SELECIONADA:", data.metrica_id);
      console.log("TEST_CASE_ID:", caso.id);

      if (!file) {
        toast.error("Por favor, envie o arquivo.");
        return;
      }

      const payload = {
        test_case_id: caso.id,
        metric_ids: data.metrica_id,
        //model_id: modeloIa || "mock-model",
      };

      const tempRun = {
        id: `temp-${Date.now()}`,
        test_case_id: caso.id,
        created_at: new Date().toISOString(),
        status: "EXECUTANDO",
      };

      sessionStorage.setItem("execucao_em_andamento", JSON.stringify(tempRun));

      console.log("PAYLOAD OBJETO:", payload);
      console.log("PAYLOAD JSON:", JSON.stringify(payload));

      console.log("=== DEBUG FIM ===");

      const resultado = await executarTesteService(payload, file);

      sessionStorage.setItem("execucao_finalizada", resultado.test_run_id);

      if (!resultado) {
        toast.error("Erro ao executar caso de teste");
        return;
      }

      const runId = resultado.test_run_id;

      toast.success("Caso de uso executado com sucesso!");

      console.log("RESULTADO:", resultado);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao executar caso de teste");
    } finally {
      setExecutando(false);
    }
  };

  return (
    <form
      action=""
      onSubmit={handleSubmit(onSubmit)}
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
        {/* Teste */}
        <div className="lg:col-span-4">
          <ReadOnlyBox
            label="Teste associado"
            value={getNomeTeste(caso.test_collection_id)}
          />
        </div>
        {/* Taxonomia */}
        <div className="lg:col-span-4">
          <ReadOnlyBox
            label="Taxonomia associada"
            value={getNomeTaxonomiaPorBranchId(caso.branch_id)}
          />
        </div>
        {/* Modelo de Ia*/}
        <div className="lg:col-span-4">
          <Label>Modelo de ia *</Label>
          <Select value={modeloIa} onValueChange={setModeloIa}>
            <SelectTrigger className="w-full cursor-pointer mt-2 py-5">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="teste">
                Teste
              </SelectItem>
              <SelectItem className="cursor-pointer" value="teste2">
                Teste2
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Linha 2 */}
        {/* Tipificação */}
        <div className="lg:col-span-4">
          <ReadOnlyBox
            label="Tipificação associada"
            value={getNomeTipificacaoPorBranchId(caso.branch_id)}
          />
        </div>
        {/* Ramo */}
        <div className="lg:col-span-4">
          <ReadOnlyBox
            label="Ramo associado"
            value={getNomeRamo(caso.branch_id)}
          />
        </div>
        {/* Métricas */}
        <div className="lg:col-span-4">
          <Label>Selecionar métricas *</Label>
          <Controller
            name="metrica_id"
            control={control}
            render={({ field }) => {
              const selected = field.value ?? [];

              return (
                <Select
                  onValueChange={(value) => {
                    if (selected.includes(value)) {
                      field.onChange(selected.filter((v) => v !== value));
                    } else {
                      field.onChange([...selected, value]);
                    }
                  }}
                >
                  <SelectTrigger className="w-full mt-2 hover:cursor-pointer py-5">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>

                  <SelectContent>
                    {metricas.map((m) => {
                      const selecionada = selected.includes(m.id);

                      return (
                        <SelectItem
                          key={m.id}
                          value={m.id}
                          className={
                            selecionada ? "bg-gray-100 font-semibold" : ""
                          }
                        >
                          {selecionada && "✓ "}
                          {m.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              );
            }}
          />
          {errors.metrica_id && (
            <span className="text-red-500 text-sm">
              {errors.metrica_id.message}
            </span>
          )}
        </div>
        {/* Linha 3 */}
        {/* Feedback esperado */}
        <div className="lg:col-span-4 lg:row-span-2">
          <ReadOnlyBox
            label="Feedback esperado"
            value={caso.expected_feedback}
            minHeight="153px"
          />
        </div>
        {/* Texto de entrada */}
        {/* <div className="lg:col-span-4 lg:row-span-2">
          <ReadOnlyBox
            label="Texto de entrada"
            value={caso.input}
            minHeight="153px"
          />
        </div> */}
        {/* Linha 4 */}
        {/* Upload */}
        <div className="lg:col-span-4 lg:row-span-2 max-h-[153px]">
          <Label>Upload do edital *</Label>
          <div className="mt-2 overflow-hidden">
            <FileUpload onChange={(files) => setFile(files[0])} />
          </div>
        </div>
        {/* Edital */}
        {/* <div className="lg:col-span-4">
          <ReadOnlyBox
            label="Edital associado"
            value={getNomeEdital(caso.doc_id)}
          />
        </div> */}
        <div className="lg:col-span-4">
          <ReadOnlyBox
            label="Conformidade"
            value={caso.expected_fulfilled ? "Sim" : "Não"}
            icon={Circle}
          />
        </div>
      </div>
      {/* Botões fora do grid */}
      <div className="flex justify-between">
        <Calendario />
        <div className="flex justify-end gap-x-2 gap-y-0 ">
          <button
            className="rounded-md hover:cursor-pointer px-4 py-2 w-fit h-fit bg-verde text-white"
            type="submit"
            onClick={() => router.push("/adm/execucoes")}
          >
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
    </form>
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
