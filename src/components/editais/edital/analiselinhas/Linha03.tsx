"use client"

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Stars } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import TaxonommiasResultado from "./TaxonomiasResultado";
import { EditalArquivo } from "@/core/edital/Edital";

import style from "@/components/css_personalizado/resumoIA.module.css";

import DOMPurify from "dompurify";

interface Props {
    edital: EditalArquivo | undefined
    resumoIA?: string | undefined
}

export default function Linha03({ edital, resumoIA }: Props) {

    const tipificacoes = edital && edital?.releases[0].check_tree || []
    const [htmlSeguro, setHtmlSeguro] = useState<string>("")
    const refs = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        if (resumoIA) {
            setHtmlSeguro(DOMPurify.sanitize(resumoIA))
        }
    }, [resumoIA])

    const scrollToIndex = (index: number) => {
        const el = refs.current[index];
        if (el) {
            el.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
        }
    };

    useEffect(() => {
        if (tipificacoes.length === 1) {
            setPrimeiraTab(true)
            setUltimaTab(true)
        }
    }, [tipificacoes])

    const [ultimaTab, setUltimaTab] = useState<boolean>(false)
    const [primeiraTab, setPrimeiraTab] = useState<boolean>(true)
    const [abaSelecionada, setAbaSelecionada] = useState<string>("tab0")
    const notas = edital?.releases
        .map((release) => release.check_tree
        .map((tipificacao) => tipificacao.taxonomies
        .map((taxonomia) => taxonomia.branches
        .map((ramo: any) => ramo.evaluation.score ))))
        .flat(Infinity)

    const media = ((): number | undefined => {
        if (!notas || notas.length === 0) return undefined;
        const sum = notas.reduce((a, b) => a + (b ?? 0), 0);
        return sum / notas.length;
    })();

    const [tipificacaoSelecionada, setTipificacaoSelecionada] = useState({
        tipificacao: tipificacoes[0],
        index: 0
    })

    return (
        <div className="flex flex-row gap-4 items-center">

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
                        index
                        });
                        setPrimeiraTab(index === 0);
                        setUltimaTab(index === tipificacoes.length - 1);
                    }}
                >
                    <TabsList className="w-full flex items-start flex-col gap-4 p-3 border border-gray-300 h-fit">
                        <div className="w-full flex flex-col gap-2 border-2 border-black border-dotted rounded-md py-3 px-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-semibold text-black flex items-center gap-2">Resumo gerado por IA <Stars color="blue" size={18}/></h3>
                                <div>
                                    <p
                                        style={{ boxShadow: "2px 2px 3px rgba(0, 0, 0, .25)" }}
                                        className={`
                                            text-sm font-semibold px-3 py-1 rounded-md text-white
                                            ${media && media < 5 ? "bg-red-500" : media && media < 7 ? "bg-yellow-600" : media && media < 8 ? "bg-green-600" : "bg-green-800"}
                                        `}
                                    >
                                            Média de todos os ramos: {media?.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <div className={style.resumoIA} dangerouslySetInnerHTML={{ __html: htmlSeguro }} />
                        </div>

                        <h3 className="font-bold self-start text-2xl text-black">Tipificações</h3>

                        <div className="w-full flex justify-between items-center gap-2">
                            <Button
                                className={`
                                    ${primeiraTab ? "bg-gray-100 hover:bg-gray-100" : "bg-vermelho hover:bg-vermelho"}
                                    hover:cursor-pointer
                                `}
                                title={`${primeiraTab ? "Você está na primeira aba" : "Tipificação anterior"}`}
                                variant={"outline"}
                                size={"icon"}
                                onClick={() => {
                                    if (tipificacaoSelecionada.index === null) return
                                    const indexAnterior = tipificacaoSelecionada.index - 1
                                    if (indexAnterior < 0) return

                                    setTipificacaoSelecionada(anterior => ({
                                        ...anterior,
                                        index: indexAnterior,
                                        tipificacao: tipificacoes[indexAnterior]
                                    }))

                                    setAbaSelecionada("tab" + indexAnterior)
                                    scrollToIndex(indexAnterior);
                                    setPrimeiraTab(indexAnterior === 0)
                                    setUltimaTab(indexAnterior === tipificacoes.length - 1)
                                }}
                            >
                                <ChevronLeft className={`${primeiraTab ? "text-gray-400" : "text-white"}`} />
                            </Button>

                            <div className="flex gap-2 items-center mx-3 overflow-x-hidden">
                                <div className="flex w-max">
                                    {tipificacoes.map((tip, index) => (
                                        <div key={tip.id} className="flex items-center">
                                            <TabsTrigger
                                                ref={el => {refs.current[index] = el}} // ← aqui conecta cada aba ao array de refs
                                                value={"tab" + index}
                                                key={tip.id}
                                            >
                                                <span
                                                    title={tip.name}
                                                    className="
                                                        hover:cursor-pointer
                                                        text-lg px-2 w-fit
                                                        block
                                                    "
                                                >
                                                    {tip.name}
                                                </span>
                                            </TabsTrigger>

                                            {index < tipificacoes.length - 1 && (
                                                <span className="text-xs text-zinc-500 mx-4">|</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button
                                className={`
                                    ${ultimaTab ? "bg-gray-100 hover:bg-gray-100" : "bg-vermelho hover:bg-vermelho" }
                                    hover:cursor-pointer
                                `}
                                title={`${!ultimaTab ? "Tipificação seguinte" : "Você está na última aba"}`}
                                variant={"outline"}
                                size={"icon"}
                                onClick={() => {
                                    if (tipificacaoSelecionada.index === null || tipificacaoSelecionada.index === tipificacoes.length - 1) return
                                        const proximoIndex = tipificacaoSelecionada.index + 1
                                        if (proximoIndex < tipificacoes.length) {
                                            setTipificacaoSelecionada({
                                                tipificacao: tipificacoes[proximoIndex],
                                                index: proximoIndex
                                            })
                                            setAbaSelecionada("tab" + proximoIndex.toString())
                                        }
                                        scrollToIndex(proximoIndex);
                                        setPrimeiraTab(proximoIndex === 0)
                                        setUltimaTab(proximoIndex === tipificacoes.length - 1)
                                    }
                                }
                            >
                                <ChevronRight className={`${ultimaTab ? "text-gray-400" : "text-white"}`}  />
                            </Button>
                        </div>

                    {
                        tipificacoes.map((tipificacao, index) => (
                            <TabsContent
                                value={"tab" + index}
                                className="w-full mx-auto"
                                key={tipificacao.id}
                            >
                                <TaxonommiasResultado
                                    taxonomias={tipificacaoSelecionada.tipificacao ? tipificacaoSelecionada.tipificacao.taxonomies : []}
                                    key={tipificacao.id}
                                />
                            </TabsContent>
                        ))
                    }

                    </TabsList>

                </Tabs>
            </div>
        </div>
    );
}