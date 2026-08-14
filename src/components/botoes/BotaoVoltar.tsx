import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface BotaoVoltarProps {
    rota?: string;
}

export default function BotaoVoltar({ rota }: BotaoVoltarProps) {
    const router = useRouter();

    return (
        <Button
            className="hover:cursor-pointer"
            variant={"outline"}
            size={"icon"}
            title="Voltar para página anterior"
            onClick={() => {
                if (rota) {
                    router.push(rota);
                } else {
                    window.history.go(-1);
                }
            }}
        >
            <ChevronLeft />
        </Button>
    )
}