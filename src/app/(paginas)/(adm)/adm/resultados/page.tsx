"use client";
import BarraDePesquisa from "@/components/BarraDePesquisa";
import Masonry from "react-masonry-css";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { buscarResultadosService } from "@/service/resultado";
import { Resultado } from "@/core/resultado";
import { buscarCasoService } from "@/service/caso";
import { Caso } from "@/core/caso";
import { getModeloService } from "@/service/modelo";
import { Modelo } from "@/core/modelo";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Metrica } from "@/core/metrica";
import { getMetricasService } from "@/service/metrica";

export default function resultados() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [resultado, setResultado] = useState<Resultado[]>([]);
  const termoBusca = useRef<string>("");

  const FILTROS_DEFAULT = {
    modelId: undefined as string | undefined,
    metricId: undefined as string | undefined,
    testRunId: undefined as string | undefined,
    testCaseId: undefined as string | undefined,
    sortBy: "created_at" as "created_at" | "updated_at",
    sortOrder: "desc" as "asc" | "desc",
  };

  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [carregandoModelos, setCarregandoModelos] = useState(false);

  const [metricas, setMetricas] = useState<Metrica[]>([]);
  const [carregandoMetricas, setCarregandoMetricas] = useState(false);

  const [statusFiltro, setStatusFiltro] = useState<
    "aprovado" | "reprovado" | undefined
  >(undefined);

  const [filtros, setFiltros] =
    useState<typeof FILTROS_DEFAULT>(FILTROS_DEFAULT);

  useEffect(() => {
    async function fetchResultados() {
      setCarregando(true);

      const response = await buscarResultadosService({
        metric_id: filtros.metricId,
        model_id: filtros.modelId,
        test_run_id: filtros.testRunId,
        test_case_id: filtros.testCaseId,
        sort_by: filtros.sortBy,
        sort_order: filtros.sortOrder,
        offset: 0,
        limit: 100,
      });

      let resultados = response.test_results;

      if (statusFiltro) {
        resultados = resultados.filter((result) =>
          statusFiltro === "aprovado"
            ? result.passed_feedback
            : !result.passed_feedback,
        );
      }

      setResultado(resultados);
      setCarregando(false);
    }

    fetchResultados();
  }, [
    filtros.metricId,
    filtros.modelId,
    filtros.testRunId,
    filtros.testCaseId,
    filtros.sortBy,
    filtros.sortOrder,
    statusFiltro,
  ]);

  useEffect(() => {
    async function carregarModelos() {
      setCarregandoModelos(true);

      const response = await getModeloService();
      if (response) {
        setModelos(response);
      }

      setCarregandoModelos(false);
    }

    carregarModelos();
  }, []);

  useEffect(() => {
    async function carregarMetricas() {
      setCarregandoMetricas(true);

      const response = await getMetricasService();
      if (response) {
        setMetricas(response);
      }

      setCarregandoMetricas(false);
    }

    carregarMetricas();
  }, []);

  function filtrarResultados() {}

  {
    /* Map o nome dos casos */
  }
  const [casosMap, setCasosMap] = useState<Record<string, string>>({});
  const [modelosMap, setModelosMap] = useState<Record<string, string>>({});

  useEffect(() => {
    async function carregarCaso() {
      const casosResponse = await buscarCasoService();

      if (!casosResponse) return;

      const map: Record<string, string> = {};
      casosResponse.forEach((c: Caso) => {
        map[c.id] = c.name;
      });
      setCasosMap(map);
    }
    carregarCaso();
  }, []);

  useEffect(() => {
    async function carregarModelo() {
      const modelosResponse = await getModeloService();

      if (!modelosResponse) return;
      const map: Record<string, string> = {};
      modelosResponse.forEach((m: Modelo) => {
        map[m.id] = m.name;
      });
      setModelosMap(map);
    }
    carregarModelo();
  }, []);

  useEffect(() => {
    async function carregar() {
      const response = await buscarResultadosService({});

      setCarregando(false);
      setResultado(response.test_results);
    }

    carregar();
  }, []);

  const breakpointColumns = {
    default: 1,
  };

  return (
    <div className="flex flex-col gap-5 pd-10">
      <h2 className="text-4xl font-bold">Gestão dos resultados</h2>

      <BarraDePesquisa
        className="mb-0"
        refInput={termoBusca}
        funcFiltrar={filtrarResultados}
      />

      <div
        className="flex flex-col -mt-3 gap-4 justify-between p-4  rounded-md"
        style={{ boxShadow: "rgba(0, 0, 0, 0.3) 0px 0px 5px" }}
      >
        <div className="flex w-full gap-2">
          <div className="flex flex-col w-full">
            <Label>Status:</Label>

            <Select
              value={statusFiltro ?? ""}
              onValueChange={(value) =>
                setStatusFiltro(value as "aprovado" | "reprovado")
              }
            >
              <SelectTrigger className="w-full cursor-pointer mt-2 py-5">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="reprovado">Reprovado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col w-full">
            <Label>Modelo IA:</Label>
            <Select
              value={filtros.modelId ?? ""}
              onValueChange={(value) =>
                setFiltros((prev) => ({
                  ...prev,
                  modelId: value,
                }))
              }
            >
              <SelectTrigger className="w-full cursor-pointer mt-2 py-5">
                <SelectValue
                  placeholder={
                    carregandoModelos ? "Carregando modelos..." : "Selecione"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {modelos.map((modelo) => (
                  <SelectItem key={modelo.id} value={modelo.id}>
                    {modelo.code_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col w-full">
            <Label>Métrica:</Label>
            <Select
              value={filtros.metricId ?? ""}
              onValueChange={(value) => {
                console.log("metrica seleciona:", value);
                setFiltros((prev) => ({
                  ...prev,
                  metricId: value,
                }));
              }}
            >
              <SelectTrigger className="w-full cursor-pointer mt-2 py-5">
                <SelectValue
                  placeholder={
                    carregandoMetricas ? "Carregando métricas..." : "Selecione"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {metricas.map((metrica) => (
                  <SelectItem key={metrica.id} value={metrica.id}>
                    {metrica.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col w-full">
            <Label>Nota de corte:</Label>
            <Select>
              <SelectTrigger className="w-full cursor-pointer mt-2 py-5">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aprovador">0.5</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* <div className="flex flex-col w-full">
            <Label>Passou:</Label>
            <Select>
              <SelectTrigger className="w-full cursor-pointer mt-2 py-5">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aprovador">Sim</SelectItem>
                <SelectItem value="saprovador">Não</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
          <div className="flex flex-col w-full">
            <Label>Ordem:</Label>

            <Select
              value={filtros.sortOrder ?? ""}
              onValueChange={(value) =>
                setFiltros((prev) => ({
                  ...prev,
                  sortOrder: value as "asc" | "desc",
                }))
              }
            >
              <SelectTrigger className="w-full cursor-pointer mt-2 py-5">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="desc">Mais recentes</SelectItem>
                <SelectItem value="asc">Mais antigos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            className="bg-gray-400 hover:bg-gray-300"
            onClick={() => {
              setFiltros(FILTROS_DEFAULT);
              setStatusFiltro(undefined);
            }}
          >
            Limpar Filtros
          </Button>
        </div>
      </div>

      {carregando ? (
        <div className="flex justify-center items-center gap-2 text-sm text-gray-400">
          <span>Carregando resultados...</span>
          <Loader2 className="animate-spin ml-2" />
        </div>
      ) : resultado.length > 0 ? (
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex gap-5 mb-10 "
        >
          {resultado.map((result) => (
            <div
              key={result.id}
              className="flex flex-col gap-4 rounded-md p-4 w-full transition-all duration-300 mb-3 pb-4"
              style={{ boxShadow: "0 0 5px rgba(0,0,0,.3)" }}
            >
              <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-bold">
                    {casosMap[result.test_case_id] ?? "Caso não encontrado"}
                  </h2>

                  <div className="flex flex-row gap-3">
                    <p>
                      <span className="font-semibold">Modelo ia:</span>{" "}
                      {modelosMap[result.model_id] ?? "Modelo não encontrado"}
                    </p>
                    <p>
                      <span className="font-semibold">Ponto de corte:</span>{" "}
                      {result.threshold_used}
                    </p>
                    <p>
                      <span className="font-semibold">
                        Nota da IA avaliadora:
                      </span>{" "}
                      {Number(result.score_feedback).toFixed(2)}
                    </p>

                    <p>
                      <span className="font-semibold">Passou no teste?</span>{" "}
                      {result.passed_fulfilled ? "Sim" : "Não"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center items-center">
                  <span
                    className={`px-3 py-1 rounded-sm text-white text-sm ${
                      result.passed_feedback ? "bg-verde" : "bg-vermelho"
                    }`}
                  >
                    {result.passed_feedback ? "Aprovado" : "Reprovado"}
                  </span>
                </div>
              </div>

              {/* Botão para expandir */}
              <button
                className="text-sm underline w-fit cursor-pointer flex items-center gap-1"
                onClick={() =>
                  setExpandedCard((prev) =>
                    prev === result.id ? null : result.id,
                  )
                }
              >
                {expandedCard === result.id ? (
                  <>
                    <ChevronUp /> Ocultar detalhes
                  </>
                ) : (
                  <>
                    <ChevronDown /> Ver detalhes
                  </>
                )}
              </button>

              {/* Conteudo do botão de expandir */}
              {expandedCard === result.id && (
                <div className="transition-all duration-300 mt-3 p-3 rounded bg-gray-100">
                  <h3 className="font-semibold">Feedback do IAEditais</h3>
                  <p className="text-sm text-gray-700">
                    {result.actual_feedback}
                  </p>

                  <div className="flex flex-col gap-1 mt-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Feedback esperado</h3>

                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${
                        result.expected_fulfilled
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                      >
                        resultado esperado:{" "}
                        {result.expected_fulfilled ? "sim" : "não"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed">
                      {result.expected_feedback}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 mt-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold ">
                        Feedback da IA avaliadora
                      </h3>

                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${
                        result.actual_fulfilled
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                      >
                        resultado da IA:{" "}
                        {result.actual_fulfilled ? "sim" : "não"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed">
                      {result.reason_feedback}
                    </p>
                  </div>

                  <h3 className="font-semibold mt-3">Prompt enviado à IA</h3>
                  <p className="text-sm text-gray-700">{result.input}</p>
                </div>
              )}
            </div>
          ))}
        </Masonry>
      ) : (
        <p className="text-gray-400 text-2xl text-center animate-pulse">
          Nenhum resultado encontrado.
        </p>
      )}
    </div>
  );
}
