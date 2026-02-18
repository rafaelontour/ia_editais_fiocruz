import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Taxonomia } from "@/core/tipificacao/Tipificacao";
import { ChevronLeft, ChevronRight, Link } from "lucide-react";
import RamosDaTaxonomiaResultado from "./RamosDaTaxonomiaResultado";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  taxonomias: Taxonomia[] | undefined;
}

export default function TaxonommiasResultado({ taxonomias }: Props) {
  const [ultimaTab, setUltimaTab] = useState<boolean>(false);
  const [primeiraTab, setPrimeiraTab] = useState<boolean>(true);
  const [abaSelecionada, setAbaSelecionada] = useState<string>("tabTax0");

  const [taxonomiaSelecionada, setTaxonomiaSelecionada] = useState({
    taxonomia: taxonomias && taxonomias.length > 0 ? taxonomias[0] : undefined,
    index: 0,
  });

  useEffect(() => {
    if (taxonomias?.length === 1) {
      setPrimeiraTab(true);
      setUltimaTab(true);
    }
  }, [taxonomias]);

  return (
    taxonomias &&
    taxonomias.length > 0 && (
      <div className="flex flex-1">
        <Tabs
          className="w-full"
          defaultValue="tabTax0"
          value={abaSelecionada}
          onValueChange={(val) => setAbaSelecionada(val)}
        >
          <div className="flex items-center justify-between gap-2 bg-white px-4 py-2 border border-gray-300 rounded-sm">
            <h3 className="font-bold text-xl text-black whitespace-nowrap">
              Taxonomias:
            </h3>

            <Button
              className={`
                                ${primeiraTab ? "bg-gray-100 hover:bg-gray-100" : "bg-vermelho hover:bg-vermelho"}
                                hover:cursor-pointer
                            `}
              title={`${primeiraTab ? "Você está na primeira aba" : "Taxonomia anterior"}`}
              variant={"outline"}
              size={"icon"}
              onClick={() => {
                if (taxonomiaSelecionada.index === null) return;
                const indexAnterior = taxonomiaSelecionada.index - 1;
                if (indexAnterior < 0) return;

                setTaxonomiaSelecionada((anterior) => ({
                  ...anterior,
                  index: indexAnterior,
                  taxonomia: taxonomias[indexAnterior],
                }));

                setAbaSelecionada("tabTax" + indexAnterior);
                setPrimeiraTab(indexAnterior === 0);
                setUltimaTab(indexAnterior === taxonomias.length - 1);
              }}
            >
              <ChevronLeft
                className={`${primeiraTab ? "text-gray-400" : "text-white"}`}
              />
            </Button>

            <span className="text-lg font-semibold text-black">
              {taxonomiaSelecionada.taxonomia?.title}
            </span>

            <Button
              className={`
                                ${ultimaTab ? "bg-gray-100 hover:bg-gray-100" : "bg-vermelho hover:bg-vermelho"} hover:cursor-pointer
                                `}
              title={`${!ultimaTab ? "Taxonomia seguinte" : "Você está na última aba"}`}
              variant={"outline"}
              size={"icon"}
              onClick={() => {
                if (
                  taxonomiaSelecionada.index === null ||
                  taxonomiaSelecionada.index === taxonomias.length - 1
                )
                  return;

                const proximoIndex = taxonomiaSelecionada.index + 1;

                if (proximoIndex < taxonomias.length) {
                  setTaxonomiaSelecionada({
                    taxonomia: taxonomias[proximoIndex],
                    index: proximoIndex,
                  });
                  setAbaSelecionada("tabTax" + proximoIndex.toString());
                }

                setPrimeiraTab(proximoIndex === 0);
                setUltimaTab(proximoIndex === taxonomias.length - 1);
              }}
            >
              <ChevronRight
                className={`${ultimaTab ? "text-gray-400" : "text-white"}`}
              />
            </Button>
          </div>

          {taxonomias.map((taxonomia, index) => (
            <TabsContent
              value={"tabTax" + index}
              key={taxonomia.id}
              className=""
            >
              <RamosDaTaxonomiaResultado
                ramos={taxonomia.branches ? taxonomia.branches : []}
                key={taxonomia.id}
                taxonomia={taxonomia.title}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    )
  );
}
