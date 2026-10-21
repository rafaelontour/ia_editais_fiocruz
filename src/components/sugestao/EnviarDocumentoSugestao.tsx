"use client";

import { useState } from "react";
import {
    Layers3,
    Loader2,
    ShieldCheck,
    Upload,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

import { FileUpload } from "@/components/ui/file-upload";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Tipificacao } from "@/core";
import type { SessaoSugestaoDetalhe } from "@/core/sugestaoTipificacao";
import { criarSessaoSugestaoService } from "@/service/sugestaoTipificacao";

type ModoSugestao = "create" | "enrich";

type OpcaoModo = {
    valor: ModoSugestao;
    titulo: string;
    descricao: string;
    icone: LucideIcon;
};

const OPCOES: OpcaoModo[] = [
    {
        valor: "create",
        titulo: "Criar nova tipificação",
        descricao:
            "Gera uma tipificação nova, com taxonomias e ramos, a partir do documento.",
        icone: Layers3,
    },
    {
        valor: "enrich",
        titulo: "Enriquecer tipificação existente",
        descricao:
            "Sugere taxonomias e ramos para uma tipificação que já está cadastrada.",
        icone: ShieldCheck,
    },
];

type EnviarDocumentoSugestaoProps = {
    tipificacoes: Tipificacao[];
    aoEnviar: (sessao: SessaoSugestaoDetalhe) => void;
    aoCancelar: () => void;
};

export default function EnviarDocumentoSugestao({
    tipificacoes,
    aoEnviar,
    aoCancelar,
}: EnviarDocumentoSugestaoProps) {
    const [modo, setModo] = useState<ModoSugestao>("create");
    const [tipificacaoAlvo, setTipificacaoAlvo] = useState("");
    const [arquivo, setArquivo] = useState<File | null>(null);
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState("");

    async function enviar() {
        if (enviando) return;

        if (!arquivo) {
            setErro("Selecione o documento PDF que será analisado.");
            return;
        }

        const parecePdf =
            arquivo.type === "application/pdf" ||
            arquivo.name.toLowerCase().endsWith(".pdf");

        if (!parecePdf) {
            setErro("O documento selecionado precisa ser um arquivo PDF.");
            return;
        }

        if (modo === "enrich" && !tipificacaoAlvo) {
            setErro("Selecione a tipificação que será enriquecida.");
            return;
        }

        setEnviando(true);
        setErro("");

        try {
            const sessao = await criarSessaoSugestaoService(
                arquivo,
                modo === "enrich" ? tipificacaoAlvo : undefined,
            );

            toast.success("Documento enviado!", {
                description:
                    "As sugestões ficaram prontas para revisão na tela de Sugestões.",
            });

            aoEnviar(sessao);
        } catch (erroEnvio) {
            setErro(
                erroEnvio instanceof Error
                    ? erroEnvio.message
                    : "Erro ao enviar o documento.",
            );
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label className="text-lg">Objetivo da geração</Label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {OPCOES.map((opcao) => {
                        const selecionada = modo === opcao.valor;
                        const Icone = opcao.icone;

                        return (
                            <button
                                key={opcao.valor}
                                type="button"
                                onClick={() => setModo(opcao.valor)}
                                className={`
                                    flex flex-col items-start gap-2 text-left rounded-md p-4
                                    border-2 transition duration-100 cursor-pointer
                                    ${selecionada
                                        ? "border-verde bg-verde/5"
                                        : "border-gray-300 bg-white hover:bg-gray-50"}
                                `}
                            >
                                <span className="flex items-center gap-2 font-semibold">
                                    <Icone
                                        size={20}
                                        className={selecionada ? "text-verde" : "text-gray-500"}
                                    />
                                    {opcao.titulo}
                                </span>

                                <span className="text-sm text-gray-500">
                                    {opcao.descricao}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {modo === "enrich" && (
                <div className="flex flex-col gap-2">
                    <Label className="text-lg">Tipificação a enriquecer</Label>

                    <Select value={tipificacaoAlvo} onValueChange={setTipificacaoAlvo}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione a tipificação" />
                        </SelectTrigger>
                        <SelectContent>
                            {tipificacoes.map((tipificacao) => (
                                <SelectItem key={tipificacao.id} value={tipificacao.id}>
                                    {tipificacao.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {tipificacoes.length === 0 && (
                        <span className="text-sm text-gray-500 italic">
                            Não há tipificações cadastradas para enriquecer.
                        </span>
                    )}
                </div>
            )}

            <div className="flex flex-col gap-2">
                <Label className="text-lg">Documento</Label>

                <FileUpload
                    value={arquivo}
                    onChange={(arquivos) => setArquivo(arquivos[0] ?? null)}
                />

                <span className="text-sm text-gray-500 italic">
                    O documento é analisado e as sugestões de tipificação, taxonomias e
                    ramos ficam disponíveis para aprovação na tela de Sugestões.
                </span>
            </div>

            {erro && (
                <span className="text-sm text-vermelho font-medium">{erro}</span>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={aoCancelar}
                    className={`
                        h-full flex items-center justify-center
                        transition ease-in-out text-white
                        rounded-md px-3 bg-vermelho
                        hover:cursor-pointer text-sm
                    `}
                    style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                >
                    Cancelar
                </button>

                <button
                    type="button"
                    onClick={enviar}
                    disabled={enviando}
                    className={`
                        flex items-center gap-2 bg-verde hover:bg-verde
                        text-white rounded-md px-4 py-2
                        hover:cursor-pointer disabled:opacity-60
                    `}
                    style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                >
                    {enviando ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            <span className="text-sm">Enviando...</span>
                        </>
                    ) : (
                        <>
                            <Upload size={18} />
                            <span className="text-sm">Enviar e gerar sugestões</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
