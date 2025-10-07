import { Edital } from "@/core";
import Linha01 from "./analiselinhas/Linha01";
import Linha02 from "./analiselinhas/Linha02";
import Linha03 from "./analiselinhas/Linha03";
import Linha04 from "./analiselinhas/TaxonomiasResultado";
import ConversaIa from "./ConversaIa";
import { formatarData } from "@/lib/utils";
import { EditalArquivo } from "@/core/edital/Edital";

interface Props {
    edital: Edital | undefined
    editalArquivo: EditalArquivo | undefined
}

export default function AnaliseEdital ({ edital, editalArquivo }: Props) {
    
    return (
        <div className="flex max-w-fit flex-col gap-4">
            <Linha01 />

            <Linha02 edital={edital} editalArquivo={editalArquivo} />

            <Linha03 resumoIA={editalArquivo?.releases[0].description} edital={edital} />
        </div>
    );
}