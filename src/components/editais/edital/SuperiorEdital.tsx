import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { ChevronLeft } from "lucide-react";

export default function SuperiorEdital () {
    return(
        <div className="flex items-center justify-between">
            <div className="flex flex-row gap-7">
                <Button variant={"outline"} size={"icon"}><ChevronLeft/></Button>
                <Label className="text-2xl font-bold">Edital Fiocruz 2025/1</Label>
            </div>

            <div className="flex items-center gap-2">
                <Button variant={"outline"} className="hover:cursor-pointer">Rejeitar</Button>
                <Button variant={"destructive"} className="bg-vermelho text-white hover:cursor-pointer">Aceitar</Button>
            </div>
        </div>
    );
}