"use client";
import BarraDePesquisa from "@/components/BarraDePesquisa";
import Masonry from "react-masonry-css";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { buscarResultadosService } from "@/service/resultado";
import { Resultado } from "@/core/resultado";
import { buscarCasoService } from "@/service/caso";
import { Caso } from "@/core/caso";
import { getModeloService } from "@/service/modelo";
import { Modelo } from "@/core/modelo";

export default function resultados() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const [resultado, setResultado] = useState<Resultado[]>([]);

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
      return setResultado(response.test_results);
    }

    carregar();
  }, []);

  const breakpointColumns = {
    default: 1,
  };

  return (
    <div className="flex flex-col gap-5 pd-10">
      <h2 className="text-4xl font-bold">Gestão dos resultados</h2>

      <BarraDePesquisa />

      <Masonry
        breakpointCols={breakpointColumns}
        className="flex gap-5 mb-10 px-1"
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

                <h3 className="font-semibold mt-3">Feedback esperado</h3>
                <p className="text-sm text-gray-700">
                  {result.expected_feedback}
                </p>

                <h3 className="font-semibold mt-3">
                  Feedback da IA avaliadora
                </h3>
                <p className="text-sm text-gray-700">
                  {result.reason_feedback}
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
