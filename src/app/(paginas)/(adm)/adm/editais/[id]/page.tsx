import { InfoIcon, View } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Edital } from "@/core";
import SuperiorEdital from "@/components/editais/edital/SuperiorEdital";
import Linha01 from "@/components/editais/edital/analiselinhas/Linha01";
import Linha02 from "@/components/editais/edital/analiselinhas/Linha02";
import PdfEdital from "@/components/editais/edital/PdfEdital";
import AnaliseEdital from "@/components/editais/edital/AnaliseEdital";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface EditalProps {
    edital: Edital
}

export default function VisualizarEdital({ edital }: EditalProps) {
    return (
        <div className="flex flex-col w-full h-full max-h-full gap-10">
            <SuperiorEdital />

            <ResizablePanelGroup
                direction="horizontal"
                className="flex gap-6 w-full mb-10"
            >
                    <ResizablePanel defaultSize={50}>
                        <div className="flex w-full h-full">
                            <PdfEdital />
                        </div>
                    </ResizablePanel>

                    <div className="flex flex-col items-center gap-4">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <InfoIcon color="green" size={15} />
                            </TooltipTrigger>
                            <TooltipContent className="italic">Clique sobre a linha abaixo, segure e redirecione para os lados para alterar a vizualização</TooltipContent>
                        </Tooltip>

                        <ResizableHandle className="w-[1px] h-full" />
                    </div>

                    <ResizablePanel defaultSize={50}>
                        <div className="w-full">
                            <AnaliseEdital />
                        </div>
                    </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}