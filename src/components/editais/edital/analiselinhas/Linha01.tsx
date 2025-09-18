import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Link from "next/link";

export default function Linha01 () {
    return(
        <div className="flex flex-row justify-between">
            <div className=" flex flex-col">
                <h2 className="text-xl font-bold">Análise do edital</h2>
                <p className="text-sm font-semibold text-gray-400">versão 1.0.1</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
                <div className="bg-gray-200 flex gap-0.5 p-1 rounded-md"> 
                    <Button variant={"outline"} className="text-xs py-0.5 px-2" size="sm">
                        Resultado do edital
                    </Button>

                    <Link href={"/editais/edital/comentarios"}>
                        <Button variant={"outline"} className="text-xs py-0.5 px-2" size="sm">
                            Comentários
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}