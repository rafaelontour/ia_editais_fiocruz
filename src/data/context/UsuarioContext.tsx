import { Usuario } from "@/core";
import { getUsuario } from "@/service/usuario";
import { createContext, useState } from "react";

export interface ContextoProps {
    usuario: Usuario | undefined
}

const UsuarioContexto = createContext<ContextoProps | undefined>(undefined)

const UsuarioContextoProvider = ({ children }: { children: React.ReactNode }) => {
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

    return (
        <UsuarioContexto.Provider
            value={{
                usuario: usuario
            }}
        >
            {children}
        </UsuarioContexto.Provider>
    )
}