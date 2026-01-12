"use client";
import BarraDePesquisa from "@/components/BarraDePesquisa";
import Calendario from "@/components/Calendario";
import { Caso } from "@/core/caso";
import { Execucao } from "@/core/execucao";
import { buscarCasoService } from "@/service/caso";
import { buscarExecucoesService } from "@/service/executarTeste";
import { CircleCheckBig } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";

export default function execucoes() {
  const breakpointColumns = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1,
  };

  const [execucoes, setExecucoes] = useState<Execucao[]>([]);

  {
    /* Map o nome dos casos */
  }
  const [casosMap, setCasosMap] = useState<Record<string, string>>({});

  const router = useRouter();

  const params = useParams();
  const casoId = params?.casoId as string | undefined;

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
    async function carregar() {
      const response = await buscarExecucoesService({
        test_case_id: casoId,
      });

      let runs = response.test_runs;

      const temp = sessionStorage.getItem("execucao_em_andamento");
      if (temp) {
        const tempRun = JSON.parse(temp);
        runs = [tempRun, ...runs];
      }

      setExecucoes(runs);

      //return setExecucoes(response.test_runs);
    }

    carregar();
  }, [casoId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const finalizada = sessionStorage.getItem("execucao_finalizada");

      if (finalizada) {
        sessionStorage.removeItem("execucao_em_andamento");
        sessionStorage.removeItem("execucao_finalizada");

        // refaz GET → agora vem do backend
        buscarExecucoesService({ test_case_id: casoId }).then((r) =>
          setExecucoes(r.test_runs)
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [casoId]);

  function getStatus(run: any) {
    if (run.status === "EXECUTANDO") {
      return { label: "Executando", className: "bg-amber-500" };
    }

    return { label: "Executado", className: "bg-verde" };
  }

  return (
    <div className="flex flex-col gap-5 pd-10">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold">Gerenciar execuções </h2>

        <BarraDePesquisa />
      </div>
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex relative gap-5 mb-10 px-1"
      >
        {execucoes.map((run, index) => {
          const numero = execucoes.length - index;

          return (
            <div
              style={{ boxShadow: "0 0 5px rgba(0,0,0,.3)" }}
              key={run.id}
              className="flex flex-col gap-2 rounded-md p-4 w-full transition ease-in-out duration-100 mb-5"
            >
              {/* <h2>id: {run.id}</h2> */}
              <div className="flex justify-between">
                <div>
                  <p className="text-2xl font-semibold ">
                    {casosMap[run.test_case_id] ?? "Caso não encontrado"}
                  </p>
                  <span>Execução #{numero}</span>
                </div>

                {(() => {
                  const status = getStatus(run);

                  return (
                    <span
                      className={`text-white px-2 py-1 rounded-full text-xs w-fit h-fit ${status.className}`}
                    >
                      {status.label}
                    </span>
                  );
                })()}
              </div>

              <div className="flex justify-between items-center mt-3">
                <Calendario data={run.created_at} />

                <button
                  className="rounded-md border border-gray-300 bg-branco hover:cursor-pointer px-2 py-1 w-fit h-fit text-black "
                  onClick={() => router.push(`/adm/resultados/${run.id}`)}
                >
                  <div className="flex flex-row justify-center items-center gap-2">
                    <CircleCheckBig color="black" size={16} />
                    resultados
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </Masonry>
    </div>
  );
}
