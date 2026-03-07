"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Edital } from "@/core";
import EditarEdital from "./EditarEdital";
import { Button } from "../ui/button";
import { AlertCircle, Archive, Calendar, Clock, Trash, View } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { arquivarEditalService, excluirEditalService } from "@/service/edital";
import { toast } from "sonner";
import Link from "next/link";
import { formatarData } from "@/lib/utils";
import useUsuario from "@/data/hooks/useUsuario";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { IconCheck, IconEdit, IconLoaderQuarter, IconLogs, IconProgressCheck, IconProgressHelp, IconTrash } from "@tabler/icons-react";
import useEditalProc from "@/data/hooks/useProcEdital";
import { AnimatedTooltip } from "../ui/animated-tooltip";
import { buscarLogsEditalService } from "@/service/logs";
import { Log } from "@/core/log/Log";


interface Props {
    edital: Edital;
    containerId: string; // StatusEdital como string
    funcaoAtualizarEditais: Dispatch<SetStateAction<boolean>>;
    flagEdital: boolean
}

export default function CardEdital({ edital, containerId, funcaoAtualizarEditais, flagEdital }: Props) {

    const { usuario } = useUsuario();
    const { lista } = useEditalProc();
    const [openExcluirEdital, setOpenExcluirEdital] = useState<boolean>(false);
    const [logs, setLogs] = useState<Log[]>([]);

    // passa data.containerId para o hook
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: edital.id,
        data: { containerId },
    });

    useEffect(() => {
        if (!!edital) return
    }, [edital])

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

    const editalPronto = !!edital && !!edital.id && Array.isArray(edital.history) && edital.history.length > 0

    const podeEditarEdital = edital.history && editalPronto && edital.history[0].status === "UNDER_CONSTRUCTION" || edital.history && edital.history[0].status === "PENDING"

    interface LogsPorData {
        [key: string]: Log[]
    }
    const [carregandoLogs, setCarregandoLogs] = useState<boolean>(true);
    const [logsPorData, setLogsPorData] = useState<LogsPorData>({});

    function filtrarLogsPorData(logs: Log[]) {
        const logsPorData: LogsPorData = {};

        logs.forEach((log) => {
            const data = formatarData(log.created_at.split("T")[0], true);

            if (!logsPorData[data]) {
                logsPorData[data] = [];
            }

            logsPorData[data].push(log);
        });

        // Ordena logs internos
        Object.keys(logsPorData).forEach((data) => {
            logsPorData[data].sort(
                (a, b) =>
                    new Date(a.created_at).getTime() -
                    new Date(b.created_at).getTime()
            );
        });

        // Ordena as chaves corretamente
        const datasOrdenadas = Object.keys(logsPorData).sort(
            (a, b) =>
                new Date(a.split('/').reverse().join('-')).getTime() -
                new Date(b.split('/').reverse().join('-')).getTime()
        );

        const resultado: LogsPorData = {};

        datasOrdenadas.forEach((data) => {
            resultado[data] = logsPorData[data];
        });

        return resultado;
    }

    async function buscarLogs(id: string) {
        const resposta = await buscarLogsEditalService(id);
        const logsPorData = filtrarLogsPorData(resposta.audit_logs);
        console.log(logsPorData);
        setLogsPorData(logsPorData);
        setCarregandoLogs(false);
    }

    function verificarAcao(acao: string) {
        switch (acao) {
            case "CREATE":
                return <IconCheck size={14} className="text-green-500" />
            case "UPDATE":
                return <IconEdit size={14} className="" />
            case "DELETE":
                return <IconTrash size={14} className="text-red-500" />
            default:
                return acao
        }
    }

    function verificarTextoAcao(acao: string, log: Log) {
        switch (acao) {
            case "CREATE":
                return <p>O documento foi criado pelo usuário <i>{log.user.username?.split(" ")[0]}</i></p>
            case "UPDATE":
                 return <ul className="flex flex-col gap-1 list-none">
                    {log.description.includes("Alterou Nome") && (
                        <li>
                            O usuário <i>{log.user.username?.split(" ")[0]}</i> alterou o nome do edital {log.description.split("Alterou Nome")[1].split(";")[0]}.
                        </li>
                    )}

                    {log.description.includes("Typifications") && (
                        <li>
                            O usuário <i>{log.user.username?.split(" ")[0]}</i> modificou as tipificações.
                        </li>
                    )}

                    {log.description.includes("Identifier") && (
                        <li>
                            O usuário <i>{log.user.username?.split(" ")[0]}</i> alterou o identificador do edital.
                        </li>
                    )}

                    {log.description.includes("Editors") && (
                        <li>
                            O usuário <i>{log.user.username?.split(" ")[0]}</i> alterou os responsáveis do edital.
                        </li>
                    )}

                    {log.description.includes("Salvo sem") && (
                        <li>
                            O usuário <i>{log.user.username?.split(" ")[0]}</i> salvou sem alterações.
                        </li>
                    )}

                    {log.description.split("para")[0].includes("Moveu") && (
                        <li 
                            className={`
                                flex flex-col list-none rounded-md text-white gap-4
                            `}
                        >
                            <p className="flex items-center gap-2 font-bold">
                                {/* <AlertCircle size={16} /> */}
                                <span className="text-lg">Mudança de coluna</span>
                            </p>

                            <p>O usuário <i>{log.user.username?.split(" ")[0]}</i> moveu {log.description.split("Moveu")[1]}.</p>
                        </li>
                    )}
                </ul>
            case "DELETE":
                return <p>O documento foi excluído pelo usuário <i>{log.user.username?.split(" ")[0]}</i></p>
            default:
                return acao
        }
    }

    return (
        <div
            ref={setNodeRef}
            title={lista.includes(edital.id) ? "Aguarde o processamento do edital para ver o resultado" : edital.name}
            style={style}
            className={`
                bg-white rounded-md shadow-sm wrap-break-word
                ${isDragging ? "opacity-30" : "opacity-100"}
            `}
        >

            {/* drag handle: aplicamos attributes & listeners aqui (evita conflitos com botões dentro do card) */}
            <div {...attributes} {...listeners} className={`${lista.includes(edital.id) && "hidden"} h-12 teste ${cor()} rounded-t-sm flex items-center justify-center`}>
                <span
                    className={`
                        w-full text-center text-white text-md pointer-events-none italic
                    `}
                >
                    Segure nesta área para arrastar
                </span>
            </div>

            <div className="grid grid-cols-1 relative p-3 overflow-x-hidden">
                <div className="flex flex-col-reverse items-start justify-between min-w-0 wrap-break-word relative">
                    <h3 style={{ maxWidth: "-webkit-fill-available"}} className="font-semibold text-xl min-w-0 wrap-break-word">{edital.name}</h3>

                    <div className="relative w-full flex justify-between">
                        {
                            (edital.history &&
                            edital.history.filter((h) => h.status === "UNDER_CONSTRUCTION").length >= 2 &&
                            edital.history.filter((h) => h.status === "WAITING_FOR_REVIEW").length >= 1) && (
                                <div className="mt-1 mb-2">
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
                                </div>
                            )
                        }
                            
                    </div>
                </div>

                <div className="relative py-5">
                    <div className="h-0.5 w-full bg-zinc-300" />
                    <Dialog>
                        <DialogTrigger onClick={() => buscarLogs(edital.id)} asChild>
                            <div
                                className="
                                    bg-zinc-200 rounded-sm px-2 py-0.5
                                    flex items-center gap-1 absolute left-1/2 -translate-x-1/2 top-2
                                    hover:cursor-pointer
                                "
                                title="Ver histórico de atualização do edital"
                                style={{ boxShadow: "0 0 3px rgba(0,0,0,.7)" }}
                            >
                                <p className="text-sm italic">Logs</p>
                                <IconLogs size={18} />
                            </div>
                        </DialogTrigger>

                        <DialogContent className="flex flex-col w-[60%] max-h-[85%] overflow-hidden no-scrollbar">
                            <div className="flex flex-col gap-2">
                                <DialogHeader>
                                    <DialogTitle className="text-3xl">Logs do documento <strong>{edital.name}</strong></DialogTitle>
                                </DialogHeader>
                                <DialogDescription className="text-lg">
                                    Ações realizadas no documento desde sua criação.
                                </DialogDescription>
                            </div>

                            <div className="flex-1 overflow-y-auto no-scrollbar">
                                {
                                    !carregandoLogs ? (
                                        logsPorData && Object.keys(logsPorData).length > 0 ? (
                                            Object.entries(logsPorData).map(([data, logs]) => (
                                                <div key={data} className="">
                                                    <span className="flex sticky w-full top-0 items-center gap-2 font-semibold py-2 bg-white z-10">
                                                        <Calendar size={18} />
                                                        {data}
                                                    </span>

                                                    <div className="flex w-full relative">
                                                        <div className="absolute ml-[7px] w-1 h-full bg-zinc-600 rounded-full" />
                                                        <div className="w-full">
                                                            {logs.map((log: Log) => (
                                                                <div key={log.id}
                                                                    className={`
                                                                        flex items-center pl-5 overflow-hidden m-4 mt-5 rounded-md ml-10 relative
                                                                        ${log.description.split("para")[1]?.includes("Em construção") ? "bg-[#fa9292]" :
                                                                        log.description.split("para")[1]?.includes("Pendente") ? "bg-[#a1a5ad]" :
                                                                        log.description.split("para")[1]?.includes("Aguardando revisão") ? "bg-[#afa780]" :
                                                                        log.description.split("para")[1]?.includes("Concluído") ? "bg-[#6ed36e]" : "bg-[#f2f2f2]"}
                                                                    `}
                                                                >
                                                                    <div
                                                                        className={`
                                                                            ${log.action !== "CREATE" && "absolute top-1/2 -translate-y-1/2"} flex items-center justify-center rounded-full p-2 bg-white
                                                                        `}
                                                                        title={`${log.action === "CREATE" ? "Criação do documento" : log.action === "UPDATE" ? "Atualização do documento" : "Exclusão do documento"}`}
                                                                    >
                                                                        {verificarAcao(log.action)}
                                                                    </div>
                                                                    <div />

                                                                    <div className="flex w-full h-full items-stretch justify-between">
                                                                        <div className={`p-5 ${log.action !== "CREATE" && "ml-7"} w-full`} title="Ação realizada">
                                                                            {verificarTextoAcao(log.action, log)}
                                                                        </div>

                                                                        <div
                                                                            className="
                                                                                flex min-h-max items-center gap-2 text-zinc-600 border-[#f2f2f2] bg-zinc-50 border-2
                                                                                rounded-br-md rounded-tr-md p-5
                                                                            "
                                                                            title="Horário que a ação foi realizada"
                                                                        >
                                                                            <span className="italic">{formatarData(log.created_at, false, true)}</span>
                                                                            <Clock size={14} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="h-12 w-full flex items-center bg-zinc-300 p-2 rounded-md justify-center">
                                                <span className="text-md pointer-events-none italic">Nenhum log encontrado para este edital</span>
                                            </div>
                                        )
                                    ) : (
                                        <div>Carregando...</div>
                                    )
                                }
                            </div>

                        </DialogContent>

                        {
                            edital.status === "COMPLETED" && 
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button onClick={() => arquivarEdital(edital.id)}>Arquivar edital</Button>
                                </DialogClose>
                            </DialogFooter>
                        }
                    </Dialog>
                </div>

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
                        lista.includes(edital.id) ? (
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
                                                <div className={`flex items-center gap-2 ${editalPronto ? "flex" : "hidden"} `}>
                                                    {   
                                                        podeEditarEdital && (
                                                            <EditarEdital atualizarEditais={funcaoAtualizarEditais} flagEdital={flagEdital} edital={edital} />
                                                        )
                                                    }

                                                    { usuario?.access_level === "ADMIN" && (edital.history && edital.history[0].status === "COMPLETED") && (
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    size={"icon"}
                                                                    title="Arquivar edital"
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
