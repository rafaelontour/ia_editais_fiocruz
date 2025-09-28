import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Branch } from "@/core/tipificacao/Tipificacao"
import { Link } from "lucide-react"


interface Props {
    ramos: Branch[]
}
export default function RamosDaTaxonomiaResultado({ ramos }: Props) {
    return (
        <div className="flex flex-col flex-1 border border-gray-300 rounded-sm p-4">
            <Tabs defaultValue="tabRamo0">
                <TabsList className="mb-4">
                    {
                        ramos.map((ramo, index) => (
                            <TabsTrigger className="hover:cursor-pointer rounded-sm" key={index} value={"tabRamo" + index}>
                                {ramo.title}
                            </TabsTrigger>
                        ))
                    }
                </TabsList>

                {
                    ramos.map((ramo, index) => (
                        <TabsContent
                            value={"tabRamo" + index}
                            className=""
                            key={ramo.id}
                        >
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-row gap-7 px-3 w-full">
                                    <div className="flex flex-col gap-2 w-1/3">
                                        <h3 className="text-lg font-semibold">Item</h3>
                                        <p className=" text-gray-400">
                                            {ramo.title}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-2 w-1/3">
                                        <h3 className="text-lg font-semibold">Detalhamento</h3>
                                        <p className=" text-gray-400">
                                            {ramo.evaluation?.feedback}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-2 w-1/3">
                                        <h3 className="text-lg font-semibold">Resultado</h3>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-xs w-3 h-3" style={{ backgroundColor: "green" }}></div>
                                                <p className="text-gray-400">1,2 (0k)</p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="rounded-xs w-3 h-3" style={{ backgroundColor: "yellow" }}></div>
                                                <p className="text-gray-400">3 (Parcial) : XXXXXX</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-0.5 w-full bg-gray-300"></div>

                                <div className="flex flex-row gap-7 px-3 w-full">
                                    <div className="w-1/3 text-gray-400">
                                        <p>
                                            Em que parte do texto o edital especifica “as Responsabilidade dos Licitantes” com base na
                                            “Lei nº 14.133/2021, especificamente nos artigos 56 e 57”
                                        </p>
                                    </div>

                                    <div className="w-1/3 text-gray-400">
                                        <p>
                                            1. Foi definido “a Responsabilidade pela Proposta” 2. Foi definido “Cumprimento das Disposições”
                                            3. Foi definida “ a Declarações de Conformidade” 4. Foi definida “a Veracidade das Informações”
                                        </p>
                                    </div>

                                    <div className="flex flex-col w-1/3 ">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-xs w-3 h-3" style={{ backgroundColor: "green" }}></div>
                                            <p className="text-gray-400">1,2,3 (0k)</p>
                                            <Link size={16} />
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="rounded-xs w-3 h-3" style={{ backgroundColor: "orange" }}></div>
                                            <p className="text-gray-400">4 (Não Identificado)</p>
                                            <Link size={16} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    ))
                }
            </Tabs>
        </div>
    )
}