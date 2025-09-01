"use client"

import { ChevronRightIcon } from "lucide-react";
import CategoriaColor from "./CategoriaColor";
import { Button } from "../ui/button";
import AdicionarEdital from "./AdicionarEdital";
import { Dispatch, SetStateAction } from "react";

interface Props {
    funcaoAtualizarEditais: Dispatch<SetStateAction<boolean>>
    flagEdital: boolean
}

export default function SuperiorEditais ({ funcaoAtualizarEditais, flagEdital } : Props) {

    const status = [
        { nome:"Retrabalhando", color:"green" },
        { nome:"Retrabalhar", color:"red" }
    ]

    return(
        <div className="flex felx-row justify-between items-center gap-5 px-2 h-12">
            <div className="flex flex-row gap-7 items-center">
                <Button variant={"outline"} size={"icon"}> <ChevronRightIcon /> </Button>
                <h2 className="text-2xl font-bold">Meus editais</h2>
            </div>
            <div className="flex flex-row gap-7 items-center">
                <div className="text-slate-400 flex gap-5 text-sm">
                    <p>Legendas:</p>
                    <CategoriaColor categoria={status}/>
                
                </div>
                <div className="w-full">
                    <AdicionarEdital atualizarEditais={funcaoAtualizarEditais} flagEdital={flagEdital} />
                </div>
            </div>
        </div>
    );
}