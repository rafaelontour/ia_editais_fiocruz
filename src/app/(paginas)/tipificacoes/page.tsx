'use client'

import { Button } from "@/components/ui/button";
import { Calendar, ChevronRightIcon, Edit, Plus, Trash } from "lucide-react";

import Masonry from 'react-masonry-css';

export default function  Tipificacoes() {

    type Tipificacao = {
        nome: string,
        lei: string,
        lei_complementar: string,
        data: string
    }

    const tipificacoes: Tipificacao[] = [
        {
            nome: "Tipificacao 1",
            lei: "Lei 1",
            lei_complementar: "Lei Complementar 1",
            data: "12/12/2022"
        },
        {
            nome: "Tipificacao 2",
            lei: "Lei 2",
            lei_complementar: "Lei Complementar 2",
            data: "8/12/2022"
        },
        {
            nome: "Tipificacao 3",
            lei: "Lei 3",
            lei_complementar: "Lei Complementar 3",
            data: "10/12/2020"
        },
        {
            nome: "Tipificacao 4",
            lei: "Lei 4",
            lei_complementar: "Lei Complementar 4",
            data: "20/12/2010"
        },
        {
            nome: "Tipificacao 5",
            lei: "Lei 5",
            lei_complementar: "Lei Complementar 5",
            data: "30/12/2000"
        },
        {
            nome: "Tipificacao 6",
            lei: "Lei 6",
            lei_complementar: "Lei Complementar 6",
            data: "20/12/1990"
        }
    ]

    return(
        <div>
            <div className="flex flex-col gap-7">
                <div className="flex justify-between w-full gap-7 items-center">
                    <div className="flex gap-6">
                        <Button variant={"outline"} size={"icon"}>
                            <ChevronRightIcon />
                        </Button>
                        <h2 className="text-2xl font-bold">Gestão de tipificações</h2>
                    </div>

                    <Button variant={"outline"} className="bg-[#CE4A3F] text-white">
                        <Plus className=""/>
                        <p>Adicionar</p>
                    </Button> 
                </div>
                
                <div
                    className="
                        grid [grid-template-columns:1fr] xl:[grid-template-columns:1fr_1fr_1fr_1fr]
                        lg:[grid-template-columns:1fr_1fr_1fr] md:[grid-template-columns:1fr_1fr] gap-4
                    "
                >
                    {tipificacoes.map((tipificacao, index) => (
                        <div style={{ boxShadow: "0 0 5px rgba(0,0,0,.3)"}} key={index} className="flex flex-col gap-2 rounded-md p-4">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-lg font-semibold">{tipificacao.nome}</h2>
                            <p className="bg-[#2D8E86] py-1 px-2 text-white rounded-md border-2 border-gray-300 w-fit text-sm">
                            Lei: {tipificacao.lei}
                            </p>
                            <p className="bg-[#2D8E86] py-1 px-2 text-white rounded-md border-2 border-gray-300 w-fit text-sm">
                            Lei Complementar: {tipificacao.lei_complementar}
                            </p>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                            <p className="flex items-center gap-2 text-sm text-gray-400">
                                <Calendar size={16} />
                                <span>{tipificacao.data}</span>
                            </p>
                            <div className="flex gap-1">
                            <Button className="h-8 w-8" variant={"outline"} size={"icon"}>
                                <Edit />
                            </Button>
                            <Button className="h-8 w-8 bg-[#C1363D]" color="white" size={"icon"}>
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