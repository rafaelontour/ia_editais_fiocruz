import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Calendar, ChevronLeft, PencilLine, Trash } from "lucide-react";

export default function Taxonomias() {
    const itens = [
        {
          nome: "Taxonomia 1",
          descricao: "Determina que a remuneração em contratos de serviços de TI deve estar vinculada a resultados ou atendimento de níveis de serviço, salvo exceções justificadas.",
          data: "25/02/2025",
          ramos: [
            {
              nome: "Ramo 1 Taxonomia 2"
            },
            {
              nome: "Ramo 2 Taxonomia 2"
            },
            {
              nome: "Ramo 3Taxonomia 2"
            },
            {
              nome: "Ramo 4 Taxonomia 2"
            },
            {
              nome: "Ramo 5 Taxonomia 2"
            },
          ]
        },
        {
          nome: "Taxonomia 2",
          descricao: "Determina que a remuneração em contratos de serviços de TI deve estar vinculada a resultados ou atendimento de níveis de serviço, salvo exceções justificadas.",
          data: "25/02/2025",
        },
        {
          nome: "Taxonomia 3",
          descricao: "Determina que a remuneração em contratos de serviços de TI deve estar vinculada a resultados ou atendimento de níveis de serviço, salvo exceções justificadas.",
          data: "25/02/2025",
        },
        {
          nome: "Taxonomia 4",
          descricao: "Determina que a remuneração em contratos de serviços de TI deve estar vinculada a resultados ou atendimento de níveis de serviço, salvo exceções justificadas.",
          data: "25/02/2025",
        },
        {
          nome: "Taxonomia 5",
          descricao: "Determina que a remuneração em contratos de serviços de TI deve estar vinculada a resultados ou atendimento de níveis de serviço, salvo exceções justificadas.",
          data: "25/02/2025",
        },
    ]

    return (
        <div className="flex flex-col  w-full">
            <div className="flex flex-row items-center gap-2">
              <button className="flex items-center justify-center h-8 w-8 bg-white rounded-sm border border-gray-300 ml-4 hover:cursor-pointer">
                <ChevronLeft className="h-4 w-4 " />
              </button>
              <h1 className=" font-semibold">Gestão de Taxonomia e Ramos</h1>
            </div>

            <div className="flex flex-row">
              <div className="basis-1/2 ">
              {
                itens.map((item, index) => (
                  <Card key={index} className=" hover:bg-gray-200 hover:cursor-pointer m-4">
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
                ))
              }
              </div>

              <div className="basis-1/2">
          
                <Card className="h-screen m-4">
                  <CardHeader>
                    <CardTitle>Ramos</CardTitle>
                  </CardHeader>
                  <CardContent >
                    <div className="flex justify-between gap-8 mt-6 mb-4">
                      <p>Ramo 1 Taxonomia 1</p>
        
                      <div className="flex gap-2">
                      <button className="flex items-center justify-center h-8 w-8 bg-white rounded-sm border border-gray-300 hover:cursor-pointer">
                        <PencilLine className="h-4 w-4 hover:cursor-pointer" strokeWidth={1.5} />
                      </button>
                      <button className="flex items-center justify-center h-8 w-8 bg-red-700 text-white rounded-sm border border-gray-300 hover:cursor-pointer">
                        <Trash className="h-4 w-4 " strokeWidth={1.5} />
                      </button>
                      </div>
                    </div>
                  
                    <hr />
        
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
    );
        
}

