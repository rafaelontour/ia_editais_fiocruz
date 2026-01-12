"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Masonry from "react-masonry-css";
import BarraDePesquisa from "@/components/BarraDePesquisa";
import { buscarResultadosService } from "@/service/resultado";
import { Resultado } from "@/core/resultado";
import { ChevronDown, ChevronUp } from "lucide-react";
import { buscarCasoService } from "@/service/caso";
import { Caso } from "@/core/caso";

export default function ResultadosPorTestRun() {
  const params = useParams();
  const testRunId = params.testRunId as string;

  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const [casosMap, setCasosMap] = useState<Record<string, string>>({});

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
    async function carregarResultados() {
      if (!testRunId) return;

      const response = await buscarResultadosService({
        test_run_id: testRunId,
      });

      setResultados(response.test_results);
    }

    carregarResultados();
  }, [testRunId]);

  const breakpointColumns = {
    default: 1,
  };

  return (
    <div className="flex flex-col gap-5 p-6">
      <h2 className="text-4xl font-bold">Resultados do teste</h2>

      <BarraDePesquisa />

      <Masonry
        breakpointCols={breakpointColumns}
        className="flex gap-5 mb-10 px-1"
      >
        {resultados.map((result) => (
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
                    {result.model_id}
                  </p>
                  <p>
                    <span className="font-semibold">Nota de corte:</span>{" "}
                    {result.threshold_used}
                  </p>
                  <p>
                    <span className="font-semibold">Score feedback:</span>{" "}
                    {Number(result.score_feedback).toFixed(2)}
                  </p>

                  <p>
                    <span className="font-semibold">Passou Conformidade:</span>{" "}
                    {result.passed_fulfilled ? "Sim" : "Não"}
                  </p>
                </div>
              </div>

              <div className="flex justify-center items-center">
                <span
                  className={`px-3 py-1 rounded text-white text-sm ${
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
                  prev === result.id ? null : result.id
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
                <h3 className="font-semibold">Feedback atual</h3>
                <p className="text-sm text-gray-700">
                  {result.actual_feedback}
                </p>

                <h3 className="font-semibold mt-3">Reason feedback</h3>
                <p className="text-sm text-gray-700">
                  {result.reason_feedback}
                </p>

                <h3 className="font-semibold mt-3">Feedback esperado</h3>
                <p className="text-sm text-gray-700">
                  {result.expected_feedback}
                </p>

                <div className="flex flex-row gap-3 mt-5">
                  <p>
                    <span className="font-semibold mt-3">
                      Conformidade esperada:
                    </span>{" "}
                    {result.expected_fulfilled ? "Sim" : "Não"}
                  </p>
                  <p>
                    <span className="font-semibold mt-3">
                      Conformidade atual:
                    </span>{" "}
                    {result.actual_fulfilled ? "Sim" : "Não"}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </Masonry>
    </div>
  );
}
