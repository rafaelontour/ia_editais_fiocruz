"use client";

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
    }, []);

    // 🔹 Controla o ciclo de vida do polling
    useEffect(() => {
        if (lista.length === 0) {
            stopPolling();
            return;
        }

        startPolling();

        return () => stopPolling();
    }, [lista]);

    function salvarLista(ids: string[]) {
        setLista(ids);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    }

    function startPolling() {
        if (intervalRef.current) return;

        intervalRef.current = setInterval(async () => {
            if (isRunning.current) return;
            isRunning.current = true;

            try {
                if (lista.length === 0) return;

                const idsRestantes: string[] = [];

                for (const id of lista) {
                    try {
                        const edital: EditalArquivo | undefined =
                            await getEditalArquivoService(id);

                        const descricao = edital?.releases?.[0]?.description;

                        if (!descricao) {
                            idsRestantes.push(id);
                        } else {
                            const e = await getEditalPorIdService(id) as Edital;

                            toast.success(
                                `Edital ${e.name} processado!`,
                                {
                                    description:
                                        "O resultado do edital processado já está disponível para visualização."
                                }
                            );
                        }
                    } catch {
                        idsRestantes.push(id);
                    }
                }

                salvarLista(idsRestantes);

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
        <ProcEditalContexto.Provider value={{ lista, salvarLista }}>
            {children}
        </ProcEditalContexto.Provider>
    );
}