import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Taxonomia } from "@/core/tipificacao/Tipificacao";
import { ChevronLeft, ChevronRight, Link } from "lucide-react";
import RamosDaTaxonomiaResultado from "./RamosDaTaxonomiaResultado";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
    taxonomias: Taxonomia[] | undefined
}

export default function TaxonommiasResultado({ taxonomias }: Props) {

    const refs = useRef<(HTMLButtonElement | null)[]>([]);

    const [ultimaTab, setUltimaTab] = useState<boolean>(false)
    const [primeiraTab, setPrimeiraTab] = useState<boolean>(true)
    const [abaSelecionada, setAbaSelecionada] = useState<string>("tab0")

    const [taxonomiaSelecionada, setTaxonomiaSelecionada] = useState({
        taxonomia: taxonomias && taxonomias.length > 0 ? taxonomias[0] : undefined,
        index: 0
    })

    const scrollToIndex = (index: number) => {
        const el = refs.current[index];
        if (el) {
        el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
    };

    return (
        taxonomias && taxonomias.length > 0 && (
            <div className="flex flex-1 border border-gray-300 rounded-sm p-4">
                <Tabs defaultValue="tabTax0">
                    <span className="font-bold text-xl italic text-zinc-700 text-center">Taxonomias para a tipificação selecionada acima</span>
                    <div className="flex w-full items-center justify-between gap-2">
                        <Button
                            className={`
                                ${primeiraTab ? "bg-gray-100 hover:bg-gray-100" : "bg-gray-300 hover:bg-gray-300"}
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
                                    tipificacao: taxonomias[indexAnterior]
                                }))
                                setAbaSelecionada("tab" + indexAnterior)
                                scrollToIndex(indexAnterior);
                                setPrimeiraTab(indexAnterior === 0)
                                setUltimaTab(indexAnterior === taxonomias.length - 1)
                            }}
                        >
                            <ChevronLeft />
                        </Button>
                        
                        <TabsList className="max-w-[75%]">
                            {
                                taxonomias.map((taxonomia, index) => (
                                    <TabsTrigger
                                        className={`
                                            hover:cursor-pointer rounded-sm
                                            text-xs text-gray-600 px-2
                                            ${taxonomias.length >= 3  && "truncate max-w-[100px]"}         
                                            block max-w-fit
                                        `}
                                        title={taxonomia.title}
                                        key={index}
                                        value={"tabTax" + index}
                                    >
                                        {taxonomia.title}
                                    </TabsTrigger>
                                ))
                            }
                        </TabsList>

                        <Button
                            className={`
                                ${ultimaTab ? "bg-gray-100 hover:bg-gray-100" : "bg-gray-300 hover:bg-gray-300"} hover:cursor-pointer
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
                                    setAbaSelecionada("tab" + proximoIndex.toString())
                                }
                                scrollToIndex(proximoIndex);

                                setPrimeiraTab(proximoIndex === 0)
                                setUltimaTab(proximoIndex === taxonomias.length - 1)
                            }
                            }
                        >
                            <ChevronRight />
                        </Button>
                    </div>

                    {
                        taxonomias.map((taxonomia, index) => (
                            <TabsContent
                                value={"tabTax" + index}
                                key={taxonomia.id}
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