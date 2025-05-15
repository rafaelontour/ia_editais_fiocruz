
import Linha01 from "./analiselinhas/linha01";
import Linha02 from "./analiselinhas/Linha02";

export default function AnaliseEdital () {
    return(
        <div className="flex flex-col gap-4">
            <Linha01/>

            <Linha02/>
        </div>
    );
}