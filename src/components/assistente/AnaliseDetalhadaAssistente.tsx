"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import TaxonommiasResultado from "@/components/editais/edital/analiselinhas/TaxonomiasResultado";
import type { EditalArquivo, EditalTypification } from "@/core/edital/Edital";

interface Props {
  documentId: string;
}

export default function AnaliseDetalhadaAssistente({ documentId }: Props) {
  const [checkTree, setCheckTree] = useState<EditalTypification[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [primeiraTab, setPrimeiraTab] = useState(true);
  const [ultimaTab, setUltimaTab] = useState(false);
  const [abaSelecionada, setAbaSelecionada] = useState("tab0");
  const [tipificacaoSelecionada, setTipificacaoSelecionada] = useState({
    tipificacao: undefined as EditalTypification | undefined,
    index: 0,
  });

  const urlBase = process.env.NEXT_PUBLIC_URL_BASE ?? "";

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro(false);
      try {
        const res = await fetch(`${urlBase}/doc/${documentId}/release`, {
          credentials: "include",
        });
        if (!res.ok) {
          setErro(true);
          return;
        }
        const data: EditalArquivo = await res.json();
        const tree = data?.releases?.[0]?.check_tree ?? [];
        setCheckTree(tree);
        if (tree.length > 0) {
          setTipificacaoSelecionada({ tipificacao: tree[0], index: 0 });
        }
        if (tree.length === 1) {
          setPrimeiraTab(true);
          setUltimaTab(true);
        }
      } catch {
        setErro(true);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [documentId, urlBase]);

  const notas = checkTree
    .map((t) =>
      t.taxonomies.map((tax: any) =>
        tax.branches?.map((r: any) => r.evaluation?.score) ?? []
      )
    )
    .flat(Infinity) as number[];

  const media: number | undefined = (() => {
    if (!notas || notas.length === 0) return undefined;
    const sum = notas.reduce((a, b) => a + ((b as number) ?? 0), 0);
    return sum / notas.length;
  })();

  if (carregando) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-500">
        <Loader2 className="w-6 h-6 animate-spin" />
        <p className="text-sm">Carregando análise...</p>
      </div>
    );
  }

  if (erro || checkTree.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-zinc-400">
        <p className="text-sm">
          {erro
            ? "Erro ao carregar a análise detalhada."
            : "Nenhuma análise disponível para este documento."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto p-2">
      <div className="flex items-center justify-between py-2 px-4 bg-white rounded-md border border-gray-300 mb-2">
        <h3 className="text-lg font-semibold text-black">OiacIA</h3>
        <p
          style={{ boxShadow: "2px 2px 3px rgba(0, 0, 0, .25)" }}
          className={`
            text-sm font-semibold px-3 py-1 rounded-md text-white
            ${
              typeof media === "number"
                ? media < 5
                  ? "bg-orange-500"
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
      </div>

      <Tabs
        className="w-full flex-1"
        value={abaSelecionada}
        defaultValue="tab0"
        onValueChange={(val) => {
          setAbaSelecionada(val);
          const index = parseInt(val.replace("tab", ""));
          setTipificacaoSelecionada({
            tipificacao: checkTree[index],
            index,
          });
          setPrimeiraTab(index === 0);
          setUltimaTab(index === checkTree.length - 1);
        }}
      >
        <TabsList className="w-full flex flex-col gap-2 p-0 border-0 bg-transparent">
          <div className="w-full grid grid-cols-[auto_48px_1fr_48px] items-center gap-2 bg-white px-4 py-2 border border-gray-300 rounded-sm">
            <h3 className="font-bold text-lg text-black whitespace-nowrap">
              Tipificação:
            </h3>

            <div className="flex items-center justify-center">
              <Button
                className={`
                  ${primeiraTab ? "bg-gray-100 hover:bg-gray-100" : "bg-vermelho hover:bg-vermelho"}
                  hover:cursor-pointer
                `}
                title={primeiraTab ? "Você está na primeira aba" : "Tipificação anterior"}
                variant="outline"
                size="icon"
                onClick={() => {
                  const indexAnterior = tipificacaoSelecionada.index - 1;
                  if (indexAnterior < 0) return;
                  setTipificacaoSelecionada({
                    tipificacao: checkTree[indexAnterior],
                    index: indexAnterior,
                  });
                  setAbaSelecionada("tab" + indexAnterior);
                  setPrimeiraTab(indexAnterior === 0);
                  setUltimaTab(indexAnterior === checkTree.length - 1);
                }}
              >
                <ChevronLeft className={`${primeiraTab ? "text-gray-400" : "text-white"}`} />
              </Button>
            </div>

            <span
              title={tipificacaoSelecionada.tipificacao?.name}
              className="text-lg font-semibold text-black truncate text-center"
            >
              {tipificacaoSelecionada.tipificacao?.name}
            </span>

            <div className="flex items-center justify-center">
              <Button
                className={`
                  ${ultimaTab ? "bg-gray-100 hover:bg-gray-100" : "bg-vermelho hover:bg-vermelho"}
                  hover:cursor-pointer
                `}
                title={!ultimaTab ? "Tipificação seguinte" : "Você está na última aba"}
                variant="outline"
                size="icon"
                onClick={() => {
                  const proximoIndex = tipificacaoSelecionada.index + 1;
                  if (proximoIndex >= checkTree.length) return;
                  setTipificacaoSelecionada({
                    tipificacao: checkTree[proximoIndex],
                    index: proximoIndex,
                  });
                  setAbaSelecionada("tab" + proximoIndex);
                  setPrimeiraTab(proximoIndex === 0);
                  setUltimaTab(proximoIndex === checkTree.length - 1);
                }}
              >
                <ChevronRight className={`${ultimaTab ? "text-gray-400" : "text-white"}`} />
              </Button>
            </div>
          </div>

          {checkTree.map((tipificacao, index) => (
            <TabsContent
              value={"tab" + index}
              className="w-full"
              key={tipificacao.id}
            >
              <TaxonommiasResultado
                taxonomias={tipificacaoSelecionada.tipificacao?.taxonomies ?? []}
                key={tipificacao.id}
                docId={documentId}
              />
            </TabsContent>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
