import { Usuario, UsuarioUnidade } from "@/core/usuario";
import { getUsuario } from "@/service/usuario";
import { createContext, useEffect, useState } from "react";

export interface ContextoProps {
    usuario: UsuarioUnidade | undefined
    logarUsuario: () => void
    deslogar: () => void
}

export const UsuarioContexto = createContext<ContextoProps | undefined>({} as ContextoProps);

export const UsuarioContextoProvider = ({ children }: { children: React.ReactNode }) => {
    const [usuario, setUsuario] = useState<UsuarioUnidade | undefined>();
    
    async function logarUsuario(): Promise<void> {
        try {
            
        } catch(error) {
            console.error("Erro ao logar: ", error)
        }
        
        const resposta = await getUsuario();
    }
    
    function deslogar() {
        setUsuario(undefined)
    }

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