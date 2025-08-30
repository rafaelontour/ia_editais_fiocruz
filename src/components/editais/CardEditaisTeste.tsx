// CardEditaisTeste.tsx
"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Edital } from "@/core";
import EditarEdital from "./EditarEdital";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
interface Props {
    edital: Edital;
    containerId: string; // StatusEdital como string
}

export default function CardEditaisTeste({ edital, containerId }: Props) {
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

    const cor = () => {
        switch (edital.status) {
            case "rascunho":
                return "bg-gray-400";
            case "construcao":
                return "bg-red-500";
            case "analise":
                return "bg-[#656149]";
            case "concluido":
                return "bg-green-800";
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            // se quiser esconder o original enquanto usa overlay: opacity reduzida
            className={`bg-white rounded-md border border-gray-300 shadow-sm ${isDragging ? "opacity-30" : "opacity-100"}`}
        >
            {/* drag handle: aplicamos attributes & listeners aqui (evita conflitos com botões dentro do card) */}
            <div {...attributes} {...listeners} className={`h-12 ${cor()} rounded-t-sm flex items-center justify-center`}>
                <span className="text-xs text-white pointer-events-none italic">Segure nesta área para arrastar</span>
            </div>

            <div className="p-3">
                <h3 className="font-semibold text-sm">{edital.name}</h3>
                <div
                    className="
                        flex justify-between items-center
                    "
                >
                    <div className="flex flex-col-reverse text-xs text-gray-500 justify-between mt-2">
                        <span>Compras</span>
                        <span>{edital.created_at}</span>
                    </div>

                    <div className="self-end flex gap-2">
                        <EditarEdital />
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
                                    <DialogDescription className="font-bold text-xs">
                                        Após a exclusão, não será possibile recuperar os dados desse edital e análise realizada
                                    </DialogDescription>
                                </DialogHeader>

                                <DialogFooter>
                                    <DialogClose className="border bg-slate-300 px-3 py-1 rounded-sm hover:cursor-pointer">Cancelar</DialogClose>

                                    <Button className="bg-vermelho hover:cursor-pointer"><Trash /><p>Excluir edital</p></Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
}
