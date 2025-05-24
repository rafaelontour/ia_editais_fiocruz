// app/api/users/route.ts (Next 13+ com app dir)
import { NextRequest, NextResponse } from 'next/server'

const itens = [
    {
        nome: "Fonte",
        descricao: "Descricao da fonte lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum",
        data: "12/12/2022"
    },
    {
        nome: "Fonte 2",
        descricao: "Descricao da fonte 2 lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum",
        data: "12/12/2022"
    }, 
    {
        nome: "Fonte 3",
        descricao: "Descricao da fonte 3 lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum",
        data: "12/12/2022"
    },
    {
        nome: "Fonte 4",
        descricao: "lorem ipsum",
        data: "12/12/2022"
    },
    {
        nome: "Fonte 5",
        descricao: "lorem ipsum lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum",
        data: "12/12/2022"
    }, {
        nome: "Fonte 6",
        descricao: "lorem ipsum lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum",
        data: "12/12/2022"
    }
]

export async function GET(req: NextRequest) {
  return NextResponse.json(itens)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  itens.push(data)
  return NextResponse.json({ message: 'Usuário adicionado' }, { status: 201 })
}