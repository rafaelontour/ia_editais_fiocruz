import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Branch } from "@/core/tipificacao/Tipificacao"
import { ChevronLeft, ChevronRight, Link } from "lucide-react"
import { useEffect, useRef, useState } from "react"


interface Props {
    ramos: Branch[]
}
export default function RamosDaTaxonomiaResultado({ ramos }: Props) {

    const [ultimaTab, setUltimaTab] = useState<boolean>(false)
    const [primeiraTab, setPrimeiraTab] = useState<boolean>(true)
    const [abaSelecionada, setAbaSelecionada] = useState<string>("tabRamo0")

    const [ramoSelecionado, setRamoSelecionado] = useState({
        ramo: ramos[0],
        index: 0
    })

    useEffect(() => {
        if (ramos.length === 1) {
            setPrimeiraTab(true)
            setUltimaTab(true)
        }
    }, [ramos])

    const refs = useRef<(HTMLButtonElement | null)[]>([]);

    const scrollToIndex = (index: number) => {
        const el = refs.current[index];
        if (el) {
            el.scrollIntoView({ behavior: "smooth", inline: "center", block: "start" });
        }
    };
    
    return (
        <div className="w-full flex flex-col flex-1 border border-gray-300 rounded-sm p-4">
            <Tabs defaultValue="tabRamo0" value={abaSelecionada} onValueChange={(val) => setAbaSelecionada(val)}>
                <h3 className="font-bold text-2xl text-black text-left">Ramos</h3>

                <hr className="mt-2 mb-4 border-gray-300 w-full" />

                <div className="flex w-min-0 justify-between items-center gap-2">
                    <Button
                        className={`
                            ${primeiraTab ? "bg-gray-100 hover:bg-gray-100" : "bg-vermelho hover:bg-vermelho"}
                            hover:cursor-pointer
                        `}
                        title={`${primeiraTab ? "Você está na primeira aba" : "Tipificação anterior"}`}
                        variant={"outline"}
                        size={"icon"}
                        onClick={() => {
                            if (ramos.length === 1) return
                            if (ramoSelecionado.index === null) return
                            const indexAnterior = ramoSelecionado.index - 1
                            if (indexAnterior < 0) return

                            setRamoSelecionado(anterior => ({
                                ...anterior,
                                index: indexAnterior,
                                ramo: ramos[indexAnterior]
                            }))

                            setAbaSelecionada("tabRamo" + indexAnterior)
                            scrollToIndex(indexAnterior);
                            setPrimeiraTab(indexAnterior === 0)
                            setUltimaTab(indexAnterior === ramos.length - 1)
                        }}
                    >
                        <ChevronLeft className={`${primeiraTab ? "text-gray-400" : "text-white"}`} />
                    </Button>

                    <TabsList className="w-full flex overflow-x-auto no-scrollbar">
                        <div className="flex gap-2 items-center mx-3 overflow-x-hidden">
                            <div className="flex w-max">
                                {
                                    ramos.map((ramo, index) => (
                                        <div key={index} className="flex items-center">
                                            <TabsTrigger
                                                title={ramo.title}
                                                ref={el => {refs.current[index] = el}} // ← aqui conecta cada aba ao array de refs
                                                onClick={() => {
                                                    setRamoSelecionado(anterior => ({
                                                        ...anterior,
                                                        index: index,
                                                        ramo: ramo
                                                    }))
                                                    if (index === 0) {
                                                        setPrimeiraTab(true)
                                                    } else {
                                                        setPrimeiraTab(false)
                                                    }
                                                    if (index === ramos.length - 1) {
                                                        setUltimaTab(true)
                                                    } else {
                                                        setUltimaTab(false)
                                                    }
                                                }}
                                                className="hover:cursor-pointer rounded-sm text-lg"
                                                key={index}
                                                value={"tabRamo" + index}
                                            >
                                                <div>
                                                    {ramo.title}
                                                </div>
                                            </TabsTrigger>
                                            {
                                                index < ramos.length - 1 && (
                                                    <span className="text-xs text-zinc-500 mx-4">|</span>
                                                )
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </TabsList>

                    <Button
                        className={`
                            ${ultimaTab ? "bg-gray-100 hover:bg-gray-100" : "bg-vermelho hover:bg-vermelho" }
                            hover:cursor-pointer text-lg
                        `}
                        title={`${!ultimaTab ? "Tipificação seguinte" : "Você está na última aba"}`}
                        variant={"outline"}
                        size={"icon"}
                        onClick={() => {

                            if (ramos.length === 1) return

                            if (ramoSelecionado.index === null || ramoSelecionado.index === ramos.length - 1) return
                            const proximoIndex = ramoSelecionado.index + 1
                            if (proximoIndex < ramos.length) {
                                setRamoSelecionado({
                                    ramo: ramos[proximoIndex],
                                    index: proximoIndex
                                })
                                setAbaSelecionada("tabRamo" + proximoIndex.toString())
                            }
                            scrollToIndex(proximoIndex);
                            setPrimeiraTab(proximoIndex === 0)
                            setUltimaTab(proximoIndex === ramos.length - 1)
                        }}
                    >
                        <ChevronRight className={`${ultimaTab ? "text-gray-400" : "text-white"}`}  />
                    </Button>
                </div>

                {
                    ramos.map((ramo, index) => (
                        <TabsContent
                            value={"tabRamo" + index}
                            className=""
                            key={ramo.id}
                        >
                            <div className="flex flex-col gap-2 text-black">
                                <div className="flex flex-row gap-7 px-3 w-full">
                                    <div className="flex flex-col gap-2 w-1/3">
                                        <h3 className="text-lg font-semibold">Item</h3>
                                        <p className="">
                                            {ramo.title}
                                        </p>
                                    </div>

                                    <div className="flex flex-col bg-zinc-400 gap-2 w-[1px]" />

                                    <div className="flex flex-col gap-2 w-full">
                                        <h3 className="text-lg font-semibold">Detalhamento</h3>
                                        <p className="h-[180px] overflow-y-auto">
                                            {ramo.evaluation?.feedback}
                                        </p>
                                    </div>
                                </div>

                                <hr className="mt-2 mb-4 border-gray-300 w-full" />

                                <div className="flex flex-row gap-3 px-3 w-full">
                                    <h3 className="font-semibold">Resutado: </h3>
                                    { ramo?.evaluation?.score } / 10
                                </div>
                            </div>
                        </TabsContent>
                    ))
                }
            </Tabs>
        </div>
    )
}