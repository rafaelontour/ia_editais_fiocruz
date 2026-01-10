"use client"

import { ChevronRightIcon } from "lucide-react";
import CategoriaColor from "./CategoriaColor";
import { Button } from "../ui/button";
import AdicionarEdital from "./AdicionarEdital";
import { Dispatch, SetStateAction } from "react";
import useUsuario from "@/data/hooks/useUsuario";

interface Props {
    funcaoAtualizarEditais: Dispatch<SetStateAction<boolean>>
    flagEdital: boolean
}

export default function SuperiorEditais ({ funcaoAtualizarEditais, flagEdital } : Props) {

    const { usuario } = useUsuario();


    return(
        <div className="flex felx-row justify-between items-center gap-5 px-2 h-12">
            <div className="flex flex-row gap-7 items-center">
                <h2 className="text-4xl font-bold">Meus editais</h2>
            </div>
            
            <div className="flex flex-row gap-7 items-center">

                {
                    (usuario?.access_level === "ADMIN" || usuario?.access_level === "ANALYST") && (
                    <div className="w-full">
                        <AdicionarEdital atualizarEditais={funcaoAtualizarEditais} flagEdital={flagEdital} />
                    </div>
                    )
                }

            </div>
        </div>
    );
}