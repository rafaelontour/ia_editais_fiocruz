
import Linha01 from "./analiselinhas/linha01";
import Linha02 from "./analiselinhas/Linha02";
import Linha03 from "./analiselinhas/Linha03";
import Linha04 from "./analiselinhas/Linha04";

export default function AnaliseEdital () {
    return(
        <div className="flex flex-col gap-4">
            <Linha01/>

            <Linha02/>

            <Linha03/>

            <Linha04/>
        </div>
    );
}