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
        { id: 0, nome: "Ramo 1 Taxonomia 1", descricao: "Ramo 1 Taxonomia 1" },
        { id: 1, nome: "Ramo 2 Taxonomia 1", descricao: "Ramo 2 Taxonomia 1" },
      ],
    },
    {
      id: 2,
      nome: "Taxonomia 2",
      descricao:
        "Determina que a remuneração em contratos de serviços de TI deve estar vinculada a resultados ou atendimento de níveis de serviço, salvo exceções justificadas.",
      data: "25/02/2025",
      ramos: [
        { id: 0, nome: "Ramo 1 Taxonomia 2", descricao: "Ramo 1 Taxonomia 2" },
        { id: 1, nome: "Ramo 2 Taxonomia 2", descricao: "Ramo 2 Taxonomia 2" },
        { id: 2,nome: "Ramo 3 Taxonomia 2", descricao: "Ramo 3 Taxonomia 2" },
      ],
    },
    {
      id: 3,
      nome: "Taxonomia 3",
      descricao:
        "Determina que a remuneração em contratos de serviços de TI deve estar vinculada a resultados ou atendimento de níveis de serviço, salvo exceções justificadas.",
      data: "25/02/2025",
      ramos: [
        { id: 0, nome: "Ramo 1 Taxonomia 3", descricao: "Ramo 1 Taxonomia 3" },
        { id: 1, nome: "Ramo 2 Taxonomia 3", descricao: "Ramo 2 Taxonomia 3" },
        { id: 2, nome: "Ramo 3 Taxonomia 3", descricao: "Ramo 3 Taxonomia 3" },
        { id: 3, nome: "Ramo 4 Taxonomia 3", descricao: "Ramo 4 Taxonomia 3" },
        { id: 4, nome: "Ramo 5 Taxonomia 3", descricao: "Ramo 5 Taxonomia 3" },
      ],
    },
    {
      id: 4,
      nome: "Taxonomia 4",
      descricao:
        "Determina que a remuneração em contratos de serviços de TI deve estar vinculada a resultados ou atendimento de níveis de serviço, salvo exceções justificadas.",
      data: "25/02/2025",
      ramos: [
        { id: 0, nome: "Ramo 1 Taxonomia 4", descricao: "Ramo 1 Taxonomia 4" },
      ],
    },
    {
      id: 5,
      nome: "Taxonomia 5",
      descricao:
        "Determina que a remuneração em contratos de serviços de TI deve estar vinculada a resultados ou atendimento de níveis de serviço, salvo exceções justificadas.",
      data: "25/02/2025",
      ramos: [
        { id: 0, nome: "Ramo 1 Taxonomia 5", descricao: "Ramo 1 Taxonomia 5" },
        { id: 1, nome: "Ramo 2 Taxonomia 5", descricao: "Ramo 2 Taxonomia 5" },
        { id: 2, nome: "Ramo 3 Taxonomia 5", descricao: "Ramo 3 Taxonomia 5" },
        { id: 3, nome: "Ramo 4 Taxonomia 5", descricao: "Ramo 4 Taxonomia 5" },
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

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id") || "");
  const idRamo = parseInt(searchParams.get("ramo") || "");
  console.log("idramo: " + idRamo)

  if (!(isNaN(idRamo))) {
    const taxonomiaIndex = itens.findIndex((t) => t.id === id);
    if (taxonomiaIndex === -1) {
      return NextResponse.json({ error: "Taxonomia não encontrada" }, { status: 404 });
    }
    const taxonomia = itens[taxonomiaIndex];
    console.log("TAXONOMIA ANTES DE APAGAR RAMO: " + JSON.stringify(taxonomia));

    taxonomia.ramos?.splice(idRamo, 1);
    console.log("TAXONOMIA DEPOIS DE APAGAR RAMO: " + JSON.stringify(taxonomia));

    return NextResponse.json({ message: `Ramo ${idRamo} removido` }, { status: 200 });
  } 

  console.log("ID:" + id);
  
  const index = itens.findIndex(t => t.id === id)

  if (index === -1) {
    return NextResponse.json({error: "Taxonomia não encontrada"}, { status: 404 });
  }

  itens.splice(index, 1)

  return NextResponse.json({ message: `Taxonomia ${id} removida` }, { status: 200 });
}
