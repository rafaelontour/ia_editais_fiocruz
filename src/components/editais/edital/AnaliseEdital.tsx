import { Edital } from "@/core";
import Linha01 from "./analiselinhas/Linha01";
import Linha02 from "./analiselinhas/Linha02";
import Linha03 from "./analiselinhas/Linha03";
import Linha04 from "./analiselinhas/TaxonomiasResultado";
import ConversaIa from "./ConversaIa";
import { formatarData } from "@/lib/utils";

interface Props {
    edital: Edital | undefined
}

export default function AnaliseEdital ({ edital }: Props) {
    
    return (
        <div className="flex flex-col gap-4">
            <Linha01 />

            <Linha02 edital={edital} />

            <Linha03 edital={edital} />
        </div>
    );
}