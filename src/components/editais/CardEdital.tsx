"use client";

import React, { Dispatch, SetStateAction } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Edital } from "@/core";
import EditarEdital from "./EditarEdital";
import { Button } from "../ui/button";
import { Info, Trash, View } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { excluirEditalService } from "@/service/edital";
import { toast } from "sonner";
import Link from "next/link";
import { formatarData } from "@/lib/utils";
import useUsuario from "@/data/hooks/useUsuario";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { IconProgressCheck, IconProgressHelp } from "@tabler/icons-react";


interface Props {
    edital: Edital;
    containerId: string; // StatusEdital como string
    funcaoAtualizarEditais: Dispatch<SetStateAction<boolean>>
    flagEdital: boolean
}

export default function CardEdital({ edital, containerId, funcaoAtualizarEditais, flagEdital }: Props) {
    const { usuario } = useUsuario();
    
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

    return (
        <div
            ref={setNodeRef}
            style={style}
            // se quiser esconder o original enquanto usa overlay: opacity reduzida
            className={`bg-white rounded-md  shadow-sm ${isDragging ? "opacity-30" : "opacity-100"}`}
        >
            {/* drag handle: aplicamos attributes & listeners aqui (evita conflitos com botões dentro do card) */}
            <div {...attributes} {...listeners} className={`h-12 ${cor()} rounded-t-sm flex items-center justify-center`}>
                <span className="text-md text-white pointer-events-none italic">Segure nesta área para arrastar</span>
            </div>

            <div className="relative p-3">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-xl">{edital.name}</h3>

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
                </div>

                <div
                    className="
                        flex justify-between items-center
                    "
                >
                    <div className="flex flex-col-reverse text-md justify-between mt-2">
                        <span>Compras</span>
                        <span>{formatarData(edital.created_at)}</span>
                    </div>

                    <div className="self-end flex gap-2">
                        <div className="flex gap-2 absolute bottom-3 right-3">
                            {
                                edital.status !== "COMPLETED" && (
                                    <Link href={`/adm/editais/${edital.id}`}>
                                        <Button title="Visualizar edital" variant={"outline"} size={"icon"} className="h-6 w-6 border-gray-300 hover:cursor-pointer transition-all rounded-sm p-[14px]">
                                            <View  />
                                        </Button>
                                    </Link>
                                )
                            }

                            {
                                edital.status === "COMPLETED" &&
                                <Button title="Visualizar edital" variant={"outline"} size={"icon"} className="h-6 w-6 border-gray-300 hover:cursor-pointer transition-all rounded-sm p-[14px]">
                                    <View  />
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

                                        {
                                            ((usuario?.access_level === "ADMIN" || usuario?.access_level === "ANALYST") && (edital.history && (edital.history[0].status === "PENDING" || edital.history[0].status === "UNDER_CONSTRUCTION"))) && (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            size={"icon"}
                                                            className="
                                                            h-6 w-6 border-gray-300 bg-vermelho hover:cursor-pointer
                                                            text-white transition-all rounded-sm p-[14px]
                                                            ">
                                                                <Trash />
                                                        </Button>
                                                    </DialogTrigger>

                                                    <DialogContent className="rounded-2xl">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-2xl font-bold">Tem certeza que deseja excluir o edital Edital Fiocruz 2025/1?</DialogTitle>
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
                </div>

                <div>
                    {
                        edital.editors && edital.editors?.length > 1 ? (
                            <h4>Responsáveis:</h4>
                        ) : (
                            <h4>Responsável:</h4>
                        )
                    }

                    <ul>
                        {
                            edital.editors?.map((editor, index) => (
                                <li key={index} className="list-disc text-md ml-4">{editor.username}</li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    );
}
