// app/api/users/route.ts (Next 13+ com app dir)
import { NextRequest, NextResponse } from 'next/server'

const itens = [
    {
        id: 1,
        nome: "Fonte",
        descricao: "Descricao da fonte lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum",
        data: "12/12/2022"
    },
    {
        id: 2,
        nome: "Fonte 2",
        descricao: "Descricao da fonte 2 lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum",
        data: "12/12/2022"
    }, 
    {
        id: 3,
        nome: "Fonte 3",
        descricao: "Descricao da fonte 3 lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum",
        data: "12/12/2022"
    },
    {
        id: 4,
        nome: "Fonte 4",
        descricao: "lorem ipsum",
        data: "12/12/2022"
    },
    {
        id: 5,
        nome: "Fonte 5",
        descricao: "lorem ipsum lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum",
        data: "12/12/2022"
    }, {
        id: 6,
        nome: "Fonte 6",
        descricao: "lorem ipsum lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum",
        data: "12/12/2022"
    }
]

export async function GET() {
  return NextResponse.json(itens)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  itens.push(data)
  return NextResponse.json({ message: 'Usuário adicionado' }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id")

    const pos = itens.findIndex((i) => i.id === Number(id))
    console.log("ITENS ANTES DE APAGAR: " + JSON.stringify(itens))
    itens.splice(pos, 1)
    console.log("ITENS DEPOIS DE APAGAR: " + JSON.stringify(itens))
    return NextResponse.json({ message: "Fonte removida" }, { status: 200 });
}