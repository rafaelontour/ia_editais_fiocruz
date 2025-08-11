import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Plus } from "lucide-react";

export default function AtribuirCargo () {
    return(
        <div>
            {/* MENU SUPERIOR - ATRIBUIR CARGO */}
            <div className="flex flex-row justify-between w-full">
                <div className="flex flex-row gap-2 items-center">
                    <Button variant={"outline"} size={"icon"} className="cursor-pointer"><ChevronLeft /></Button>
                    <h2 className="text-2xl font-semibold">Gerenciar Usuários</h2>
                </div>
                <div>
                    <Button variant={"outline"}
                        className="bg-vermelho text-white items-center cursor-pointer hover:scale-105 hover:bg-vermelho hover:text-white transition-all"
                        >
                        <Plus />
                        <Label>Adicionar Usuário</Label>
                    </Button>
                </div>
            </div>
        </div>
    );
}