"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Stars,
} from "lucide-react";
import { useEffect, useState } from "react";
import TaxonommiasResultado from "./TaxonomiasResultado";
import { EditalArquivo } from "@/core/edital/Edital";
import { Edital } from "@/core";
import { formatarData } from "@/lib/utils";

import style from "@/components/css_personalizado/resumoIA.module.css";

import DOMPurify from "dompurify";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

interface Props {
  edital: EditalArquivo | undefined;
  editalInfo: Edital | undefined;
  resumoIA?: string | undefined;
}

export default function Linha03({ edital, editalInfo, resumoIA }: Props) {
  const tipificacoes = (edital && edital?.releases[0].check_tree) || [];
  const [htmlSeguro, setHtmlSeguro] = useState<string>("");
  const urlBase = process.env.NEXT_PUBLIC_URL_BASE ?? "";

  const alternarModo = () =>
    setModoVisualizacao((prev) =>
      prev === "resumo" ? "tipificacoes" : "resumo",
    );

  const responsaveis: {
    id: number;
    name: string;
    designation: string;
    image: string;
  }[] =
    editalInfo?.editors?.map((editor, index) => ({
      // id precisa ser number (se vier string, converte; se vier undefined/NaN, usa index)
      id:
        typeof editor.id === "number"
          ? editor.id
          : Number.isFinite(Number(editor.id))
            ? Number(editor.id)
            : index,

      // name precisa ser string (nunca undefined)
      name: editor.username?.split(" ")[0] ?? "Usuário",

      designation: "Analista",

      // image continua igual, só com base segura
      image: editor.icon?.file_path
        ? urlBase + editor.icon.file_path
        : "/user.png",
    })) ?? [];

  const [modoVisualizacao, setModoVisualizacao] = useState<
    "resumo" | "tipificacoes"
  >("resumo");

  const [isExpanded, setIsExpanded] = useState(false);

  // Função para truncar texto por palavras
  const truncateText = (text: string, maxWords: number): string => {
    const words = text.split(" ");
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
  };

  useEffect(() => {
    if (resumoIA) {
      setHtmlSeguro(DOMPurify.sanitize(resumoIA));
    }
  }, [resumoIA]);

  useEffect(() => {
    if (tipificacoes.length === 1) {
      setPrimeiraTab(true);
      setUltimaTab(true);
    }
  }, [tipificacoes]);

  const [ultimaTab, setUltimaTab] = useState<boolean>(false);
  const [primeiraTab, setPrimeiraTab] = useState<boolean>(true);
  const [abaSelecionada, setAbaSelecionada] = useState<string>("tab0");
  // const notas = edital?.releases[0]
  //     .map((release) => release.check_tree
  //     .map((tipificacao) => tipificacao.taxonomies
  //     .map((taxonomia) => taxonomia.branches
  //     .map((ramo: any) => ramo.evaluation.score ))))
  //     .flat(Infinity)

  const notas = edital?.releases[0].check_tree
    .map((tipificacao) =>
      tipificacao.taxonomies.map((taxonomia) =>
        taxonomia.branches.map((ramo: any) => ramo.evaluation.score),
      ),
    )
    .flat(Infinity);

  const media: number | undefined = ((): number | undefined => {
    if (!notas || notas.length === 0) return undefined;
    const sum = notas.reduce((a, b) => a + (b ?? 0), 0);
    return sum / notas.length;
  })();

  const [tipificacaoSelecionada, setTipificacaoSelecionada] = useState({
    tipificacao: tipificacoes[0],
    index: 0,
  });

  return (
    <div className="flex flex-row gap-4 items-stretch min-h-0 flex-1">
      <div className="flex w-full gap-4 relative">
        <Tabs
          className="w-full"
          value={abaSelecionada}
          defaultValue="tab0"
          onValueChange={(val) => {
            setAbaSelecionada(val);
            const index = parseInt(val.replace("tab", "")); // ou tabTax
            setTipificacaoSelecionada({
              tipificacao: tipificacoes[index],
              index,
            });
            setPrimeiraTab(index === 0);
            setUltimaTab(index === tipificacoes.length - 1);
          }}
        >
          <TabsList className="w-full flex items-start flex-col gap-4 p-3 border border-gray-300 flex-1">
            <div className="w-full flex flex-col gap-2 rounded-md  flex-1 min-h-0 ">
              <div className="flex items-center justify-between py-2 px-4 bg-white rounded-md border border-gray-300 ">
                <h3 className="text-2xl font-semibold text-black flex items-center gap-2">
                  OiacIA
                  {/* <Stars color="blue" size={18} /> */}
                </h3>
                <div className="flex flex-row gap-4 items-center">
                  <p className="text-sm font-semibold text-gray-400">
                    versão 1.0.1
                  </p>
                  <p
                    style={{ boxShadow: "2px 2px 3px rgba(0, 0, 0, .25)" }}
                    className={`
                      text-sm font-semibold px-3 py-1 rounded-md text-white
                      ${
                        typeof media === "number"
                          ? media < 5
                            ? "bg-red-500"
                            : media < 7
                              ? "bg-yellow-600"
                              : media < 8
                                ? "bg-green-600"
                                : "bg-green-800"
                          : "bg-gray-200"
                      }
                  `}
                  >
                    Média de todos os ramos: {media?.toFixed(2)}
                  </p>
                  {/* teste */}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto min-h-0  ">
                {modoVisualizacao === "resumo" ? (
                  <div className="h-full flex flex-col ">
                    <div className="flex flex-row gap-2 mb-2">
                      <div className="flex justify-between items-center flex-1 py-2 px-5 rounded-md bg-white border border-gray-300 ">
                        <h3 className="text-xl font-semibold text-black">
                          {(editalInfo?.editors ?? []).length > 1
                            ? "Responsáveis:"
                            : "Responsável:"}
                        </h3>

                        {editalInfo?.editors &&
                        editalInfo.editors.length > 0 ? (
                          // <ul className="ml-5" style={{ listStyleType: "disc" }}>
                          //   {editalInfo.editors.map((editor) => (
                          //     <li key={editor.id} className="text-lg text-black">
                          //       {editor.username}
                          //     </li>
                          //   ))}
                          // </ul>
                          <div className="flex items-center mr-2">
                            <AnimatedTooltip items={responsaveis} />
                          </div>
                        ) : (
                          <p className="text-sm text-white bg-red-400 px-2 pb-0.5 pt-1.5 rounded-sm">
                            Falha ao buscar informação
                          </p>
                        )}
                      </div>
                      <div className="flex flex-1 justify-between items-center bg-white border border-gray-300 py-2 px-5 rounded-md">
                        <h3 className="text-xl font-semibold text-black">
                          Data:
                        </h3>
                        <p className="text-lg">
                          {formatarData(editalInfo?.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="border p-1 border-gray-300 rounded-md bg-white flex-1 flex flex-col gap-3">
                      <div
                        className={`${style.resumoIA} italic ${!isExpanded ? "flex-1 overflow-hidden" : "flex-1"}`}
                        dangerouslySetInnerHTML={{
                          __html: isExpanded
                            ? htmlSeguro
                            : truncateText(htmlSeguro, 150), // Aproximadamente 150 palavras
                        }}
                      />
                      {htmlSeguro.split(" ").length > 150 && (
                        <button
                          onClick={() => setIsExpanded(!isExpanded)}
                          className="cursor-pointer mt-2 ml-1 italic text-blue-600 hover:underline text-sm font-semibold self-start flex items-center gap-1 hover:cursor-pointer"
                        >
                          {isExpanded ? (
                            <div className="flex items-center gap-2 px-4 pb-4">
                              <ChevronUp size={16} />
                              <span>Recolher texto</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 px-4 pb-4">
                              <ChevronDown size={16} />
                              Expandir o texto
                            </div>
                          )}
                        </button>
                      )}
                    </div>

                    <button
                      onClick={alternarModo}
                      className="text-sm w-fit font-semibold bg-vermelho text-white rounded-md cursor-pointer py-2 px-3 mt-2"
                    >
                      Ver análise detalhada
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-full grid grid-cols-[auto_48px_1fr_48px] items-center gap-2 bg-white px-4 py-2 border border-gray-300 rounded-sm mb-2">
                      <h3 className="font-bold text-xl text-black whitespace-nowrap">
                        Tipificação:
                      </h3>

                      <div className="flex items-center justify-center">
                        <Button
                          className={`
                                      ${primeiraTab ? "bg-gray-100 hover:bg-gray-100" : "bg-vermelho hover:bg-vermelho"}
                                      hover:cursor-pointer
                                  `}
                          title={`${primeiraTab ? "Você está na primeira aba" : "Tipificação anterior"}`}
                          variant={"outline"}
                          size={"icon"}
                          onClick={() => {
                            if (tipificacaoSelecionada.index === null) return;
                            const indexAnterior =
                              tipificacaoSelecionada.index - 1;
                            if (indexAnterior < 0) return;

                            setTipificacaoSelecionada((anterior) => ({
                              ...anterior,
                              index: indexAnterior,
                              tipificacao: tipificacoes[indexAnterior],
                            }));

                            setAbaSelecionada("tab" + indexAnterior);
                            setPrimeiraTab(indexAnterior === 0);
                            setUltimaTab(
                              indexAnterior === tipificacoes.length - 1,
                            );
                          }}
                        >
                          <ChevronLeft
                            className={`${primeiraTab ? "text-gray-400" : "text-white"}`}
                          />
                        </Button>
                      </div>

                      <span title={tipificacaoSelecionada.tipificacao?.name} className="text-lg font-semibold text-black truncate text-center">
                        {tipificacaoSelecionada.tipificacao?.name}
                      </span>

                      <div className="flex items-center justify-center">
                        <Button
                          className={`
                              ${ultimaTab ? "bg-gray-100 hover:bg-gray-100" : "bg-vermelho hover:bg-vermelho"}
                              hover:cursor-pointer
                          `}
                          title={`${!ultimaTab ? "Tipificação seguinte" : "Você está na última aba"}`}
                          variant={"outline"}
                          size={"icon"}
                          onClick={() => {
                            if (
                              tipificacaoSelecionada.index === null ||
                              tipificacaoSelecionada.index ===
                                tipificacoes.length - 1
                            )
                              return;
                            const proximoIndex =
                              tipificacaoSelecionada.index + 1;
                            if (proximoIndex < tipificacoes.length) {
                              setTipificacaoSelecionada({
                                tipificacao: tipificacoes[proximoIndex],
                                index: proximoIndex,
                              });
                              setAbaSelecionada(
                                "tab" + proximoIndex.toString(),
                              );
                            }
                            setPrimeiraTab(proximoIndex === 0);
                            setUltimaTab(
                              proximoIndex === tipificacoes.length - 1,
                            );
                          }}
                        >
                          <ChevronRight
                            className={`${ultimaTab ? "text-gray-400" : "text-white"}`}
                          />
                        </Button>
                      </div>
                    </div>

                    {tipificacoes.map((tipificacao, index) => (
                      <TabsContent
                        value={"tab" + index}
                        className="w-full mx-auto"
                        key={tipificacao.id}
                      >
                        <TaxonommiasResultado
                          taxonomias={
                            tipificacaoSelecionada.tipificacao
                              ? tipificacaoSelecionada.tipificacao.taxonomies
                              : []
                          }
                          key={tipificacao.id}
                        />
                      </TabsContent>
                    ))}
                    <button
                      onClick={alternarModo}
                      className="text-sm font-semibold bg-vermelho text-white rounded-md cursor-pointer px-3 py-2 mt-2"
                    >
                      Ver análise resumida
                    </button>
                  </>
                )}
              </div>
            </div>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
