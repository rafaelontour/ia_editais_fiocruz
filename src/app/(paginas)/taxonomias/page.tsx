"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, ChevronLeft, PencilLine, Plus, Trash } from "lucide-react";
import { useState } from "react";

interface Ramo {
  nome: string;
}

interface Taxonomia {
  nome: string;
  descricao: string;
  data: string;
  ramos?: Ramo[]; 
}


export default function Taxonomias() {
  const itens: Taxonomia[] = [
    {
      nome: "Taxonomia 1",
      descricao:
        "Determina que a remuneração em contratos de serviços de TI deve estar vinculada a resultados ou atendimento de níveis de serviço, salvo exceções justificadas.",
      data: "25/02/2025",
      ramos: [
        { nome: "Ramo 1 Taxonomia 1" },
        { nome: "Ramo 2 Taxonomia 1" },
        { nome: "Ramo 3 Taxonomia 1" },
        { nome: "Ramo 4 Taxonomia 1" },
        { nome: "Ramo 5 Taxonomia 1" },
      ],
    },
    {
      nome: "Taxonomia 2",
      descricao:
        "Determina que a remuneração em contratos de serviços de TI deve estar vinculada a resultados ou atendimento de níveis de serviço, salvo exceções justificadas.",
      data: "25/02/2025",
      ramos: [
        { nome: "Ramo 1 Taxonomia 2" },
        { nome: "Ramo 2 Taxonomia 2" },
  
      ],
    },
    {
      nome: "Taxonomia 3",
      descricao:
        "Determina que a remuneração em contratos de serviços de TI deve estar vinculada a resultados ou atendimento de níveis de serviço, salvo exceções justificadas.",
      data: "25/02/2025",
    },
  ];

  const [taxonomiaSelecionada, setTaxonomiaSelecionada] = useState<Taxonomia | null>(null);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row items-center gap-2 mb-4 justify-between">
        <div className="flex flex-row items-center gap-2">
          <button className="flex items-center justify-center h-8 w-8 bg-white rounded-sm border border-gray-300 ml-4 hover:cursor-pointer">
            <ChevronLeft className="h-4 w-4 " />
          </button>
          <h1 className="ml-4 font-semibold text-2xl">Gestão de Taxonomia e Ramos</h1>
        </div>

        <button className="mr-4 flex items-center gap-2 bg-red-500 hover:bg-red-600 cursor-pointer hover:shadow-md text-white font-semibold py-2 px-4 rounded-sm">
          <Plus className="h-5 w-5 " strokeWidth={1.5} />
          <span>Adicionar </span>
        </button>
      </div>

      <div className="flex flex-row">
        <div className="basis-1/2">
          {itens.map((item, index) => (
            <Card
              key={index}
              className="hover:bg-gray-200 hover:cursor-pointer m-4"
              onClick={() => setTaxonomiaSelecionada(item)}
            >
              <CardHeader>
                <CardTitle>{item.nome}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{item.descricao}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-400">{item.data}</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center justify-center h-8 w-8 bg-white rounded-sm border border-gray-300 hover:cursor-pointer">
                    <PencilLine className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                  <button className="flex items-center justify-center h-8 w-8 bg-red-700 text-white rounded-sm border border-gray-300 hover:cursor-pointer">
                    <Trash className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="basis-1/2">
          <Card className="h-screen m-4">
            <CardHeader>
              <CardTitle className="flex flex-row justify-between items-center">
                <h1 className="text-2xl">Ramos</h1>
                <button className=" flex items-center gap-2 bg-red-500 hover:bg-red-600 cursor-pointer hover:shadow-md text-white font-semibold py-2 px-4 rounded-sm">
                <Plus className="h-5 w-5 " strokeWidth={1.5} />
                <span>Adicionar Ramo </span>
                </button>
              </CardTitle>

            </CardHeader>
            <CardContent>
              {taxonomiaSelecionada && taxonomiaSelecionada.ramos ? (
                  <ul>
                  {taxonomiaSelecionada.ramos.map((ramo, index) => (
                      <div className="flex flex-col gap-2">
                          <li key={index} className="flex  justify-between items-center mb-2">
                          <span>{ramo.nome}</span>
                     
                            <div className="flex flex-row gap-2">
                                <button className="flex items-center justify-center h-8 w-8 bg-white rounded-sm border border-gray-300 hover:cursor-pointer">
                                  <PencilLine className="h-4 w-4" strokeWidth={1.5} />
                                </button>
                                <button className="flex items-center justify-center h-8 w-8 bg-red-700 text-white rounded-sm border border-gray-300 hover:cursor-pointer">
                                  <Trash className="h-4 w-4" strokeWidth={1.5} />
                                </button>
                           
                          </div>
                         </li>
                        <div className="w-full flex flex-col mb-6">
                    
                            <hr />
                        </div>
                      </div>
                      
                    ))}
                </ul>
              ) : (
                  <p>Nenhum ramo disponível para esta taxonomia.</p>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}