"use client";
import BarraDePesquisa from "@/components/BarraDePesquisa";
import Calendario from "@/components/Calendario";
import { Caso } from "@/core/caso";
import { Execucao } from "@/core/execucao";
import useUsuario from "@/data/hooks/useUsuario";
import { buscarCasoService } from "@/service/caso";
import { buscarExecucoesService } from "@/service/executarTeste";
import { CircleCheckBig } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { toast } from "sonner";

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

  const [toastStatusMap, setToastStatusMap] = useState<Record<string, string>>(
    {}
  );

  const router = useRouter();

  const params = useParams();
  const casoId = params?.casoId as string | undefined;

  const { usuario } = useUsuario();

  const [statusAnterior, setStatusAnterior] = useState<Record<string, string>>(
    {}
  );

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
    if (!execucoes.length) return;

    execucoes.forEach((run) => {
      const statusAntes = statusAnterior[run.id];
      const statusAgora = run.status;

      // ainda não tínhamos esse run
      if (!statusAntes) return;

      // status não mudou
      if (statusAntes === statusAgora) return;

      // TRANSIÇÕES IMPORTANTES
      if (statusAntes === "PROCESSING" && statusAgora === "COMPLETED") {
        toast.success("Execução finalizada com sucesso!");
      }

      if (statusAntes === "PROCESSING" && statusAgora === "ERROR") {
        toast.error(run.message ?? "Erro na execução do teste");
      }
    });

    // atualiza snapshot
    const novoMapa: Record<string, string> = {};
    execucoes.forEach((run) => {
      novoMapa[run.id] = run.status;
    });

    setStatusAnterior(novoMapa);
  }, [execucoes]);

  useEffect(() => {
    if (!usuario?.id) return;

    const ws = new WebSocket(
      `ws://${process.env.NEXT_PUBLIC_URL_WS}/ws/${usuario.id}`
    );

    ws.onopen = () => {
      console.log("🟢 WebSocket conectado com sucesso");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.event !== "test_run.update") return;

      const { test_run_id, status, message, progress } = data;

      // setToastStatusMap((prev) => {
      //   if (prev[test_run_id] === status) return prev;

      //   if (status === "COMPLETED") {
      //     toast.success("Execução finalizada com sucesso!");
      //   }

      //   if (status === "ERROR") {
      //     toast.error(message ?? "Erro na execução do teste");
      //   }

      //   return {
      //     ...prev,
      //     [test_run_id]: status,
      //   };
      // });

      // if (status === "COMPLETED") {
      //   console.log("🔥 STATUS COMPLETED RECEBIDO");
      //   toast.success("Execução finalizada com sucesso! TESTANDO TOAST");
      // }

      // if (status === "ERROR") {
      //   console.log("🔥 STATUS ERROR RECEBIDO");
      //   toast.error(message ?? "Erro na execução do teste");
      // }

      setExecucoes((prev) =>
        prev.map((run) =>
          run.id === test_run_id ? { ...run, status, message, progress } : run
        )
      );
    };

    ws.onerror = (err) => {
      console.error("Erro WS execuções", err);
    };

    return () => ws.close();
  }, [usuario?.id]); // 🔥 ESSENCIAL

  useEffect(() => {
    async function carregar() {
      const response = await buscarExecucoesService({
        test_case_id: casoId,
      });

      if (!response) return;

      setExecucoes(response);
    }

    carregar();
  }, [casoId]);

  // Polling usando antes de ter o ws

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const finalizada = sessionStorage.getItem("execucao_finalizada");

  //     if (finalizada) {
  //       sessionStorage.removeItem("execucao_em_andamento");
  //       sessionStorage.removeItem("execucao_finalizada");

  //       // refaz GET → agora vem do backend
  //       buscarExecucoesService({ test_case_id: casoId }).then((r) =>
  //         setExecucoes(r.test_runs)
  //       );
  //     }
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [casoId]);

  // Misto polling e ws (quando o ws não funcionar usa o polling normalmente ws vai servir pra prod e polling pra dev mas ainda tenho que fazer alguns testes)

  useEffect(() => {
    if (
      !execucoes.some(
        (e) =>
          e.status === "PENDING" ||
          e.status === "PROCESSING" ||
          e.status === "EVALUATING"
      )
    ) {
      return;
    }

    const interval = setInterval(async () => {
      const response = await buscarExecucoesService({ test_case_id: casoId });
      if (!response) return;

      setExecucoes(response);
    }, 3000); // a cada 3s

    return () => clearInterval(interval);
  }, [execucoes, casoId]);

  function getStatus(run: Execucao) {
    switch (run.status) {
      case "PENDING":
        return { label: "Pendente", className: "bg-gray-400" };

      case "PROCESSING":
        return { label: "Processando", className: "bg-amber-500" };

      case "EVALUATING":
        return { label: "Avaliando", className: "bg-blue-500" };

      case "COMPLETED":
        return { label: "Concluído", className: "bg-verde" };

      case "ERROR":
        return { label: "Erro", className: "bg-red-500" };

      default:
        return { label: run.status, className: "bg-gray-300" };
    }
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
