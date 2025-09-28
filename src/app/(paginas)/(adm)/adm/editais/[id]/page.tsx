import { InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Edital } from "@/core";

import AnaliseEdital from "@/components/editais/edital/AnaliseEdital";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { getEditalArquivoService } from "@/service/editalArquivo";
import { getEditalPorIdService } from "@/service/edital";
import { EditalArquivo } from "@/core/edital/Edital";

export default async function VisualizarEdital({ params }: any) {

    const { id } = await params

    const urlBase = process.env.NEXT_PUBLIC_URL_BASE

    const editalArquivo: EditalArquivo = await getEditalArquivoService(id);

    console.log("editalArquivo: ", editalArquivo);
    const edital: Edital | undefined = await getEditalPorIdService(id);

    return (
        <div className="flex flex-col w-full h-full max-h-full gap-10">
            <div className="flex items-center justify-between">
                <div className="flex flex-row gap-7">
                    <Label className="text-2xl font-semibold">Edital <span className="font-semibold">{edital?.name}</span></Label>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant={"outline"} className="hover:cursor-pointer">Rejeitar</Button>
                    <Button variant={"destructive"} className="bg-vermelho text-white hover:cursor-pointer">Aceitar</Button>
                </div>
            </div>

            <ResizablePanelGroup
                direction="horizontal"
                className="flex gap-6 w-full mb-10"
            >
                <div className="w-1/2 h-screen bg-red-500"></div>
                {/* 
                    <ResizablePanel minSize={36} defaultSize={50}>
                        <div className="flex w-full h-full">
                            <iframe
                                src={urlBase + editalArquivo.releases[0].file_path}
                                className="h-full border-2 border-gray-300 rounded-md items-center w-full"
                            >

                            </iframe>
                        </div>
                    </ResizablePanel>
                
                */}

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
                        <AnaliseEdital edital={edital} />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}