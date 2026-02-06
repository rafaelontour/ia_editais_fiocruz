"use client"

import { ChevronLeft, InfoIcon, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Label } from "@/components/ui/label";
import { Comentario, Edital } from "@/core/edital/Edital";
import { useEffect, useState } from "react";
import ComentarioEdital from "@/components/editais/edital/ComentarioEdital";
import { ParamValue } from "next/dist/server/request/params";
import { getEditalArquivoService } from "@/service/editalArquivo";
import { getEditalPorIdService } from "@/service/edital";
import { buscarComentariosPorIdEditalService } from "@/service/comentarioEdital";
import { getStatusColor, iconeParaStatusDoEdital, verificarStatusEdital } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import BotaoVoltar from "@/components/botoes/BotaoVoltar";

interface VisualizarComentariosEdital {
    idEdital: ParamValue
    urlBase: string | undefined
}

export default function VisualizarComentariosEditalCliente({ idEdital, urlBase }: VisualizarComentariosEdital) {

    const [comentariosEdital, setComentariosEdital] = useState<Comentario[] | undefined>(undefined);
    const [enderecoArquivo, setEnderecoArquivo] = useState<string | undefined>(undefined);
    const [buscandoEdital, setBuscandoEdital] = useState<boolean>(true);
    const [edital, setEdital] = useState<Edital | undefined>(undefined);
    const idEditalString = idEdital?.toString();
    
    async function buscarEditalPeloId() {
        const edital = await getEditalPorIdService(idEdital?.toString());
        setEdital(edital);  
    }
    
    async function buscarEditalArquivo() {
        const editalArquivo = await getEditalArquivoService(idEditalString);
        setEnderecoArquivo(urlBase + editalArquivo.releases[0].file_path);
    }

    async function buscarComentariosEdital() {
        const edital = await buscarComentariosPorIdEditalService(idEditalString!);
        setComentariosEdital(edital?.messages);
    }

    async function carregarDados() {
        await Promise.all([
            buscarEditalPeloId(),
            buscarComentariosEdital(),
            buscarEditalArquivo()
        ])

        setBuscandoEdital(false);
    }

    useEffect(() => {
        carregarDados();
    }, []);

    return (
        <div className="flex flex-col h-full">  
            <div className="flex flex-row gap-7 pb-6">
                <BotaoVoltar />

                <Label className="text-2xl font-bold"><strong>Edital</strong>: {edital?.name}</Label>
                {
                    buscandoEdital ? (
                        <p className="flex items-center">
                            <span>Carregando..</span>
                            <LoaderCircle className="animate-spin text-gray-600" />
                        </p>
                    ) : (
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
                    )
                }
            </div>

            <ResizablePanelGroup
                direction="horizontal"
                className="flex h-full gap-6 mb-10"
            >
                <ResizablePanel className="mt-4" minSize={35} defaultSize={50}>
                    <div className="flex h-full w-full justify-center items-center">
                    {
                        !buscandoEdital ? (
                            <iframe
                                src={enderecoArquivo}
                                className="h-full border-2 border-gray-300 rounded-md items-center w-full"
                            ></iframe>
                        ) : (
                            <p className="flex items-center flex-col">
                                <span className="text-gray-600">Carregando edital...</span>
                                <LoaderCircle className="animate-spin text-gray-600" />
                            </p>
                        )
                    }
                        
                    </div>
                </ResizablePanel>

                <div className="flex flex-col items-center gap-4 mt-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <InfoIcon color="green" size={15} />
                        </TooltipTrigger>
                        <TooltipContent className="italic">Clique sobre a linha abaixo, segure e puxe para os lados para alterar a vizualização</TooltipContent>
                    </Tooltip>

                    <ResizableHandle className="w-px h-full" />
                </div>

                <ResizablePanel className="h-full" minSize={35} defaultSize={50}>
                    <div className="w-full h-full">
                        <ComentarioEdital
                            edital={edital}
                            buscarComentariosEdital={buscarComentariosEdital}
                            comentarios={comentariosEdital}
                        />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}