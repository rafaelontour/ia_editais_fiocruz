import { UsuarioUnidade } from "@/core/usuario";
import { getUsuarioLogado } from "@/service/usuario";
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

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
            const [res, status] = await getUsuarioLogado();
            
            if (status === 200) {
                setUsuario(res)
                toast.success("Logado com sucesso!")
            }
        } catch(error) {
            return
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