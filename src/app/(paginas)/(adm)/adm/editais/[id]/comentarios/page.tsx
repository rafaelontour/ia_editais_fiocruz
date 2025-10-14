import ComentarioEdital from "@/components/editais/edital/ComentarioEdital";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";

export default function Comentarios () {
    return(
        <div className="flex flex-col w-full h-full max-h-full gap-10">
            <div className="flex items-center justify-between">
                <div className="flex flex-row gap-7">
                    <Button variant={"outline"} size={"icon"}><ChevronLeft/></Button>
                    <Label className="text-2xl font-bold">Edital Fiocruz 2025/1</Label>
                </div>
                
            </div>
            <div className="flex flex-row gap-10 w-full h-full">
                <div className="flex-1 w-1/2 h-full max-h-full">
                    
                </div>
                <div className="w-1/2">
                    <ComentarioEdital/>
                </div>
            </div>
        </div>    
    );
}