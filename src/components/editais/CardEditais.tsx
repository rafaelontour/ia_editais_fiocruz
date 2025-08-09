"use client"

import { Calendar, Sparkle, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import EditarEdital from "./EditarEdital";
import Link from "next/link";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edital } from "@/core";

export interface CardEditaisProps {
    edital: Edital;
}

export default function CardEditais ({ edital }: CardEditaisProps) {
    const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: edital.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms ease',
    opacity: isDragging ? 0.5 : 1,
  };

    return(
        <div 
        ref={setNodeRef}
        style={style}
        className="flex flex-col rounded-md overflow-hidden border-2 border-gray-300 cursor-grab active:cursor-grabbing">
            <div {...attributes} {...listeners} className="bg-[#dedede]  h-16"></div>

            <div className="flex flex-col bg-gray-50 py-2.5 px-3 gap-4">
                <div > {/* O QUE FAZ MOVIENTAR - DRAG HANDLE*/}
                    <div>{edital.titulo}</div>
                    <div className="flex flex-row justify-between items-center">
                        <p className="text-sm">{edital.categoria}</p>
                        <div className="flex flex-row text-gray-500">
                            <p className="text-[8px]">{edital.data}</p>
                            <Calendar className="h-3"/>
                        </div>
                    </div>
                </div>
                <div className="flex gap-0.5 justify-end">
                    {/* COLOCAR O STATUS */}
                    { (edital.status !== "rascunho" && edital.status !== "concluido") ? (
                        <Link href={"/editais/edital"}><Button variant={"outline"} size={"icon"} className="h-6 w-6 border-gray-300"><Sparkle/></Button></Link>
                    ) : null
                    }
                   <EditarEdital/>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant={"outline"} size={"icon"} className="h-6 w-6 border-gray-300 bg-vermelho text-white hover:text-black transition-all"><Trash className=""/></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl">
                            <AlertDialogHeader>
                                    <AlertDialogTitle className="text-2xl font-bold">Tem certeza que deseja excluir o edital Edital Fiocruz 2025/1?</AlertDialogTitle>
                                <AlertDialogDescription className="font-bold text-xs">
                                    Após a exclusão, não será possível recuperar os dados desse edital e análise realizada
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction className="bg-vermelho"><Trash/><p>Excluir edital</p></AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    );
}