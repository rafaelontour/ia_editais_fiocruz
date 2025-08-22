'use client'

import { UsuarioUnidade } from "@/core/usuario";
import { logout } from "@/service/auth";
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
            const [res, status] = await getUsuarioLogado();

            console.log("usuario logado: ", usuario)
            
            if (status === 200) {
                localStorage.setItem("logado", "true")
                const usuarioComLogin: UsuarioUnidade = {...res, logado: true}
                setUsuario(usuarioComLogin)
                console.log("logado: ", localStorage.getItem("logado"))
            }
        } catch(error) {
            return
        }
    }
    
    function deslogar() {
        setUsuario(undefined)
        localStorage.removeItem("logado")
        logout()
    }

    useEffect(() => {
        if (localStorage.getItem("logado") === null) {
            localStorage.setItem("logado", "false")
            return
        }

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