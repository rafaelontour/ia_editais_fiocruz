'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Tipificacao } from "@/core";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Calendar, ChevronRightIcon, PencilLine, Plus, Trash } from "lucide-react";
import { useState } from "react";

export default function  Tipificacoes() {
    
    const [dialogTipificacao, setDialogTipificacao] = useState(false);

    const tipificacoes: Tipificacao[] = [
        {
            id: 1,
            nome: "Tipificacao 1",
            lei: "Lei 1",
            lei_complementar: "Lei Complementar 1",
            data: "12/12/2022"
        },
        {
            id: 2,
            nome: "Tipificacao 2",
            lei: "Lei 2",
            lei_complementar: "Lei Complementar 2",
            data: "8/12/2022"
        },
        {
            id: 3,
            nome: "Tipificacao 3",
            lei: "Lei 3",
            lei_complementar: "Lei Complementar 3",
            data: "10/12/2020"
        },
        {
            id: 4,
            nome: "Tipificacao 4",
            lei: "Lei 4",
            lei_complementar: "Lei Complementar 4",
            data: "20/12/2010"
        },
        {
            id: 5,
            nome: "Tipificacao 5",
            lei: "Lei 5",
            lei_complementar: "Lei Complementar 5",
            data: "30/12/2000"
        },
        {
            id: 6,
            nome: "Tipificacao 6",
            lei: "Lei 6",
            lei_complementar: "Lei Complementar 6",
            data: "20/12/1990"
        },
        {
            id: 7,
            nome: "Tipificacao 7",
            lei: "Lei 7",
            lei_complementar: "Lei Complementar 7",
            data: "20/12/1980"
        },
        {
            id: 8,
            nome: "Tipificacao 8",
            lei: "Lei 8",
            lei_complementar: "Lei Complementar 8",
            data: "20/12/1970"
        },
        {
            id: 9,
            nome: "Tipificacao 9",
            lei: "Lei 9",
            lei_complementar: "Lei Complementar 9",
            data: "20/12/1960"
        },
        {
            id: 10,
            nome: "Tipificacao 10",
            lei: "Lei 10",
            lei_complementar: "Lei Complementar 10",
            data: "20/12/1950"
        },
        {
            id: 11,
            nome: "Tipificacao 11",
            lei: "Lei 11",
            lei_complementar: "Lei Complementar 11",
            data: "20/12/1940"
        },
        {
            id: 12,
            nome: "Tipificacao 12",
            lei: "Lei 12",
            lei_complementar: "Lei Complementar 12",
            data: "20/12/1930"
        },
        {
            id: 13,
            nome: "Tipificacao 13",
            lei: "Lei 13",
            lei_complementar: "Lei Complementar 13",
            data: "20/12/1920"
        }
    ]


    return(
        <div>
            <div className="flex flex-col gap-7">
                <div className="flex justify-between w-full items-center">
                    <div className="flex gap-6">
                        <Button variant={"outline"} size={"icon"}>
                            <ChevronRightIcon />
                        </Button>
                        <h2 className="text-2xl font-bold">Gestão de tipificações</h2>
                    </div>

                    <Dialog open={dialogTipificacao} onOpenChange={setDialogTipificacao}>
                        <DialogTrigger>
                            <div
                                style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)"}}
                                className={`
                                    flex rounded-md gap-2 items-center px-4 py-2
                                    transition duration-100
                                    bg-verde hover:bg-verde text-white
                                    hover:cursor-pointer hover:scale-110 active:scale-100
                                `}
                            >
                                <Plus className=""/>
                                <p className="text-white">Adicionar</p>
                            </div> 
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-3xl font-bold">
                                    Criar tipificação
                                </DialogTitle>
                                
                                <DialogDescription className="text-md pb-4">
                                    Adicione todos os dados da tipificação.
                                </DialogDescription>
                            </DialogHeader>

                                <form className="flex text-lg flex-col gap-4">
                                    <p className="flex flex-col gap-2">
                                        <label className="">Nome da tipificação</label>
                                        <input type="text" className="border-2 border-gray-300 rounded-md p-2 w-full" />
                                    </p>
                                    <p className="flex flex-col gap-2">
                                        <label>Fontes</label>
                                        <select className="border-2 border-gray-300 rounded-md p-2">
                                            <option>Fonte 1</option>
                                            <option>Fonte 2</option>
                                            <option>Fonte 3</option>
                                            <option>Fonte 4</option>
                                            <option>Fonte 5</option>
                                        </select>
                                    </p>
                                </form>

                                <div className="flex justify-end gap-4 mt-4">
                                    <DialogClose
                                        className={`
                                            transition ease-in-out text-white
                                            rounded-md px-3 bg-vermelho
                                            hover:cursor-pointer
                                            hover:scale-110 active:scale-100
                                        `}
                                        style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)"}}
                                    >
                                        Cancelar
                                    </DialogClose>
                                    
                                    <Button
                                        className={`
                                            flex bg-verde hover:bg-verde
                                            text-white hover:cursor-pointer
                                            hover:scale-110 active:scale-100
                                        `}
                                        style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)"}}
                                        onClick={() => setDialogTipificacao(false)}
                                    >
                                        Salvar
                                    </Button>
                                </div>
                        </DialogContent>

                    </Dialog>
                </div>
                
                <div
                    className="
                        grid [grid-template-columns:1fr] xl:[grid-template-columns:1fr_1fr_1fr_1fr]
                        lg:[grid-template-columns:1fr_1fr_1fr] md:[grid-template-columns:1fr_1fr] gap-7
                    "
                >
                    {tipificacoes.map((tipificacao, index) => (
                        <div
                            style={{ boxShadow: "0 0 5px rgba(0,0,0,.3)"}} 
                            key={index}
                            className="
                                flex flex-col gap-2 rounded-md p-4
                                hover:scale-105 transition ease-in-out duration-100
                            "
                        >
                            <div className="flex flex-col gap-2">
                                <h2 className="text-xl font-semibold">{tipificacao.nome}</h2>
                                <p className={`bg-verde py-1 px-2 text-white rounded-md border-2 border-gray-300 w-fit text-sm`}>
                                Lei: {tipificacao.lei}
                                </p>
                                <p className={`bg-verde py-1 px-2 text-white rounded-md border-2 border-gray-300 w-fit text-sm`}>
                                Lei Complementar: {tipificacao.lei_complementar}
                                </p>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                                <p className="flex items-center gap-2 text-sm text-gray-400">
                                    <Calendar size={16} />
                                    <span>{tipificacao.data}</span>
                                </p>
                                <div className="flex gap-3">
                                    <Button
                                        className={`
                                            h-8 w-8 hover:cursor-pointer hover:scale-110 active:scale-100
                                            bg-branco hover:bg-branco
                                        `}
                                        style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)"}}
                                        size={"icon"}
                                        
                                    >
                                        <PencilLine color="black" />
                                    </Button>

                                    <Button
                                        className={`
                                            h-8 w-8 bg-vermelho hover:bg-vermelho
                                            hover:cursor-pointer hover:scale-110 active:scale-100
                                        `}
                                        style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)"}}
                                        size={"icon"}
                                    >
                                        <Trash />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}