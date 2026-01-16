"use client"

import { Archive, ChevronRightIcon } from "lucide-react";
import CategoriaColor from "./CategoriaColor";
import { Button } from "../ui/button";
import AdicionarEdital from "./AdicionarEdital";
import { Dispatch, SetStateAction } from "react";
import useUsuario from "@/data/hooks/useUsuario";
import Link from "next/link";

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
                    <div className="w-full flex items-center gap-2">
                        <Link href="/adm/editais/arquivados">
                            <Button
                                variant={"destructive"}
                                className="
                                    bg-vermelho text-white
                                    hover:cursor-pointer px-4
                                    flex items-center gap-2
                                "
                                style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                            >
                                <Archive size={18} />
                                <p>Editais arquivados</p>
                            </Button>
                        </Link>

                        <AdicionarEdital atualizarEditais={funcaoAtualizarEditais} flagEdital={flagEdital} />
                    </div>
                    )
                }

            </div>
        </div>
    );
}