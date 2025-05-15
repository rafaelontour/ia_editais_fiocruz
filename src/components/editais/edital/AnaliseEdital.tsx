import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function AnaliseEdital () {
    return(
        <div className="flex flex-row justify-between">
            <div className=" flex flex-col">
                <h2 className="text-xl font-semibold">Análise do edital</h2>
                <p className="text-sm text-gray-400">Versão 1.0.1</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
                <Button variant={"outline"} className="items-center text-white bg-orange-600">
                    <Upload className=""/>
                    <p>Editar edtial</p>
                </Button>
                <div className="bg-gray-200 flex gap-0.5 p-1 rounded-md"> 
                    <Button variant={"outline"} className="text-xs py-0.5 px-2" size="sm">Resultado do edital</Button>
                    <Button variant={"outline"} className="text-xs py-0.5 px-2" size="sm">Comentários</Button>
                    <Button variant={"outline"} className="text-xs py-0.5 px-2" size="sm">Configurações</Button>
                </div>
            </div>
        </div>
    );
}