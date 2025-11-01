'use client'

import { itemsAdm, itemsAuditorAnalista, itemsUsuarioComum, MenuItem } from "@/core/constants/itensMenu";
import { UsuarioUnidade } from "@/core/usuario";
import { logout } from "@/service/auth";
import { getUsuarioLogado } from "@/service/usuario";
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";

export interface ContextoProps {
    usuario: UsuarioUnidade | undefined
    setUsuario: Dispatch<SetStateAction<UsuarioUnidade | undefined>>
    logarUsuario: () => void
    deslogar: () => void
    items: MenuItem[]
    mensagemLogin: string,
    barraLateralAberta: boolean
    mudarEstadoBarraLateral: () => void
}

export const UsuarioContexto = createContext<ContextoProps | undefined>({} as ContextoProps);

export const UsuarioContextoProvider = ({ children }: { children: React.ReactNode }) => {
    const [usuario, setUsuario] = useState<UsuarioUnidade | undefined>();
    const [items, setItems] = useState<MenuItem[]>([])
    const [mensagemLogin, setMensagemLogin] = useState<string>("");
    const [montado, setMontado] = useState<boolean>(false);
    const [barraLateralAberta, setBarraLateralAberta] = useState<boolean>(false);

    function mudarEstadoBarraLateral() {
        setBarraLateralAberta(prev => {
            const novoEstado = !prev;
            localStorage.setItem("barraLateralAberta", novoEstado ? "aberta" : "fechada");
            return novoEstado;
        });
        
    }
    
    useEffect(() => {
        const estadoBarra = localStorage.getItem("barraLateralAberta")

        if (estadoBarra === "aberta") {
            setBarraLateralAberta(true)
        } else {
            setBarraLateralAberta(false)
        }
        getUsuarioLogado()
        setMontado(true)
    }, [])

    async function logarUsuario() {
        try {
            const [res, status] = await getUsuarioLogado();

            if (status === 401) {
                setItems(itemsUsuarioComum)
                setMensagemLogin("Fazer login")
                return
            }
            
            if (status === 200) {
                setMensagemLogin("Sair")
                const usuarioComLogin: UsuarioUnidade = { ...res }

                setUsuario(usuarioComLogin)

                const novosItems = res.access_level === "ADMIN"
                    ? itemsAdm
                    : res.access_level === "AUDITOR" || res.access_level === "ANALYST"
                        ? itemsAuditorAnalista
                        : itemsUsuarioComum;
                setItems(novosItems)
            }

        } catch (error) {
            return
        }
    }

    function deslogar() {
        setUsuario(undefined)
        setMensagemLogin("Fazer login")
        setItems(itemsUsuarioComum)
        logout()
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
                deslogar: deslogar,
                items: items,
                mensagemLogin: mensagemLogin,
                barraLateralAberta: barraLateralAberta,
                mudarEstadoBarraLateral: mudarEstadoBarraLateral
            }}
        >
            
            {
                montado && 
                children
            }
        </UsuarioContexto.Provider>
    )
}