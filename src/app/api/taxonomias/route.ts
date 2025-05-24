import { Taxonomia } from "@/core/taxonomia";
import { NextResponse, NextRequest } from "next/server";

const itens: Taxonomia[] = [
    {
      id: 1,  
      nome: "Taxonomia 1",
      descricao:
        "Determina que a remuneração em contratos de serviços de TI deve estar vinculada a resultados ou atendimento de níveis de serviço, salvo exceções justificadas.",
      data: "25/02/2025",
      ramos: [
        { nome: "Ramo 1 Taxonomia 1", descricao: "Ramo 1 Taxonomia 1" },
        { nome: "Ramo 2 Taxonomia 1", descricao: "Ramo 2 Taxonomia 1" },
      ],
    },
    {
      id: 2,
      nome: "Taxonomia 2",
      descricao:
        "Determina que a remuneração em contratos de serviços de TI deve estar vinculada a resultados ou atendimento de níveis de serviço, salvo exceções justificadas.",
      data: "25/02/2025",
      ramos: [
        { nome: "Ramo 1 Taxonomia 2", descricao: "Ramo 1 Taxonomia 2" },
        { nome: "Ramo 2 Taxonomia 2", descricao: "Ramo 2 Taxonomia 2" },
        { nome: "Ramo 3 Taxonomia 2", descricao: "Ramo 3 Taxonomia 2" },
      ],
    },
    {
      id: 3,
      nome: "Taxonomia 3",
      descricao:
        "Determina que a remuneração em contratos de serviços de TI deve estar vinculada a resultados ou atendimento de níveis de serviço, salvo exceções justificadas.",
      data: "25/02/2025",
      ramos: [
        { nome: "Ramo 1 Taxonomia 3", descricao: "Ramo 1 Taxonomia 3" },
        { nome: "Ramo 2 Taxonomia 3", descricao: "Ramo 2 Taxonomia 3" },
        { nome: "Ramo 3 Taxonomia 3", descricao: "Ramo 3 Taxonomia 3" },
        { nome: "Ramo 4 Taxonomia 3", descricao: "Ramo 4 Taxonomia 3" },
        { nome: "Ramo 5 Taxonomia 3", descricao: "Ramo 5 Taxonomia 3" },
      ],
    },
    {
      id: 4,
      nome: "Taxonomia 4",
      descricao:
        "Determina que a remuneração em contratos de serviços de TI deve estar vinculada a resultados ou atendimento de níveis de serviço, salvo exceções justificadas.",
      data: "25/02/2025",
      ramos: [
        { nome: "Ramo 1 Taxonomia 4", descricao: "Ramo 1 Taxonomia 4" },
      ],
    },
    {
      id: 5,
      nome: "Taxonomia 5",
      descricao:
        "Determina que a remuneração em contratos de serviços de TI deve estar vinculada a resultados ou atendimento de níveis de serviço, salvo exceções justificadas.",
      data: "25/02/2025",
      ramos: [
        { nome: "Ramo 1 Taxonomia 5", descricao: "Ramo 1 Taxonomia 5" },
        { nome: "Ramo 2 Taxonomia 5", descricao: "Ramo 2 Taxonomia 5" },
        { nome: "Ramo 3 Taxonomia 5", descricao: "Ramo 3 Taxonomia 5" },
        { nome: "Ramo 4 Taxonomia 5", descricao: "Ramo 4 Taxonomia 5" },
      ],
    },
    {
      id: 6,
      nome: "Taxonomia 6",
      descricao:
        "Determina que a remuneração em contratos de serviços de TI deve estar vinculada a resultados ou atendimento de níveis de serviço, salvo exceções justificadas.",
      data: "25/02/2025",
      ramos: [
      ],
    },
]

export async function GET(req: NextRequest) {
    return NextResponse.json(itens)
}

export async function POST(req: NextRequest) {
    const data = await req.json()
    itens.push(data)
    return NextResponse.json({ message: 'Usuário adicionado' }, { status: 201 })
}