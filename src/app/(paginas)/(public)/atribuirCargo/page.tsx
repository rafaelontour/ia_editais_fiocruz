import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus } from "lucide-react";

export default function AtribuirCargo () {
    return(
        <div>
            {/* MENU SUPERIOR - ATRIBUIR CARGO */}
            <div className="flex flex-row justify-between w-full">
                <div className="flex flex-row gap-2 items-center">
                    <Button variant={"outline"} size={"icon"} className="cursor-pointer"><ChevronLeft /></Button>
                    <h2 className="text-2xl font-semibold">Atribuir Cargo</h2>
                </div>
                <div>
                    <Button variant={"outline"} size={"icon"}
                        className="bg-vermelho text-white cursor-pointer hover:scale-105 hover:bg-vermelho hover:text-white transition-all"
                        ><Plus />
                    </Button>
                </div>
            </div>
        </div>
    );
}