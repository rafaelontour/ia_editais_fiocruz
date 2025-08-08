import { Usuario } from "@/core";
import { getUsuario } from "@/service/usuario";
import { createContext, useEffect, useState } from "react";

export interface ContextoProps {
    usuario: Usuario | undefined
    logarUsuario: () => void
    deslogar: () => void
}

export const UsuarioContexto = createContext<ContextoProps | undefined>(undefined)

export const UsuarioContextoProvider = ({ children }: { children: React.ReactNode }) => {
    const [usuario, setUsuario] = useState<Usuario>();

    async function logarUsuario(): Promise<void> {
        try {
            const fetchDados = async () => {

            }

            fetchDados()
        } catch(error) {

        }

        const resposta = await getUsuario();

    }

    function deslogar() {
        setUsuario(undefined)
    }

    useEffect(() => {
        console.log("Contexto funcionando ao carregar a página.")
    }, [])

    return (
        <UsuarioContexto.Provider
            value={{
                usuario: usuario,
                logarUsuario: logarUsuario,
                deslogar: deslogar
            }}
        >
            {children}
        </UsuarioContexto.Provider>
    )
}