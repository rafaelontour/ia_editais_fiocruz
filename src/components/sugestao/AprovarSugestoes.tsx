"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    AlertTriangle,
    BookOpen,
    Check,
    FileText,
    GitBranch,
    Layers3,
    Loader2,
    Pencil,
    ShieldCheck,
    X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
    ItemSugestao,
    SessaoSugestaoDetalhe,
    StatusItemSugestao,
    TipoItemSugestao,
} from "@/core/sugestaoTipificacao";
import {
    confirmarItemSugestaoService,
    descartarItemSugestaoService,
    descartarPendentesSessaoService,
    obterSessaoSugestaoService,
} from "@/service/sugestaoTipificacao";

const ROTULO_TIPO: Record<TipoItemSugestao, string> = {
    source: "Fonte",
    typification: "Tipificação",
    taxonomy: "Taxonomia",
    branch: "Ramo",
};

const ROTULO_OPERACAO: Record<"create" | "update", string> = {
    create: "Criar",
    update: "Atualizar",
};

const ICONE_TIPO: Record<TipoItemSugestao, LucideIcon> = {
    source: BookOpen,
    typification: Layers3,
    taxonomy: ShieldCheck,
    branch: GitBranch,
};

function classesStatusItem(status: StatusItemSugestao) {
    if (status === "confirmed")
        return "bg-verde text-white border-verde";
    if (status === "discarded")
        return "bg-gray-200 text-gray-500 border-gray-300";
    return "bg-white text-gray-600 border-gray-300";
}

function traduzirErro(mensagem: string) {
    if (mensagem.includes("Parent item must be confirmed"))
        return "A sugestão pai precisa ser aprovada antes desta.";
    if (mensagem.includes("Parent entity no longer exists"))
        return "A tipificação ou taxonomia de origem não existe mais.";
    if (mensagem.includes("Target entity changed"))
        return "O item foi alterado desde a sugestão. Revise e tente novamente.";
    if (mensagem.includes("already"))
        return "Esta sugestão já foi aplicada.";

    return mensagem;
}

type AprovarSugestoesProps = {
    sessionId: string;
    aoAplicar?: () => void;
};

