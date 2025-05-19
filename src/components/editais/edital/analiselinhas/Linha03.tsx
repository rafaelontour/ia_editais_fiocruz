import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Linha03 () {
    return(
        <div className="flex flex-row gap-4 items-center">
            <Button variant={"outline"} size={"icon"}><ChevronLeft/></Button>
            <div className="bg-gray-200 flex flex-row gap-2 w-full rounded-md px-3 py-1">
                <Button variant={"outline"} size={"sm"} className="text-xs py-0.5 px-3">Tipificação 1</Button>
                <Button variant={"outline"} size={"sm"} className="text-xs py-0.5 px-3">Tipificação 2</Button>
                <Button variant={"outline"} size={"sm"} className="text-xs py-0.5 px-3">Tipificação 3</Button>
                <Button variant={"outline"} size={"sm"} className="text-xs py-0.5 px-3">Tipificação 4</Button>
            </div>
            <Button variant={"outline"} size={"icon"}><ChevronRight/></Button>
        </div>
    );
}