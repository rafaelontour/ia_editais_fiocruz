"use client";

import { Edital } from "@/core";
import Linha01 from "./analiselinhas/Linha01";
import Linha02 from "./analiselinhas/Linha02";
import Linha03 from "./analiselinhas/Linha03";
import Linha04 from "./analiselinhas/Linha04";
import ConversaIa from "./ConversaIa";
import { formatarData } from "@/lib/utils";
import { use, useEffect, useState } from "react";
import { buscarResponsavelEdital } from "@/service/usuario";
import { toast } from "sonner";

interface Props {
    edital: Edital | undefined
}

export default function AnaliseEdital ({ edital }: Props) {

    const [editor, setEditor] = useState<string | null>(null);

    
    async function buscarResponsavel() {
        if (!edital?.editors) { toast.error("Erro ao buscar responsável!"); return }
        
        const resposta = await buscarResponsavelEdital(edital?.editors[0]);
        console.log("Resposta: ", resposta);
        
        setEditor(resposta);
    }

    useEffect(() => {
        buscarResponsavel();
    }, [edital]);
    
    return (
        <div className="flex flex-col gap-4">
            <Linha01 />

            <Linha02 responsavel={editor} data={formatarData(edital?.created_at)} numero={edital?.identifier} descricao={edital?.description}  />

            <Linha03/>

            <Linha04/>

            <ConversaIa/>
        </div>
    );
}