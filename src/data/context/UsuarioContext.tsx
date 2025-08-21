import { UsuarioUnidade } from "@/core/usuario";
import { getUsuarioLogado } from "@/service/usuario";
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";

export interface ContextoProps {
    usuario: UsuarioUnidade | undefined
    setUsuario: Dispatch<SetStateAction<UsuarioUnidade | undefined>>
    logarUsuario: () => void
    deslogar: () => void
}

export const UsuarioContexto = createContext<ContextoProps | undefined>({} as ContextoProps);

export const UsuarioContextoProvider = ({ children }: { children: React.ReactNode }) => {
    const [usuario, setUsuario] = useState<UsuarioUnidade | undefined>();
    
    async function logarUsuario() {
        try {
            const res = await getUsuarioLogado();
            console.log("res: ", res)
            setUsuario(res)
        } catch(error) {
            console.error("Erro ao logar: ", error)
        }
    }
    
    
    function deslogar() {
        setUsuario(undefined)
    }

    useEffect(() => {
        logarUsuario()
    }, [])
    
    return (
        <UsuarioContexto.Provider
            value={{
                usuario: usuario,
                setUsuario: setUsuario,
                logarUsuario: logarUsuario,
                deslogar: deslogar
            }}
        >
            {children}
        </UsuarioContexto.Provider>
    )
}