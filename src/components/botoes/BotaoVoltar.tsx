import { ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";

export default function BotaoVoltar() {
    return (
        <Button
            className="hover:cursor-pointer"
            variant={"outline"}
            size={"icon"}
            title="Voltar para página anterior"
            onClick={() => window.history.go(-1)}
        >
            <ChevronLeft />
        </Button>
    )
}