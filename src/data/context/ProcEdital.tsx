"use client"

import { Edital, EditalArquivo } from "@/core/edital/Edital";
import { getEditalPorIdService } from "@/service/edital";
import { getEditalArquivoService } from "@/service/editalArquivo";
import { createContext, useEffect, useRef, useState, ReactNode } from "react";
import { toast } from "sonner";

export interface ProcEditalProps {
    lista: string[];
    salvarLista: (ids: string[]) => void;
}

export const ProcEditalContexto =
    createContext<ProcEditalProps | undefined>(undefined);

const STORAGE_KEY = "editais_processando";

export function ProcEditalProvider({ children }: { children: ReactNode }) {

    const [lista, setLista] = useState<string[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const isRunning = useRef(false);

    // 🔹 Carrega do localStorage ao montar
    useEffect(() => {
        const dados = localStorage.getItem(STORAGE_KEY);
        const inicial: string[] = dados ? JSON.parse(dados) : [];
        setLista(inicial);

        if (inicial.length > 0) {
            startPolling();
        }

        return () => stopPolling();
    }, []);

    function salvarLista(ids: string[]) {
        setLista(ids);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));

        // 🔹 Se adicionou novos IDs e não está rodando → inicia
        if (ids.length > 0 && !intervalRef.current) {
            startPolling();
        }
    }

    function startPolling() {
        if (intervalRef.current) return; // já está rodando

        intervalRef.current = setInterval(async () => {

            if (isRunning.current) return;
            isRunning.current = true;

            try {
                const dados = localStorage.getItem(STORAGE_KEY);
                const listaAtual: string[] = dados ? JSON.parse(dados) : [];

                if (listaAtual.length === 0) {
                    stopPolling(); // para completamente
                    return;
                }

                const idsRestantes: string[] = [];

                for (const id of listaAtual) {
                    try {
                        const edital: EditalArquivo | undefined = await getEditalArquivoService(id);

                        const descricao = edital?.releases?.[0]?.description;

                        if (descricao == null) {
                            idsRestantes.push(id);
                        } else {
                            const e: Edital = await getEditalPorIdService(id) as Edital;

                            toast.success(
                                `Edital ${e.name} processado!`, {
                                    description: "O resultado do edital processado já está disponível para visualização."
                                }
                            );
                        }

                    } catch {
                        idsRestantes.push(id);
                    }
                }

                setLista(idsRestantes);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(idsRestantes));

                if (idsRestantes.length === 0) {
                    stopPolling(); // 🔴 para quando terminar tudo
                }

            } finally {
                isRunning.current = false;
            }

        }, 10000);
    }

    function stopPolling() {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }

    return (
        <ProcEditalContexto.Provider
            value={{ lista, salvarLista }}
        >
            {children}
        </ProcEditalContexto.Provider>
    );
}
