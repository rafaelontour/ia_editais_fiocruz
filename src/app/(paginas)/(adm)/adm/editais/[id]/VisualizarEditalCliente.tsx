"use client"

import { InfoIcon, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnaliseEdital from "@/components/editais/edital/AnaliseEdital";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import useUsuario from "@/data/hooks/useUsuario";
import { Edital } from "@/core";
import { EditalArquivo } from "@/core/edital/Edital";
import { definirStatusConcluido, definirStatusEmConstrucao } from "@/service/edital";
import { toast } from "sonner";
import { useState } from "react";
import { getStatusColor, iconeParaStatusDoEdital, verificarStatusEdital } from "@/lib/utils";

interface VisualizarEditalClienteProps {
    edital: Edital | undefined
    resumoIA: string
    editalArquivo: EditalArquivo
    urlBase: string
}

export default function VisualizarEditalCliente({ edital, editalArquivo, urlBase, resumoIA }: VisualizarEditalClienteProps) {

    const { usuario } = useUsuario();
    const [enviouAnaliseOuConcluido, setEnviouAnaliseOuConcluido] = useState<boolean>(false);

    async function enviarEditalParaConcluido() {
        if (!edital) {
            return;
        }

        const resposta = await definirStatusConcluido(edital.id);

        if (resposta === 200) {
            toast.success("Análise do edital concluida!");
            setEnviouAnaliseOuConcluido(true);
            return;
        }

        toast.error("Erro ao concluir análise do edital!");
        
    }
    
    async function enviarEditalParaEmContrucao() {
        if (!edital) {
            return;
        }

        const resposta = await definirStatusEmConstrucao(edital.id);
    
        if (resposta === 200) {
            toast.success("Edital movido para fase de construção!");
            setEnviouAnaliseOuConcluido(true);
            return;
        }
    
        toast.error("Erro ao mover edital para fase construção!");
    }

    return (
        <div className="flex flex-col w-screen= h-full max-h-full gap-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center flex-row gap-7">
                    <Label className="text-2xl font-semibold">Edital: <span className="font-semibold">{edital?.name}</span></Label>
                    <div
                        className="pointer-events-none flex items-center gap-2 px-3 py-1 rounded-md text-white font-semibold"
                        style={{
                            backgroundColor: getStatusColor(edital?.history ? edital.history[0].status : "PENDING"),
                            boxShadow: "0 0 3px rgba(0, 0, 0, .5)"
                        }}
                    >

                        <span>{edital?.history && verificarStatusEdital(edital?.history[0].status)}</span>
                        {iconeParaStatusDoEdital(edital?.history ? edital.history[0].status : "PENDING")}
                    </div>
                </div>
                
                {
                    edital?.history && (edital.history[0].status === "WAITING_FOR_REVIEW") && (
                        <div className={`flex items-center gap-2 ${enviouAnaliseOuConcluido && "cursor-not-allowed"}`}>
                            {
                                (usuario?.access_level === "ADMIN" || usuario?.access_level === "ANALYST") && (
                                    <Button
                                        disabled={enviouAnaliseOuConcluido}
                                        className="hover:cursor-pointer flex items-center bg-red-500 hover:bg-red-900 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-60"
                                    >
                                        <Play size={30} />
                                        <span className="text-[16px]">Analisar nova versão</span>
                                    </Button>
                                )
                            }

                            {
                                (usuario?.access_level === "ADMIN" || usuario?.access_level === "AUDITOR") && (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            disabled={enviouAnaliseOuConcluido}
                                            onClick={enviarEditalParaEmContrucao}
                                            className="hover:cursor-pointer text-[16px] text-white bg-vermelho hover:bg-red-900 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-60"
                                        >
                                            Rejeitar
                                        </Button>

                                        <Button
                                            disabled={enviouAnaliseOuConcluido}
                                            onClick={enviarEditalParaConcluido}
                                            className="hover:cursor-pointer text-[16px] text-white bg-verde hover:bg-green-900 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-60"
                                        >
                                            Aceitar
                                        </Button>
                                    </div>

                                )
                            }
                        </div>
                    )
                }
            </div>

            <ResizablePanelGroup
                direction="horizontal"
                className="flex gap-6 mb-10"
            >
                <ResizablePanel minSize={30} defaultSize={50}>
                    <div className="flex w-full h-full">
                        <iframe
                            src={urlBase + editalArquivo.releases[0].file_path}
                            className="h-full border-2 border-gray-300 rounded-md items-center w-full"
                        >

                        </iframe>
                    </div>
                </ResizablePanel>

                <div className="flex flex-col items-center gap-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <InfoIcon color="green" size={15} />
                        </TooltipTrigger>
                        <TooltipContent className="italic">Clique sobre a linha abaixo, segure e puxe para os lados para alterar a vizualização</TooltipContent>
                    </Tooltip>

                    <ResizableHandle className="w-[1px] h-full" />
                </div>

                <ResizablePanel minSize={35} defaultSize={50}>
                    <div className="w-full">
                        <AnaliseEdital edital={edital} editalArquivo={editalArquivo} resumoIA={resumoIA} />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}