import { ChevronRightIcon } from "lucide-react";
import CategoriaColor from "./CategoriaColor";
import { Button } from "./ui/button";

export default function SuperiorEditais () {
    return(
        <div className="flex felx-row justify-between items-center gap-5 px-2 h-12">
            <div className="flex flex-row gap-7 items-center">
                <Button variant={"outline"} size={"icon"}> <ChevronRightIcon /> </Button>
                <h2 className="text-2xl font-bold">Meus editais</h2>
            </div>
            <div className="flex flex-row gap-7 items-center">
                <div className="text-slate-400 flex gap-5">
                    <p>Legendas:</p>
                    <CategoriaColor/>
                
                </div>
                <Button variant={"outline"}>Enviar novo edital</Button> {/* ADICIONAR ÍCONE */}
            </div>
        </div>
    );
}