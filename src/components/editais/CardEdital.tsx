"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Edital } from "@/core";
import EditarEdital from "./EditarEdital";
import { Button } from "../ui/button";
import { Archive, Check, CheckIcon, Info, Logs, LogsIcon, Send, Trash, View } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { arquivarEditalService, excluirEditalService } from "@/service/edital";
import { toast } from "sonner";
import Link from "next/link";
import { formatarData } from "@/lib/utils";
import useUsuario from "@/data/hooks/useUsuario";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { IconLoaderQuarter, IconLogs, IconProgressCheck, IconProgressHelp } from "@tabler/icons-react";
import useEditalProc from "@/data/hooks/useProcEdital";
import { AnimatedTooltip } from "../ui/animated-tooltip";
import { DragOverlay } from "@dnd-kit/core";


interface Props {
    edital: Edital;
    containerId: string; // StatusEdital como string
    funcaoAtualizarEditais: Dispatch<SetStateAction<boolean>>;
    flagEdital: boolean
}

type HistoricoPorDia = {
    data: string;
    modificacoes: string[];
}

export default function CardEdital({ edital, containerId, funcaoAtualizarEditais, flagEdital }: Props) {

    const { usuario } = useUsuario();
    const { editalProcessado, idEditalAtivo } = useEditalProc();
    const [openExcluirEdital, setOpenExcluirEdital] = useState<boolean>(false);

    // passa data.containerId para o hook
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: edital.id,
        data: { containerId },
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: transition || "transform 150ms ease",
        zIndex: isDragging ? 9999 : undefined, // se sem DragOverlay, garante estar acima
    };

    async function excluirEdital() {
        const resposta = await excluirEditalService(edital.id);

        if (resposta !== 204) {
            toast.error("Erro ao excluir edital!");
            return
        }

        toast.success("Edital excluido com sucesso!");
        funcaoAtualizarEditais(!flagEdital);
    }

    const cor = () => {
        if (!edital.history) return "white";

        const status = edital.history && edital.history[0].status;
        switch (status) {
            case "PENDING":
                return "bg-gray-400";
            case "UNDER_CONSTRUCTION":
                return "bg-red-500";
            case "WAITING_FOR_REVIEW":
                return "bg-[#656149]";
            case "COMPLETED":
                return "bg-green-800";
        }
    };

    async function arquivarEdital(id: string) {
        const resposta = await arquivarEditalService(id);

        if (resposta !== 200) {
            toast.error("Erro ao arquivar edital!");
            return    
        } 

        funcaoAtualizarEditais(!flagEdital);
        toast.success("Edital arquivado!");
    }

    function gerarLogEdital() {
        if (!edital.history) return;

        const dataDoDia = edital.history[0]
    }

    type Item = {
        id: string;
        name: string;
        designation: string;
        image: string;
    };

    const urlBase = process.env.NEXT_PUBLIC_URL_BASE

    const responsaveis: any[] = []

    edital.editors?.map(
        (editor) => (
            responsaveis.push({
                id: editor.id,
                name: editor.username?.split(" ")[0],
                designation: "Analista",
                image: editor.icon?.file_path !== undefined ? urlBase + editor.icon.file_path : "/user.png",
            })
        )
    )

    return (
        <div
            ref={setNodeRef}
            title={!editalProcessado && idEditalAtivo === edital.id ? "Aguarde o processamento do edital para ver o resultado" : ""}
            style={style}
            className={`
                bg-white rounded-md shadow-sm
                ${!editalProcessado && idEditalAtivo === edital.id && "cursor-progress"}
                ${isDragging ? "opacity-30" : "opacity-100"}
            `}
        >

            {/* drag handle: aplicamos attributes & listeners aqui (evita conflitos com botões dentro do card) */}
            <div {...attributes} {...listeners} className={`${!editalProcessado && idEditalAtivo === edital.id && "hidden"} h-12 teste ${cor()} rounded-t-sm flex items-center justify-center`}>
                <span
                    className={`
                        w-fulltext-md pointer-events-none italic
                    `}
                >
                    Segure nesta área para arrastar
                </span>
            </div>

            <div className="relative p-3 overflow-x-hidden">
                <div className="flex flex-col-reverse items-start justify-between">
                    <h3 className="font-semibold text-xl">{edital.name}</h3>

                    <div className="relative w-full my-2 flex justify-between">
                        {
                            edital.history &&
                            edital.history.filter((h) => h.status === "UNDER_CONSTRUCTION").length >= 2 &&
                            edital.history.filter((h) => h.status === "WAITING_FOR_REVIEW").length >= 1 && (
                                <Tooltip>
                                    <div className="flex items-center bg-black pl-3 pr-2 py-1 rounded-md" style={{ boxShadow: "0 0 3px rgba(0,0,0,.7)" }}>
                                        <TooltipTrigger>
                                            {
                                                edital.history[0].status !== "COMPLETED" ? (
                                                    <span className="flex items-center gap-1 text-sm font-bold text-white" >
                                                        Retrabalhando <IconProgressHelp className="mt-0.5" size={17} />
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-sm font-bold text-white" >
                                                        Retrabalhado <IconProgressCheck color="green" className="mt-0.5" size={17} />
                                                    </span>
                                                )
                                            }
                                        </TooltipTrigger>
                                        <TooltipContent className="text-md">
                                            {
                                                edital.history[0].status !== "COMPLETED" ? (
                                                    <span>Este edital já esteve em fase de análise e voltou para fase de construção em algum momento</span>
                                                ) : (
                                                    <span>Este edital esteve em análise, mas voltou para construção pelo menos 1 vez</span>
                                                )
                                            }
                                        </TooltipContent>
                                    </div>
                                </Tooltip>
                            )
                        }
                            
                        {/* <Dialog>
                            <DialogTrigger asChild>
                                <div
                                    className="
                                        bg-zinc-200 rounded-sm px-2 py-0.5
                                        flex items-center gap-1
                                        absolute right-1
                                        hover:cursor-pointer
                                    "
                                    title="Ver histórico de atualização do edital"
                                    style={{ boxShadow: "0 0 3px rgba(0,0,0,.7)" }}
                                >
                                    <p className="text-sm italic">Logs</p>
                                    <IconLogs size={18} />
                                </div>
                            </DialogTrigger>

                            <DialogContent className="w-[60%]">
                                <DialogHeader>
                                    <DialogTitle className="text-3xl">Historico de atualização do estado do edital</DialogTitle>
                                </DialogHeader>

                                <DialogDescription className="text-md mb-8">
                                    Ações, editores e estados do edital
                                </DialogDescription>

                                {
                                    edital.history &&
                                    edital.history.map((h, index) => (
                                        <div key={index} className="flex flex-col justify-between">
                                            {  
                                                index === 0 ? (
                                                    <div className="w-full flex justify-center items-center gap-2">
                                                        <CheckIcon className="text-green-500" size={25} /> 
                                                        <span className="font-semibold text-lg">Edital enviado em {formatarData(h.created_at)}</span>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <span>{formatarData(h.created_at)}</span>
                                                        <span>{h.status}</span>
                                                        {index}

                                                    </div>
                                                )
                                            }
                                            
                                        </div>
                                    ))
                                }

                            </DialogContent>

                            {
                                edital.status === "COMPLETED" && 
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button onClick={() => arquivarEdital(edital.id)}>Arquivar edital</Button>
                                    </DialogClose>
                                </DialogFooter>
                            }
                        </Dialog> */}
                        
                    </div>
                </div>

                <hr className="my-1" />

                <div
                    className="
                        flex flex-col items-start gap-1 mt-2
                    "
                >
                    <p><strong>Número do edital</strong>: {edital.identifier}</p>

                    <div className="flex text-md justify-between">
                        <span className="font-semibold">Criado em: &nbsp;</span>
                        <span>{formatarData(edital.created_at)}</span>
                    </div>

                    <div className="flex flex-col  gap-2">

                        <h4 className="font-semibold">
                            {
                                edital.editors && edital.editors?.length > 1 ? (
                                    "Responsáveis: "
                                ) : (
                                    "Responsável: "
                                )
                            }
                        </h4>

                        <div className="flex items-center gap-2">
                            <span className="ml-1">-</span>
                            <AnimatedTooltip items={responsaveis} />
                        </div>
                    </div>

                    {
                        !editalProcessado && idEditalAtivo === edital.id ? (
                            <div className="h-12 w-full flex items-center bg-zinc-300 p-2 rounded-md justify-center  mt-2">
                                <span className="text-md pointer-events-none italic">Processando edital...</span>
                                <IconLoaderQuarter className="animate-spin ml-2" size={20} />
                            </div>
                        ) : (
                            <>
                                <div className="self-end flex gap-2">
                                    <div className="flex gap-2 absolute bottom-3 right-3">
                                        {
                                            edital.status !== "COMPLETED" && (
                                                <Link href={`/adm/editais/${edital.id}`}>
                                                    <Button title="Visualizar edital" variant={"outline"} size={"icon"} className="h-6 w-6 border-gray-300 hover:cursor-pointer transition-all rounded-sm p-3.5">
                                                        <View />
                                                    </Button>
                                                </Link>
                                            )
                                        }

                                        {
                                            edital.status === "COMPLETED" &&
                                            <Button title="Visualizar edital" variant={"outline"} size={"icon"} className="h-6 w-6 border-gray-300 hover:cursor-pointer transition-all rounded-sm p-3.5">
                                                <View />
                                            </Button>
                                        }

                                        {
                                            usuario?.access_level !== "AUDITOR" && (
                                                <div className="flex items-center gap-2">
                                                    {
                                                        (edital.history && (edital.history[0].status === "UNDER_CONSTRUCTION" || edital.history[0].status === "PENDING")) && (
                                                            <EditarEdital atualizarEditais={funcaoAtualizarEditais} flagEdital={flagEdital} edital={edital} />
                                                        )
                                                    }

                                                    { usuario?.access_level === "ADMIN" && (edital.history && edital.history[0].status === "COMPLETED") && (
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    size={"icon"}
                                                                    title="Arquivar edital "
                                                                    variant={"outline"}
                                                                    className="
                                                                        h-6 w-6 border-gray-300 hover:cursor-pointer transition-all rounded-sm p-3.5
                                                                    "
                                                                >
                                                                    <Archive />
                                                                </Button>
                                                            </DialogTrigger>
                                                            
                                                            <DialogContent className="rounded-2xl">
                                                                <DialogHeader>
                                                                    <DialogTitle className="text-2xl">Arquivar edital</DialogTitle>
                                                                </DialogHeader>

                                                                <DialogDescription className="text-md">
                                                                    Tem certeza que deseja arquivar o edital <span className="font-bold">{edital.name}</span>?
                                                                </DialogDescription>

                                                                <DialogFooter>
                                                                    <DialogClose
                                                                        className="
                                                                            border bg-slate-300 px-3 py-1 rounded-sm hover:cursor-pointer
                                                                        "
                                                                    >
                                                                        Cancelar
                                                                    </DialogClose>

                                                                    <DialogClose asChild>
                                                                        <Button
                                                                            onClick={() => arquivarEdital(edital.id)}
                                                                            size={"icon"}
                                                                            variant={"destructive"}
                                                                            className="w-fit border-gray-300 hover:cursor-pointer transition-all rounded-sm p-3.5"
                                                                        >
                                                                            Arquivar
                                                                        </Button>
                                                                    </DialogClose>
                                                                
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    )}

                                                    {
                                                        ((usuario?.access_level === "ADMIN" || usuario?.access_level === "ANALYST") && (edital.history && (edital.history[0].status === "PENDING" || edital.history[0].status === "UNDER_CONSTRUCTION" || edital.history[0].status === "COMPLETED"))) && (
                                                            <Dialog open={openExcluirEdital} onOpenChange={setOpenExcluirEdital}>
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        size={"icon"}
                                                                        className="
                                                                            h-6 w-6 border-gray-300 bg-vermelho hover:cursor-pointer
                                                                            text-white transition-all rounded-sm p-3.5
                                                                            ">
                                                                        <Trash />
                                                                    </Button>
                                                                </DialogTrigger>

                                                                <DialogContent className="rounded-2xl">
                                                                    <DialogHeader>
                                                                        <DialogTitle className="text-2xl font-bold">Tem certeza que deseja excluir o edital <span className="font-bold">{edital.name}</span>?</DialogTitle>
                                                                        <DialogDescription className="text-[14px] text-vermelho">
                                                                            Após a exclusão, não será possível recuperar os dados desse edital e análise realizada
                                                                        </DialogDescription>
                                                                    </DialogHeader>

                                                                    <DialogFooter>
                                                                        <DialogClose className="border bg-slate-300 px-3 py-1 rounded-sm hover:cursor-pointer">Cancelar</DialogClose>

                                                                        <Button onClick={excluirEdital} variant={"destructive"} className="bg-vermelho hover:cursor-pointer"><Trash /><p>Excluir edital</p></Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
                                                        )
                                                    }

                                                    
                                                </div>
                                            )
                                        }

                                    </div>
                                </div>
                            </>
                        )
                    }
                </div>

            </div>
        </div>
    );
}
