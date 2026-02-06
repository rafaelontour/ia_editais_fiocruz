import { Edital } from "@/core";
import Linha01 from "./analiselinhas/Linha01";
import Linha02 from "./analiselinhas/Linha02";
import Linha03 from "./analiselinhas/Linha03";
import { EditalArquivo } from "@/core/edital/Edital";

interface Props {
    edital: Edital | undefined
    editalArquivo: EditalArquivo | undefined
    resumoIA?: string
}

export default function AnaliseEdital ({ edital, editalArquivo, resumoIA }: Props) {
    
    return (
        <div className="flex w-full flex-col gap-4">
            <Linha01 edital={edital} />

            <div className="flex flex-col gap-4 overflow-y-auto">
                <Linha02 edital={edital} editalArquivo={editalArquivo} />
                <Linha03 edital={editalArquivo} resumoIA={resumoIA} />
            </div>
        </div>
    );
}