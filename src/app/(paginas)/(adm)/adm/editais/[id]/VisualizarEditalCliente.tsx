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

interface VisualizarEditalClienteProps {
    edital: Edital | undefined
    editalArquivo: EditalArquivo
    urlBase: string
}

export default function VisualizarEditalCliente({ edital, editalArquivo, urlBase }: VisualizarEditalClienteProps) {

    const { usuario } = useUsuario();

    return (
        <div className="flex flex-col w-screen= h-full max-h-full gap-10">
            <div className="flex items-center justify-between">
                <div className="flex flex-row gap-7">
                    <Label className="text-2xl font-semibold">Edital <span className="font-semibold">{edital?.name}</span></Label>
                </div>
                    {
                        (usuario?.access_level === "ADMIN" || usuario?.access_level === "AUDITOR") && (
                            <div className="flex items-center gap-2">
                                <Button
                                    className="flex items-center bg-red-500 hover:bg-red-900 hover:cursor-pointer"
                                >
                                    <Play size={30} />
                                    <span>Analisar nova versão</span>
                                </Button>
                                <Button className="text-white hover:cursor-pointer bg-vermelho hover:bg-red-900">Rejeitar</Button>
                                <Button  className=" text-white hover:cursor-pointer bg-verde hover:bg-green-900">Aceitar</Button>
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
                        <AnaliseEdital edital={edital} editalArquivo={editalArquivo} />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}