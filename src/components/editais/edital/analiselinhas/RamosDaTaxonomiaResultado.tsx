import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Branch } from "@/core/tipificacao/Tipificacao";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { DetalhesRamoDialog } from "./DetalhesRamoDialog";
import { useParams } from "next/navigation";

interface Props {
  ramos: Branch[];
  taxonomia: string | undefined;
}

export default function RamosDaTaxonomiaResultado({ ramos, taxonomia }: Props) {
  const params = useParams();
  const docId = params.id as string;

  const [ultimaTab, setUltimaTab] = useState<boolean>(false);
  const [primeiraTab, setPrimeiraTab] = useState<boolean>(true);
  const [abaSelecionada, setAbaSelecionada] = useState<string>("tabRamo0");

  const [ramoSelecionado, setRamoSelecionado] = useState({
    ramo: ramos[0],
    index: 0,
  });

  useEffect(() => {
    if (ramos.length === 1) {
      setPrimeiraTab(true);
      setUltimaTab(true);
    }
  }, [ramos]);

  return (
    <div className="w-full flex flex-col flex-1 border border-gray-300 rounded-sm px-4 pt-2 pb-4 bg-white ">
      <Tabs
        defaultValue="tabRamo0"
        value={abaSelecionada}
        onValueChange={(val) => setAbaSelecionada(val)}
      >
        <div className="w-full grid grid-cols-[auto_48px_1fr_48px] items-center gap-2">
          <h3 className="font-bold text-xl text-black whitespace-nowrap mr-13.5">
            Ramos:
          </h3>

          <div className="flex items-center justify-center">
            <Button
              className={`
                              ${primeiraTab ? "bg-gray-100 hover:bg-gray-100" : "bg-vermelho hover:bg-vermelho"}
                              hover:cursor-pointer
                          `}
              title={`${primeiraTab ? "Você está na primeira aba" : "Ramo anterior"}`}
              variant={"outline"}
              size={"icon"}
              onClick={() => {
                if (ramos.length === 1) return;
                if (ramoSelecionado.index === null) return;
                const indexAnterior = ramoSelecionado.index - 1;
                if (indexAnterior < 0) return;

                setRamoSelecionado((anterior) => ({
                  ...anterior,
                  index: indexAnterior,
                  ramo: ramos[indexAnterior],
                }));

                setAbaSelecionada("tabRamo" + indexAnterior);
                setPrimeiraTab(indexAnterior === 0);
                setUltimaTab(indexAnterior === ramos.length - 1);
              }}
            >
              <ChevronLeft
                className={`${primeiraTab ? "text-gray-400" : "text-white"}`}
              />
            </Button>
          </div>

          <span className="text-lg font-semibold text-black truncate text-center">
            {ramoSelecionado.ramo?.title}
          </span>

          <div className="flex items-center justify-center">
            <Button
              className={`
                              ${ultimaTab ? "bg-gray-100 hover:bg-gray-100" : "bg-vermelho hover:bg-vermelho"}
                              hover:cursor-pointer text-lg
                          `}
              title={`${!ultimaTab ? "Ramo seguinte" : "Você está na última aba"}`}
              variant={"outline"}
              size={"icon"}
              onClick={() => {
                if (ramos.length === 1) return;

                if (
                  ramoSelecionado.index === null ||
                  ramoSelecionado.index === ramos.length - 1
                )
                  return;
                const proximoIndex = ramoSelecionado.index + 1;
                if (proximoIndex < ramos.length) {
                  setRamoSelecionado({
                    ramo: ramos[proximoIndex],
                    index: proximoIndex,
                  });
                  setAbaSelecionada("tabRamo" + proximoIndex.toString());
                }
                setPrimeiraTab(proximoIndex === 0);
                setUltimaTab(proximoIndex === ramos.length - 1);
              }}
            >
              <ChevronRight
                className={`${ultimaTab ? "text-gray-400" : "text-white"}`}
              />
            </Button>
          </div>
        </div>

        {ramos.map((ramo, index) => (
          <TabsContent value={"tabRamo" + index} className="" key={ramo.id}>
            <div className="flex flex-col gap-2 text-black">
              <hr className=" border-gray-300 w-full" />
              <div className="flex flex-row gap-7 px-3 w-full">
                {/* <div className="flex flex-col gap-2 w-1/3">
                  <h3 className="text-lg font-semibold">Items</h3>
                  <p className="">{ramo.title}</p>
                </div>

                <div className="flex flex-col bg-zinc-400 gap-2 w-px" /> */}

                <div className="flex flex-col gap-2 w-full">
                  <h3 className="text-lg font-semibold">Detalhamento</h3>
                  <p className="max-h-[220px] overflow-y-auto pr-1">
                    {ramo.evaluation?.feedback}
                  </p>
                </div>
              </div>

              <hr className="mt-2 mb-4 border-gray-300 w-full" />

              <div className="flex flex-row gap-3 px-3 w-full items-center justify-between">
                <div className="flex flex-row gap-3 items-center">
                  <h3 className="font-semibold">Resultado: </h3>
                  {ramo?.evaluation?.score} / 10
                </div>

                <DetalhesRamoDialog
                  ramo={ramo}
                  docId={docId}
                  taxonomia={taxonomia}
                />
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
