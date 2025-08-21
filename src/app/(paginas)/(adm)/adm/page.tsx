'use client'

import useUsuario from "@/data/hooks/useUsuario";

export default function PaginaInicial() {

    const { usuario } = useUsuario();
    return (
        <h1 className="text-4xl font-bold">Olá, {usuario?.username}!</h1>
    )
}