export default function AprovarSugestoes({
    sessionId,
    aoAplicar,
}: AprovarSugestoesProps) {
    const [detalhe, setDetalhe] = useState<SessaoSugestaoDetalhe | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [salvandoId, setSalvandoId] = useState<string | null>(null);
    const [descartandoId, setDescartandoId] = useState<string | null>(null);
    const [processandoLote, setProcessandoLote] = useState(false);
    const [itemEmEdicao, setItemEmEdicao] = useState<string | null>(null);
    const [tituloEdicao, setTituloEdicao] = useState("");
    const [descricaoEdicao, setDescricaoEdicao] = useState("");

    const carregar = useCallback(
        async (mostrarCarregamento = true) => {
            if (mostrarCarregamento) setCarregando(true);
            setErro("");

            try {
                const resultado = await obterSessaoSugestaoService(sessionId);
                setDetalhe(resultado);
            } catch (erroCarregamento) {
                setErro(
                    erroCarregamento instanceof Error
                        ? erroCarregamento.message
                        : "Erro ao buscar as sugestões do documento.",
                );
            } finally {
                if (mostrarCarregamento) setCarregando(false);
            }
        },
        [sessionId],
    );

    useEffect(() => {
        void carregar();
    }, [carregar]);

    useEffect(() => {
        if (detalhe?.status !== "processing") return;

        const timer = window.setTimeout(() => void carregar(false), 3000);
        return () => window.clearTimeout(timer);
    }, [detalhe, carregar]);

    const itens = useMemo(() => detalhe?.items ?? [], [detalhe]);
    const itensPorId = useMemo(
        () => new Map(itens.map((item) => [item.id, item])),
        [itens],
    );
    const filhosPorPai = useMemo(() => {
        const mapa = new Map<string, ItemSugestao[]>();
        for (const item of itens) {
            if (!item.parent_item_id) continue;
            const filhos = mapa.get(item.parent_item_id) ?? [];
            filhos.push(item);
            mapa.set(item.parent_item_id, filhos);
        }
        for (const [pai, filhos] of mapa) {
            mapa.set(
                pai,
                [...filhos].sort((a, b) => a.position - b.position),
            );
        }
        return mapa;
    }, [itens]);

    const itensRaiz = useMemo(
        () =>
            itens
                .filter((item) => !item.parent_item_id)
                .sort((a, b) => a.position - b.position),
        [itens],
    );

    const pendentes = itens.filter((item) => item.status === "pending");
    const confirmadas = itens.filter((item) => item.status === "confirmed").length;
    const descartadas = itens.filter((item) => item.status === "discarded").length;

    function abrirEdicao(item: ItemSugestao) {
        setItemEmEdicao(item.id);
        setTituloEdicao(item.proposed_title);
        setDescricaoEdicao(item.proposed_description ?? "");
    }

    function fecharEdicao() {
        setItemEmEdicao(null);
        setTituloEdicao("");
        setDescricaoEdicao("");
    }

    async function confirmar(item: ItemSugestao, edicao?: {
        title: string;
        description: string;
    }) {
        const pai = item.parent_item_id
            ? itensPorId.get(item.parent_item_id)
            : null;

        if (pai && pai.status !== "confirmed") {
            toast.error("Aprove a sugestão pai antes desta.");
            return false;
        }

        if (edicao && !edicao.title.trim()) {
            toast.error("Informe o título que será aplicado.");
            return false;
        }

        setSalvandoId(item.id);

        try {
            await confirmarItemSugestaoService(sessionId, item.id, {
                title: edicao?.title.trim() || item.proposed_title,
                description:
                    edicao?.description.trim() || item.proposed_description || "",
            });

            toast.success("Sugestão aplicada!");
            fecharEdicao();
            await carregar(false);
            aoAplicar?.();

            return true;
        } catch (erroConfirmacao) {
            toast.error(
                erroConfirmacao instanceof Error
                    ? traduzirErro(erroConfirmacao.message)
                    : "Erro ao aplicar a sugestão.",
            );
            return false;
        } finally {
            setSalvandoId(null);
        }
    }

    async function descartar(item: ItemSugestao) {
        setDescartandoId(item.id);

        try {
            await descartarItemSugestaoService(sessionId, item.id);
            toast.success("Sugestão descartada.");
            await carregar(false);
        } catch (erroDescarte) {
            toast.error(
                erroDescarte instanceof Error
                    ? erroDescarte.message
                    : "Erro ao descartar a sugestão.",
            );
        } finally {
            setDescartandoId(null);
        }
    }

    async function aprovarTodas() {
        if (processandoLote || pendentes.length === 0) return;

        setProcessandoLote(true);

        const statusPorId = new Map<string, StatusItemSugestao | "failed">(
            itens.map((item) => [item.id, item.status]),
        );
        const erros: string[] = [];

        let aplicadas = 0;
        let restantes = [...pendentes];

        while (restantes.length > 0) {
            const proximo = restantes.find((item) => {
                if (!item.parent_item_id) return true;

                return statusPorId.get(item.parent_item_id) === "confirmed";
            });

            if (!proximo) break;

            restantes = restantes.filter((item) => item.id !== proximo.id);

            try {
                await confirmarItemSugestaoService(sessionId, proximo.id, {
                    title: proximo.proposed_title,
                    description: proximo.proposed_description ?? "",
                });

                statusPorId.set(proximo.id, "confirmed");
                aplicadas += 1;
            } catch (erroAplicacao) {
                statusPorId.set(proximo.id, "failed");
                erros.push(
                    erroAplicacao instanceof Error
                        ? traduzirErro(erroAplicacao.message)
                        : "Erro ao aplicar a sugestão.",
                );
            }
        }

        await carregar(false);

        const ignoradas = restantes.length;

        if (aplicadas > 0 && erros.length === 0 && ignoradas === 0) {
            toast.success(`${aplicadas} sugestões aplicadas.`);
        } else if (aplicadas > 0) {
            toast.warning(
                `${aplicadas} aplicadas e ${
                    erros.length + ignoradas
                } não aplicadas.`,
                {
                    description:
                        erros[0] ??
                        "As sugestões ignoradas dependem de um item pai que não foi aprovado.",
                },
            );
        } else if (erros.length > 0) {
            toast.error("Nenhuma sugestão foi aplicada.", {
                description: erros[0],
            });
        }

        setProcessandoLote(false);
    }

    async function descartarTodas() {
        if (processandoLote || pendentes.length === 0) return;

        setProcessandoLote(true);

        try {
            await descartarPendentesSessaoService(sessionId);
            toast.success("Sugestões pendentes descartadas.");
            await carregar(false);
        } catch (erroDescarte) {
            toast.error(
                erroDescarte instanceof Error
                    ? erroDescarte.message
                    : "Erro ao descartar as sugestões.",
            );
        } finally {
            setProcessandoLote(false);
        }
    }

    function renderizarItem(item: ItemSugestao, nivel = 0) {
        const filhos = filhosPorPai.get(item.id) ?? [];
        const pai = item.parent_item_id
            ? itensPorId.get(item.parent_item_id)
            : null;
        const bloqueado = Boolean(pai && pai.status !== "confirmed");
        const Icone = ICONE_TIPO[item.kind];
        const emEdicao = itemEmEdicao === item.id;

        return (
            <div
                key={item.id}
                className="flex flex-col gap-2 rounded-md border border-gray-200 bg-white p-3"
                style={{ marginLeft: `${nivel * 20}px` }}
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                        <Icone size={18} className="text-verde mt-1" />

                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold">
                                    {item.proposed_title}
                                </span>

                                <span className="rounded-sm border border-gray-300 bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                    {ROTULO_TIPO[item.kind]}
                                </span>

                                <span className="rounded-sm border border-gray-300 bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                    {ROTULO_OPERACAO[item.operation]}
                                </span>

                                <span
                                    className={`rounded-sm border px-2 py-0.5 text-xs ${classesStatusItem(item.status)}`}
                                >
                                    {item.status === "confirmed"
                                        ? "Aplicada"
                                        : item.status === "discarded"
                                          ? "Descartada"
                                          : "Pendente"}
                                </span>
                            </div>

                            {item.proposed_description && (
                                <p className="text-sm text-gray-600">
                                    {item.proposed_description}
                                </p>
                            )}

                            {item.rationale && (
                                <p className="text-sm text-gray-500 italic">
                                    {item.rationale}
                                </p>
                            )}
                        </div>
                    </div>

                    {item.status === "pending" && (
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                type="button"
                                title="Editar antes de aplicar"
                                onClick={() =>
                                    emEdicao ? fecharEdicao() : abrirEdicao(item)
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-sm border border-gray-300 bg-white hover:bg-gray-100 cursor-pointer"
                            >
                                <Pencil size={16} />
                            </button>

                            <button
                                type="button"
                                title="Descartar sugestão"
                                disabled={descartandoId === item.id}
                                onClick={() => void descartar(item)}
                                className="flex h-8 w-8 items-center justify-center rounded-sm border border-vermelho bg-vermelho text-white hover:bg-vermelho cursor-pointer disabled:opacity-60"
                            >
                                {descartandoId === item.id ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <X size={16} />
                                )}
                            </button>

                            <button
                                type="button"
                                title="Aplicar sugestão"
                                disabled={bloqueado || salvandoId === item.id}
                                onClick={() => void confirmar(item)}
                                className="flex h-8 items-center gap-2 rounded-sm border border-verde bg-verde px-3 text-sm text-white hover:bg-verde cursor-pointer disabled:opacity-50"
                            >
                                {salvandoId === item.id ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Check size={16} />
                                )}
                                <span className="text-sm">Aplicar</span>
                            </button>
                        </div>
                    )}
                </div>

                {bloqueado && item.status === "pending" && (
                    <p className="flex items-center gap-2 text-xs text-gray-500">
                        <AlertTriangle size={14} />
                        Aprove antes a sugestão pai para aplicar esta.
                    </p>
                )}

                {emEdicao && (
                    <div className="flex flex-col gap-2 rounded-md bg-gray-50 p-3">
                        <div className="flex flex-col gap-1">
                            <Label className="text-sm">Título</Label>
                            <Input
                                value={tituloEdicao}
                                onChange={(evento) =>
                                    setTituloEdicao(evento.target.value)
                                }
                                className="bg-white"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label className="text-sm">Descrição</Label>
                            <Textarea
                                value={descricaoEdicao}
                                onChange={(evento) =>
                                    setDescricaoEdicao(evento.target.value)
                                }
                                className="bg-white"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2">
                            <Button
                                type="button"
                                variant={"ghost"}
                                onClick={fecharEdicao}
                            >
                                <span className="text-sm">Cancelar</span>
                            </Button>

                            <Button
                                type="button"
                                disabled={salvandoId === item.id}
                                onClick={() =>
                                    void confirmar(item, {
                                        title: tituloEdicao,
                                        description: descricaoEdicao,
                                    })
                                }
                                className="bg-verde text-white hover:bg-verde cursor-pointer"
                            >
                                <span className="text-sm">Aplicar</span>
                            </Button>
                        </div>
                    </div>
                )}

                {item.evidence && item.evidence.length > 0 && (
                    <div className="flex flex-col gap-1 border-l-2 border-gray-200 pl-3">
                        {item.evidence.map((evidencia, indice) => (
                            <p
                                key={indice}
                                className="text-sm text-gray-600 italic"
                            >
                                &ldquo;{evidencia.quote}&rdquo;
                                {evidencia.pages && evidencia.pages.length > 0 && (
                                    <span className="text-xs text-gray-400 not-italic">
                                        {" "}
                                        (pág. {evidencia.pages.join(", ")})
                                    </span>
                                )}
                            </p>
                        ))}
                    </div>
                )}

                {filhos.map((filho) => renderizarItem(filho, nivel + 1))}
            </div>
        );
    }

    if (carregando) {
        return (
            <div className="flex items-center justify-center gap-2 py-10">
                <Loader2 className="animate-spin" />
                <span>Carregando sugestões...</span>
            </div>
        );
    }

    if (erro && !detalhe) {
        return (
            <p className="text-center text-vermelho py-10">{erro}</p>
        );
    }

    if (!detalhe) {
        return (
            <p className="text-center text-gray-400 py-10 animate-pulse">
                Nenhuma sugestão carregada.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 rounded-md border border-gray-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-2 font-semibold">
                            <FileText size={18} className="text-verde" />
                            {detalhe.original_filename}
                        </span>

                        <span className="text-sm text-gray-500">
                            {detalhe.mode === "create"
                                ? "Nova tipificação"
                                : `Tipificação: ${detalhe.target_typification_name ?? "—"}`}
                            {detalhe.page_count ? ` • ${detalhe.page_count} páginas` : ""}
                        </span>

                        {detalhe.document_group_name && (
                            <span className="text-sm text-gray-500">
                                Grupo: {detalhe.document_group_name} • Tipo:{" "}
                                {detalhe.document_group_item_name ?? "—"}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {detalhe.status === "processing" && (
                            <span className="flex items-center gap-2 rounded-sm border border-gray-300 bg-gray-100 px-2 py-1 text-xs text-gray-600">
                                <Loader2 size={14} className="animate-spin" />
                                Gerando sugestões
                            </span>
                        )}

                        {detalhe.status === "failed" && (
                            <span className="rounded-sm border border-vermelho bg-vermelho px-2 py-1 text-xs text-white">
                                Falhou
                            </span>
                        )}

                        {detalhe.status === "completed" && (
                            <span className="rounded-sm border border-verde bg-verde px-2 py-1 text-xs text-white">
                                Concluída
                            </span>
                        )}

                        {detalhe.status === "ready" && (
                            <span className="rounded-sm border border-verde bg-verde/10 px-2 py-1 text-xs text-verde">
                                Em revisão
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                    <span>
                        <strong>{pendentes.length}</strong> pendentes
                    </span>
                    <span>
                        <strong>{confirmadas}</strong> aplicadas
                    </span>
                    <span>
                        <strong>{descartadas}</strong> descartadas
                    </span>
                </div>

                {detalhe.error_message && (
                    <p className="flex items-center gap-2 text-sm text-vermelho">
                        <AlertTriangle size={16} />
                        {detalhe.error_message}
                    </p>
                )}

                {pendentes.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            type="button"
                            onClick={() => void aprovarTodas()}
                            disabled={processandoLote}
                            className="flex items-center gap-2 rounded-md bg-verde px-4 py-2 text-sm text-white hover:bg-verde cursor-pointer disabled:opacity-60"
                            style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                        >
                            {processandoLote ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Check size={16} />
                            )}
                            <span>Aprovar todas pendentes</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => void descartarTodas()}
                            disabled={processandoLote}
                            className="flex items-center gap-2 rounded-md border border-vermelho px-4 py-2 text-sm text-vermelho hover:bg-vermelho/10 cursor-pointer disabled:opacity-60"
                        >
                            <X size={16} />
                            <span>Descartar todas pendentes</span>
                        </button>
                    </div>
                )}
            </div>

            {itens.length > 0 ? (
                <div className="flex flex-col gap-2">
                    {itensRaiz.map((item) => renderizarItem(item))}
                </div>
            ) : (
                <p className="text-center text-gray-400 py-10 animate-pulse">
                    {detalhe.status === "processing"
                        ? "As sugestões ainda estão sendo geradas..."
                        : "Nenhuma sugestão foi gerada para este documento."}
                </p>
            )}

            {detalhe.excluded_rules && detalhe.excluded_rules.length > 0 && (
                <div className="flex flex-col gap-2 rounded-md border border-gray-200 bg-white p-4">
                    <span className="font-semibold">
                        Regras desconsideradas na geração
                    </span>

                    {detalhe.excluded_rules.map((regra, indice) => (
                        <div
                            key={indice}
                            className="flex flex-col gap-1 border-l-2 border-gray-200 pl-3"
                        >
                            <span className="text-sm font-medium">
                                {regra.title}
                            </span>
                            <span className="text-sm text-gray-600 italic">
                                &ldquo;{regra.quote}&rdquo;
                                {regra.pages && regra.pages.length > 0 && (
                                    <span className="text-xs text-gray-400 not-italic">
                                        {" "}
                                        (pág. {regra.pages.join(", ")})
                                    </span>
                                )}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
