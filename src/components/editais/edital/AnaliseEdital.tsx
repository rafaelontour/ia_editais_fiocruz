import Linha03 from "./analiselinhas/Linha03";
import Linha04 from "./analiselinhas/Linha04";
import ConversaIa from "./ConversaIa";

export default function AnaliseEdital () {
    return(
        <div className="flex flex-col gap-4">
            <ConversaIa/>

            <Linha03/>

            <Linha04/>
        </div>
    );
}