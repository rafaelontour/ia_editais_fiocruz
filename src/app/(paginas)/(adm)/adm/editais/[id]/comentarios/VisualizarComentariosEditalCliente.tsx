"use client"

import { ChevronLeft, InfoIcon, LoaderCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Label } from "@/components/ui/label";
import { Comentario, Edital, EditalArquivo } from "@/core/edital/Edital";
import { useEffect, useState } from "react";
import ComentarioEdital from "@/components/editais/edital/ComentarioEdital";
import { ParamValue } from "next/dist/server/request/params";
import { getEditalArquivoService } from "@/service/editalArquivo";
import { getEditalPorIdService } from "@/service/edital";
import { buscarComentariosPorIdEditalService } from "@/service/comentarioEdital";

interface VisualizarComentariosEdital {
    idEdital: ParamValue
    urlBase: string | undefined
}

export default function VisualizarComentariosEditalCliente({ idEdital, urlBase }: VisualizarComentariosEdital) {

    const [editalArquivo, setEditalArquivo] = useState<EditalArquivo | undefined>(undefined);
    const [comentariosEdital, setComentariosEdital] = useState<Comentario[] | undefined>(undefined);
    const [enderecoArquivo, setEnderecoArquivo] = useState<string | undefined>(undefined);
    const [buscandoEdital, setBuscandoEdital] = useState<boolean>(true);
    const idEditalString = idEdital?.toString();

    async function buscarEditalArquivo() {
        const editalArquivo = await getEditalArquivoService(idEditalString);
        setEnderecoArquivo(urlBase + editalArquivo.releases[0].file_path);
        setEditalArquivo(editalArquivo);
        setBuscandoEdital(false);
    }

    async function buscarComentariosEdital() {
        const edital = await buscarComentariosPorIdEditalService(idEditalString!);
        console.log("edital: ", edital);
        setComentariosEdital(edital?.messages);
    }

    useEffect(() => {
        buscarComentariosEdital();
        buscarEditalArquivo();
    }, []);

    return (
        <div className="flex flex-col h-full">  
            <div className="flex flex-row gap-7">
                <Button
                    className="hover:cursor-pointer"
                    variant={"outline"}
                    size={"icon"}
                >
                    <ChevronLeft onClick={() => window.history.go(-1)}/>
                </Button>
                <Label className="text-2xl font-bold">Edital Fiocruz 2025/1</Label>
            </div>

            <ResizablePanelGroup
                direction="horizontal"
                className="flex h-full gap-6 mb-10"
            >
                <ResizablePanel minSize={35} defaultSize={50}>
                    <div className="flex h-full w-full justify-center items-center pt-6">
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

                <ResizableHandle />

                <ResizablePanel className="h-full" minSize={35} defaultSize={50}>
                    <div className="w-full h-full">
                        <ComentarioEdital buscarComentariosEdital={buscarComentariosEdital} idEdital={idEditalString} comentarios={comentariosEdital} />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}