"use client";

import { ArrowLeft, CheckCircle, CheckCircle2, Circle } from "lucide-react";
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
import { Modelo } from "@/core/modelo";
import { getModeloService } from "@/service/modelo";
import { cn } from "@/lib/utils";

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
  const [modelosIa, setModelosIa] = useState<Modelo[]>([]);

  const [executando, setExecutando] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExecucaoFormData>({
    resolver: zodResolver(ExecucaoSchema),
    defaultValues: {
      metric_ids: [],
      model_id: undefined as unknown as string,
      file: undefined as unknown as File,
    },
  });

  useEffect(() => {
    async function carregarModelos() {
      try {
        const lista = await getModeloService();
        if (lista) {
          setModelosIa(lista);
          console.log("Modelos de IA carregados:", lista);
        }
      } catch (error) {
        console.error("Erro ao buscar modelos de IA", error);
      }
    }

    carregarModelos();
  }, []);

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

      const payload = {
        test_case_id: caso.id,
        metric_ids: data.metric_ids,
        model_id: data.model_id,
      };

      // execução temporária (UX enquanto o backend processa)
      sessionStorage.setItem(
        "execucao_em_andamento",
        JSON.stringify({
          id: `temp-${Date.now()}`,
          test_case_id: caso.id,
          created_at: new Date().toISOString(),
          status: "PENDING",
        }),
      );

      const resultado = await executarTesteService(payload, data.file);

      if (!resultado) {
        toast.error("Erro ao executar caso de teste 2");
        return;
      }

      // agora salva com o ID real retornado pelo backend
      sessionStorage.setItem(
        "execucao_em_andamento",
        JSON.stringify({
          id: resultado.test_run_id,
          test_case_id: caso.id,
          created_at: new Date().toISOString(),
          status: resultado.status ?? "PENDING",
        }),
      );

      toast.success("Execução iniciada! Você pode acompanhar em Execuções.");

      // navega normalmente
      router.push("/adm/execucoes");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao executar caso de teste 1");
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
          <Controller
            name="model_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full cursor-pointer mt-2 py-5">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {modelosIa.map((modelo) => (
                    <SelectItem
                      key={modelo.id}
                      value={modelo.id}
                      className="cursor-pointer"
                    >
                      {modelo.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.model_id && (
            <span className="text-red-500 text-sm">
              {errors.model_id.message}
            </span>
          )}
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
            name="metric_ids"
            control={control}
            render={({ field }) => {
              const selected = field.value ?? [];
              const [selectValue, setSelectValue] = useState<string>("");

              const selectedMetrics = metricas.filter((m) =>
                selected.includes(m.id),
              );

              const maxVisible = 2;
              const visible = selectedMetrics.slice(0, maxVisible);
              const hiddenCount = selectedMetrics.length - visible.length;

              return (
                <Select
                  value={selectValue}
                  onValueChange={(value) => {
                    if (selected.includes(value)) {
                      field.onChange(selected.filter((v) => v !== value));
                    } else {
                      field.onChange([...selected, value]);
                    }
                    setSelectValue("");
                  }}
                >
                  <SelectTrigger className="w-full mt-2 py-5 hover:cursor-pointer">
                    {selected.length === 0 ? (
                      <span className="text-muted-foreground">Selecione</span>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {visible.map((m) => (
                          <span
                            key={m.id}
                            className="px-2 py-1 rounded-md bg-green-100 text-green-800 text-sm"
                          >
                            {m.name}
                          </span>
                        ))}

                        {hiddenCount > 0 && (
                          <span className="px-2 py-1 rounded-md bg-gray-200 text-gray-700 text-sm">
                            +{hiddenCount}
                          </span>
                        )}
                      </div>
                    )}
                  </SelectTrigger>

                  <SelectContent>
                    {metricas.map((m) => {
                      const selecionada = selected.includes(m.id);

                      return (
                        <SelectItem
                          key={m.id}
                          value={m.id}
                          className={cn(
                            "cursor-pointer",
                            selecionada && "bg-gray-100",
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {selecionada ? (
                              <CheckCircle className="w-4 h-4 text-primary" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-300" />
                            )}

                            <span>{m.name}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              );
            }}
          />
          {errors.metric_ids && (
            <span className="text-red-500 text-sm">
              {errors.metric_ids.message}
            </span>
          )}
        </div>
        {/* Linha 3 */}
        {/* Feedback esperado */}
        <div className="lg:col-span-4 lg:row-span-2">
          <ReadOnlyBox
            label="Feedback esperado (IAEditais)"
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
            <Controller
              name="file"
              control={control}
              render={({ field }) => (
                <FileUpload
                  onChange={(files) => field.onChange(files[0] ?? null)}
                />
              )}
            />
            {errors.file && (
              <span className="text-red-500 text-sm ">
                {errors.file.message}
              </span>
            )}
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
            label="Resultado esperado"
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
            //onClick={() => router.push("/adm/execucoes")}
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
