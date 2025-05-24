import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play } from "lucide-react";

export default function ConversaIa () {
    return(
        <div className="flex flex-col gap-2">
            <div className="relative">
                <Textarea
                    placeholder="Analise o edital aplicando as taxonomias de verificação adequadas à tipificação do edital"
                    className="pr-24 h-26 pt-3 px-4" // espaço opcional para não sobrepor o botão
                />
                <Button
                    variant="outline"
                    size="sm"
                    className="absolute bottom-2 right-2 flex items-center gap-1 "
                >
                    <Play size={16} />
                    <span className="text-sm">Analisar edital</span>
                </Button>
            </div>


        </div>
    );
}