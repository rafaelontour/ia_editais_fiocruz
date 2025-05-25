import { Tipificacao } from "@/core";
import { NextResponse, NextRequest } from "next/server";

const tipificacoes: Tipificacao[] = [
    {
        id: 1,
        nome: "Tipificacao 1",
        lei: "Lei 1",
        lei_complementar: "Lei Complementar 1",
        data: "12/12/2022"
    },
    {
        id: 2,
        nome: "Tipificacao 2",
        lei: "Lei 2",
        lei_complementar: "Lei Complementar 2",
        data: "8/12/2022"
    },
    {
        id: 3,
        nome: "Tipificacao 3",
        lei: "Lei 3",
        lei_complementar: "Lei Complementar 3",
        data: "10/12/2020"
    },
    {
        id: 4,
        nome: "Tipificacao 4",
        lei: "Lei 4",
        lei_complementar: "Lei Complementar 4",
        data: "20/12/2010"
    },
    {
        id: 5,
        nome: "Tipificacao 5",
        lei: "Lei 5",
        lei_complementar: "Lei Complementar 5",
        data: "30/12/2000"
    },
    {
        id: 6,
        nome: "Tipificacao 6",
        lei: "Lei 6",
        lei_complementar: "Lei Complementar 6",
        data: "20/12/1990"
    },
    {
        id: 7,
        nome: "Tipificacao 7",
        lei: "Lei 7",
        lei_complementar: "Lei Complementar 7",
        data: "20/12/1980"
    },
    {
        id: 8,
        nome: "Tipificacao 8",
        lei: "Lei 8",
        lei_complementar: "Lei Complementar 8",
        data: "20/12/1970"
    },
    {
        id: 9,
        nome: "Tipificacao 9",
        lei: "Lei 9",
        lei_complementar: "Lei Complementar 9",
        data: "20/12/1960"
    },
    {
        id: 10,
        nome: "Tipificacao 10",
        lei: "Lei 10",
        lei_complementar: "Lei Complementar 10",
        data: "20/12/1950"
    },
    {
        id: 11,
        nome: "Tipificacao 11",
        lei: "Lei 11",
        lei_complementar: "Lei Complementar 11",
        data: "20/12/1940"
    },
    {
        id: 12,
        nome: "Tipificacao 12",
        lei: "Lei 12",
        lei_complementar: "Lei Complementar 12",
        data: "20/12/1930"
    },
    {
        id: 13,
        nome: "Tipificacao 13",
        lei: "Lei 13",
        lei_complementar: "Lei Complementar 13",
        data: "20/12/1920"
    }
]

export async function GET() {
return NextResponse.json(tipificacoes);
}
  
export async function POST(req: NextRequest) {
    const data = await req.json();
    tipificacoes.push(data);
    return NextResponse.json({ message: "Tipificação adicionada" }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id") || "");

    if (isNaN(id)) {
        return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const index = tipificacoes.findIndex(t => t.id === id);
    if (index === -1) {
        return NextResponse.json({ error: "Tipificação não encontrada" }, { status: 404 });
    }

    tipificacoes.splice(index, 1);
    return NextResponse.json({ message: `Tipificação ${id} removida` }, { status: 200 });
}