"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ClipboardCheck, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import Calendario from "@/components/Calendario";
import AprovarSugestoes from "@/components/sugestao/AprovarSugestoes";
import type { SessaoSugestao } from "@/core/sugestaoTipificacao";
import { listarSessoesSugestaoService } from "@/service/sugestaoTipificacao";

function classesStatus(status: SessaoSugestao["status"]) {
    if (status === "completed")
        return "bg-verde text-white border-verde";
    if (status === "failed")
        return "bg-vermelho text-white border-vermelho";
    if (status === "ready")
        return "bg-white text-verde border-verde";
    return "bg-gray-100 text-gray-600 border-gray-300";
}

function rotuloStatus(status: SessaoSugestao["status"]) {
    if (status === "processing") return "Processando";
    if (status === "ready") return "Em revisão";
    if (status === "failed") return "Falhou";
    return "Concluída";
}

export default function Sugestoes() {
    const [sessoes, setSessoes] = useState<SessaoSugestao[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [sessaoSelecionada, setSessaoSelecionada] = useState<string | null>(
        null,
    );
    const [ciclo, setCiclo] = useState(0);
    const statusAnteriores = useRef<Map<string, SessaoSugestao["status"]>>(
        new Map(),
    );

    const carregar = useCallback(async (silencioso = false) => {
        if (!silencioso) setCarregando(true);
        setErro("");

        try {
            const resultado = await listarSessoesSugestaoService();

            resultado.forEach((sessao) => {
                const anterior = statusAnteriores.current.get(sessao.id);

                if (anterior === "processing" && sessao.status !== "processing") {
                    if (sessao.status === "ready") {
                        toast.success("Sugestões prontas para aprovação!", {
                            description: sessao.original_filename,
                        });
                    } else if (sessao.status === "failed") {
                        toast.error("Não foi possível gerar as sugestões.", {
                            description: sessao.original_filename,
                        });
                    } else {
                        toast.info("Sugestões atualizadas.", {
                            description: sessao.original_filename,
                        });
                    }
                }

                statusAnteriores.current.set(sessao.id, sessao.status);
            });

            setSessoes(resultado);

            setSessaoSelecionada((atual) => {
                if (atual && resultado.some((sessao) => sessao.id === atual)) {
                    return atual;
                }

                const comPendencias = resultado.find(
                    (sessao) => sessao.status === "ready",
                );

                return comPendencias?.id ?? resultado[0]?.id ?? null;
            });
        } catch (erroCarregamento) {
            if (!silencioso) {
                setErro(
                    erroCarregamento instanceof Error
                        ? erroCarregamento.message
                        : "Erro ao buscar as gerações por documento.",
                );
            }
        } finally {
            if (!silencioso) setCarregando(false);
        }
    }, []);

    useEffect(() => {
        void carregar();
    }, [carregar]);

    // Mantém a lista atualizada enquanto houver geração em andamento.
    useEffect(() => {
        if (!sessoes.some((sessao) => sessao.status === "processing")) return;

        const timer = window.setTimeout(async () => {
            await carregar(true);
            setCiclo((atual) => atual + 1);
        }, 3000);

        return () => window.clearTimeout(timer);
    }, [sessoes, ciclo, carregar]);

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2 sticky top-0 z-1 justify-between w-full">
                <div className="flex w-full justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-4xl font-bold">Sugestões</h2>
                        <p className="text-sm text-gray-500">
                            Aprove ou descarte as tipificações, taxonomias e ramos
                            gerados a partir de documentos.
                        </p>
                    </div>

                    <Link
                        href="/adm/tipificacoes"
                        className="flex rounded-md gap-2 items-center px-4 py-2 bg-vermelho text-white hover:cursor-pointer"
                        style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                    >
                        <Plus size={18} />
                        <span className="text-sm">Nova sugestão</span>
                    </Link>
                </div>
            </div>

            {carregando ? (
                <div className="flex justify-center items-center gap-2 py-10">
                    <span>Carregando sugestões...</span>
                    <Loader2 className="animate-spin" />
                </div>
            ) : erro ? (
                <p className="text-center text-vermelho py-10">{erro}</p>
            ) : sessoes.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-10">
                    <ClipboardCheck size={40} className="text-gray-300" />
                    <p className="text-gray-400 text-2xl text-center animate-pulse">
                        Nenhuma sugestão gerada até o momento.
                    </p>
                    <p className="text-sm text-gray-500">
                        Use &quot;Adicionar tipificação&quot; e escolha gerar a partir
                        de um documento.
                    </p>
                </div>
            ) : (
                <div className="flex gap-5 items-start">
                    <div className="flex flex-col w-1/3 min-w-0 max-h-[calc(100vh-200px)] overflow-y-auto px-3 py-1">
                        {sessoes.map((sessao) => {
                            const selecionada = sessao.id === sessaoSelecionada;

                            return (
                                <button
                                    key={sessao.id}
                                    type="button"
                                    onClick={() => setSessaoSelecionada(sessao.id)}
                                    className={`
                                        w-full text-left rounded-md p-4 mb-3
                                        transition ease-in-out duration-100
                                        h-fit relative cursor-pointer
                                        ${selecionada
                                            ? "border-2 border-verde bg-verde/5"
                                            : "border-2 border-transparent bg-white hover:bg-gray-50"}
                                    `}
                                    style={{
                                        boxShadow: "0 0 5px rgba(0,0,0,.3)",
                                    }}
                                >
                                    <div className="flex flex-col gap-2">
                                        <span className="font-semibold wrap-break-word">
                                            {sessao.original_filename}
                                        </span>

                                        <span className="text-sm text-gray-500">
                                            {sessao.mode === "create"
                                                ? "Nova tipificação"
                                                : `Enriquecer: ${sessao.target_typification_name ?? "—"}`}
                                        </span>

                                        {sessao.document_group_name && (
                                            <span className="text-sm text-gray-500">
                                                Grupo: {sessao.document_group_name}
                                                {" · "}
                                                Tipo:{" "}
                                                {sessao.document_group_item_name ?? "—"}
                                            </span>
                                        )}

                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span
                                                className={`rounded-sm border px-2 py-0.5 text-xs ${classesStatus(sessao.status)}`}
                                            >
                                                {rotuloStatus(sessao.status)}
                                            </span>
                                        </div>

                                        <Calendario data={sessao.created_at} />
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex-1 min-w-0 max-h-[calc(100vh-200px)] overflow-y-auto px-3 py-1">
                        {sessaoSelecionada ? (
                            <AprovarSugestoes sessionId={sessaoSelecionada} />
                        ) : (
                            <p className="text-gray-400 text-center py-10 animate-pulse">
                                Selecione uma sugestão para revisar.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
