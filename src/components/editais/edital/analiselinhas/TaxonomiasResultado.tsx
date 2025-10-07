import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Taxonomia } from "@/core/tipificacao/Tipificacao";
import { ChevronLeft, ChevronRight, Link } from "lucide-react";
import RamosDaTaxonomiaResultado from "./RamosDaTaxonomiaResultado";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
    taxonomias: Taxonomia[] | undefined
}

export default function TaxonommiasResultado({ taxonomias }: Props) {

    const refs = useRef<(HTMLButtonElement | null)[]>([]);

    const [ultimaTab, setUltimaTab] = useState<boolean>(false)
    const [primeiraTab, setPrimeiraTab] = useState<boolean>(true)
    const [abaSelecionada, setAbaSelecionada] = useState<string>("tabTax0")

    const [taxonomiaSelecionada, setTaxonomiaSelecionada] = useState({
        taxonomia: taxonomias && taxonomias.length > 0 ? taxonomias[0] : undefined,
        index: 0
    })

    
    const scrollToIndex = (index: number) => {
        const el = refs.current[index];
        if (el) {
            el.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
        }
    };

    useEffect(() => {
        if (taxonomias?.length === 1) {
            setPrimeiraTab(true)
            setUltimaTab(true)
        }
    }, [taxonomias])
    
    return (
        taxonomias && taxonomias.length > 0 && (
            <div className="flex flex-1 border border-gray-300 rounded-sm p-4">
                <Tabs
                    className="w-full"
                    defaultValue="tabTax0"
                    value={abaSelecionada}
                    onValueChange={(val) => setAbaSelecionada(val)}
                >
                    <span className="font-bold text-2xl text-black text-left">Taxonomias da tipificação</span>
                    <div className="flex items-center justify-between gap-2">
                        <Button
                            className={`
                                ${primeiraTab ? "bg-gray-100 hover:bg-gray-100" : "bg-vermelho hover:bg-vermelho"}
                                hover:cursor-pointer
                            `}
                            title={`${primeiraTab ? "Você está na primeira aba" : "Tipificação anterior"}`}
                            variant={"outline"}
                            size={"icon"}
                            onClick={() => {
                                if (taxonomiaSelecionada.index === null) return
                                const indexAnterior = taxonomiaSelecionada.index - 1
                                if (indexAnterior < 0) return

                                setTaxonomiaSelecionada(anterior => ({
                                    ...anterior,
                                    index: indexAnterior,
                                    taxonomia: taxonomias[indexAnterior]
                                }))

                                setAbaSelecionada("tabTax" + indexAnterior)
                                scrollToIndex(indexAnterior);
                                setPrimeiraTab(indexAnterior === 0)
                                setUltimaTab(indexAnterior === taxonomias.length - 1)
                            }}
                        >
                            <ChevronLeft className={`${primeiraTab ? "text-gray-400" : "text-white"}`} />
                        </Button>
                        
                        <TabsList className="flex overflow-hidden">
                            <div className="flex gap-2 items-center mx-3 overflow-x-hidden">
                                <div className="flex w-max">
                                    {
                                        taxonomias.map((tax, index) => (
                                            <div key={index} className="flex items-center">
                                                <TabsTrigger
                                                    ref={el => {refs.current[index] = el}} // ← aqui conecta cada aba ao array de refs
                                                    onClick={() => {
                                                        setTaxonomiaSelecionada(anterior => ({
                                                            ...anterior,
                                                            index: index,
                                                            taxonomia: tax
                                                        }))

                                                        if (index === 0) {
                                                            setPrimeiraTab(true)
                                                        } else {
                                                            setPrimeiraTab(false)
                                                        }
                                                        if (index === taxonomias.length - 1) {
                                                            setUltimaTab(true)
                                                        } else {
                                                            setUltimaTab(false)
                                                        }
                                                    }}
                                                    className={`
                                                        hover:cursor-pointer rounded-sm
                                                        text-lg text-black px-2
                                                        block
                                                    `}
                                                    title={tax.title}
                                                    key={index}
                                                    value={"tabTax" + index}
                                                >
                                                    {tax.title}
                                                </TabsTrigger>

                                                {index < taxonomias.length - 1 && (
                                                <span className="text-xs text-zinc-500 mx-4">|</span>
                                            )}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </TabsList>

                        <Button
                            className={`
                                ${ultimaTab ? "bg-gray-100 hover:bg-gray-100" : "bg-vermelho hover:bg-vermelho"} hover:cursor-pointer
                                `}
                            title={`${!ultimaTab ? "Tipificação seguinte" : "Você está na última aba"}`}
                            variant={"outline"}
                            size={"icon"}
                            onClick={() => {

                                if (taxonomiaSelecionada.index === null || taxonomiaSelecionada.index === taxonomias.length - 1) return

                                const proximoIndex = taxonomiaSelecionada.index + 1

                                if (proximoIndex < taxonomias.length) {
                                    setTaxonomiaSelecionada({
                                        taxonomia: taxonomias[proximoIndex],
                                        index: proximoIndex
                                    })
                                    setAbaSelecionada("tabTax" + proximoIndex.toString())
                                }
                                scrollToIndex(proximoIndex);

                                setPrimeiraTab(proximoIndex === 0)
                                setUltimaTab(proximoIndex === taxonomias.length - 1)
                            }
                            }
                        >
                            <ChevronRight className={`${ultimaTab ? "text-gray-400" : "text-white"}`} />
                        </Button>
                    </div>

                    {
                        taxonomias.map((taxonomia, index) => (
                            <TabsContent
                                value={"tabTax" + index}
                                key={taxonomia.id}
                                className="w-[98%] mx-auto"
                            >
                                <RamosDaTaxonomiaResultado
                                    ramos={taxonomia.branches ? taxonomia.branches : []}
                                    key={taxonomia.id}
                                />
                            </TabsContent>
                        ))
                    }
                </Tabs>
            </div>
        )
    )
}