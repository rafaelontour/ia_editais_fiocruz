"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  Check,
  FileText,
  FileUp,
  GitBranch,
  Layers3,
  Loader2,
  Pencil,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import type { Tipificacao } from "@/core";
import type {
  ItemSugestao,
  SessaoSugestao,
  SessaoSugestaoDetalhe,
  StatusItemSugestao,
  StatusSessaoSugestao,
  TipoItemSugestao,
} from "@/core/sugestaoTipificacao";
import { cn, formatarData } from "@/lib/utils";
import {
  confirmarItemSugestaoService,
  criarSessaoSugestaoService,
  descartarItemSugestaoService,
  descartarPendentesSessaoService,
  listarSessoesSugestaoService,
  obterSessaoSugestaoService,
} from "@/service/sugestaoTipificacao";

const ROTULO_STATUS_SESSAO: Record<StatusSessaoSugestao, string> = {
  processing: "Processando",
  ready: "Em revisão",
  failed: "Falhou",
  completed: "Concluída",
};

const ROTULO_TIPO_ITEM: Record<TipoItemSugestao, string> = {
  source: "Fonte",
  typification: "Tipificação",
  taxonomy: "Taxonomia",
  branch: "Ramo",
};

const ROTULO_STATUS_ITEM: Record<StatusItemSugestao, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  discarded: "Descartado",
};

const ICONE_TIPO_ITEM = {
  source: BookOpen,
  typification: Layers3,
  taxonomy: ShieldCheck,
  branch: GitBranch,
};

type ModoSugestao = "create" | "enrich";
type MutacaoAtiva = { tipo: "confirmar" | "descartar" | "descartar-todos"; itemId?: string } | null;
type ConfirmacaoDescarte =
  | { tipo: "item"; item: ItemSugestao }
  | { tipo: "sessao" }
  | null;

type GerarTipificacaoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Quando informado, o diálogo trabalha apenas no modo de enriquecimento. */
  tipificacaoId?: string;
  /** Tipificações existentes, usadas para escolher o alvo no modo enriquecimento. */
  tipificacoes?: Tipificacao[];
  /** Executado depois que uma sugestão é aplicada na árvore real. */
  aoAplicar?: () => void;
};

function classesStatusSessao(status: StatusSessaoSugestao) {
  if (status === "ready")
    return "border-verde/40 bg-verde/10 text-verde";
  if (status === "completed")
    return "border-green-600/35 bg-green-600/10 text-green-700";
  if (status === "failed") return "border-vermelho/40 bg-vermelho/10 text-vermelho";
  return "border-amber-600/40 bg-amber-500/10 text-amber-700";
}

function classesStatusItem(status: StatusItemSugestao) {
  if (status === "confirmed")
    return "border-green-600/35 bg-green-600/10 text-green-700";
  if (status === "discarded")
    return "border-gray-300 bg-gray-100 text-gray-500";
  return "border-gray-300 bg-gray-100 text-gray-600";
}

function arquivoParecePdf(arquivo: File) {
  return (
    arquivo.type === "application/pdf" ||
    (!arquivo.type && arquivo.name.toLowerCase().endsWith(".pdf"))
  );
}

function ordenarItens(itens: ItemSugestao[]) {
  return [...itens].sort(
    (a, b) =>
      a.position - b.position ||
      a.proposed_title.localeCompare(b.proposed_title, "pt-BR"),
  );
}

function resumoDaSessao(detalhe: SessaoSugestaoDetalhe): SessaoSugestao {
  return {
    id: detalhe.id,
    mode: detalhe.mode,
    status: detalhe.status,
    target_typification_id: detalhe.target_typification_id,
    target_typification_name: detalhe.target_typification_name,
    original_filename: detalhe.original_filename,
    file_path: detalhe.file_path,
    page_count: detalhe.page_count,
    error_message: detalhe.error_message,
    generation_model: detalhe.generation_model,
    created_by: detalhe.created_by,
    created_at: detalhe.created_at,
    processing_started_at: detalhe.processing_started_at,
    processing_finished_at: detalhe.processing_finished_at,
  };
}

export default function GerarTipificacaoDialog({
  open,
  onOpenChange,
  tipificacaoId,
  tipificacoes = [],
  aoAplicar,
}: GerarTipificacaoDialogProps) {
  const modoFixo = tipificacaoId ? "enrich" : null;
  const [modo, setModo] = useState<ModoSugestao>(modoFixo ?? "create");
  const [tipificacaoAlvo, setTipificacaoAlvo] = useState(tipificacaoId ?? "");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [erroEnvio, setErroEnvio] = useState("");
  const [enviando, setEnviando] = useState(false);
  const arquivoRef = useRef<HTMLInputElement>(null);

  const [sessoes, setSessoes] = useState<SessaoSugestao[]>([]);
  const [carregandoSessoes, setCarregandoSessoes] = useState(true);
  const [erroSessoes, setErroSessoes] = useState("");
  const [sessaoSelecionadaId, setSessaoSelecionadaId] = useState<
    string | null
  >(null);
  const [detalhe, setDetalhe] = useState<SessaoSugestaoDetalhe | null>(null);
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);
  const [erroDetalhe, setErroDetalhe] = useState("");
  const sequenciaDetalhe = useRef(0);

  const [itemEmEdicao, setItemEmEdicao] = useState<ItemSugestao | null>(null);
  const [tituloEdicao, setTituloEdicao] = useState("");
  const [descricaoEdicao, setDescricaoEdicao] = useState("");
  const [erroEdicao, setErroEdicao] = useState("");
  const [mutacaoAtiva, setMutacaoAtiva] = useState<MutacaoAtiva>(null);
  const [confirmacaoDescarte, setConfirmacaoDescarte] =
    useState<ConfirmacaoDescarte>(null);

  useEffect(() => {
    if (!open) return;
    setModo(modoFixo ?? "create");
    setTipificacaoAlvo(tipificacaoId ?? "");
  }, [open, modoFixo, tipificacaoId]);

  const carregarSessoes = useCallback(async (mostrarCarregamento = true) => {
    if (mostrarCarregamento) setCarregandoSessoes(true);
    setErroSessoes("");
    try {
      const resultado = await listarSessoesSugestaoService();
      setSessoes(resultado);
    } catch (erro) {
      setErroSessoes(
        erro instanceof Error
          ? erro.message
          : "Erro ao buscar as gerações por documento.",
      );
    } finally {
      if (mostrarCarregamento) setCarregandoSessoes(false);
    }
  }, []);

  const carregarDetalhe = useCallback(
    async (sessionId: string, mostrarCarregamento = true) => {
      const sequencia = ++sequenciaDetalhe.current;
      if (mostrarCarregamento) setCarregandoDetalhe(true);
      setErroDetalhe("");
      try {
        const resultado = await obterSessaoSugestaoService(sessionId);
        if (sequencia !== sequenciaDetalhe.current) return;

        setDetalhe(resultado);
        setSessoes((atuais) => {
          const resumo = resumoDaSessao(resultado);
          return atuais.some((sessao) => sessao.id === resumo.id)
            ? atuais.map((sessao) =>
                sessao.id === resumo.id ? resumo : sessao,
              )
            : [resumo, ...atuais];
        });
      } catch (erro) {
        if (sequencia !== sequenciaDetalhe.current) return;
        setErroDetalhe(
          erro instanceof Error
            ? erro.message
            : "Erro ao buscar os detalhes da geração.",
        );
      } finally {
        if (mostrarCarregamento) setCarregandoDetalhe(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => void carregarSessoes(), 0);
    return () => window.clearTimeout(timer);
  }, [open, carregarSessoes]);

  useEffect(() => {
    if (!sessaoSelecionadaId) return;
    if (detalhe?.id === sessaoSelecionadaId) return;
    const timer = window.setTimeout(
      () => void carregarDetalhe(sessaoSelecionadaId),
      0,
    );
    return () => window.clearTimeout(timer);
  }, [carregarDetalhe, detalhe?.id, sessaoSelecionadaId]);

  useEffect(() => {
    if (!detalhe) return;
    if (detalhe.id !== sessaoSelecionadaId) return;
    if (detalhe.status !== "processing") return;

    const timer = window.setTimeout(
      () => void carregarDetalhe(detalhe.id, false),
      3000,
    );
    return () => window.clearTimeout(timer);
  }, [carregarDetalhe, detalhe, sessaoSelecionadaId]);

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
    for (const [pai, filhos] of mapa) mapa.set(pai, ordenarItens(filhos));
    return mapa;
  }, [itens]);
  const itensRaiz = useMemo(
    () => ordenarItens(itens.filter((item) => !item.parent_item_id)),
    [itens],
  );
  const pendentes = itens.filter((item) => item.status === "pending").length;

  function selecionarSessao(sessionId: string) {
    sequenciaDetalhe.current += 1;
    setSessaoSelecionadaId(sessionId);
    setDetalhe((atual) => (atual?.id === sessionId ? atual : null));
    setErroDetalhe("");
    setItemEmEdicao(null);
    setConfirmacaoDescarte(null);
  }

  async function enviarDocumento() {
    if (enviando) return;
    if (!arquivo) {
      setErroEnvio("Selecione um documento PDF.");
      return;
    }
    if (!arquivoParecePdf(arquivo)) {
      setErroEnvio("O documento selecionado precisa ser um arquivo PDF.");
      return;
    }
    const alvo = modo === "enrich" ? tipificacaoAlvo : "";
    if (modo === "enrich" && !alvo) {
      setErroEnvio("Selecione a tipificação que será enriquecida.");
      return;
    }

    setEnviando(true);
    setErroEnvio("");
    try {
      const sessao = await criarSessaoSugestaoService(arquivo, alvo || undefined);
      setArquivo(null);
      if (arquivoRef.current) arquivoRef.current.value = "";
      setSessaoSelecionadaId(sessao.id);
      setDetalhe(sessao);
      setSessoes((atuais) => [
        resumoDaSessao(sessao),
        ...atuais.filter((item) => item.id !== sessao.id),
      ]);
      toast.success("Documento enviado. A geração das sugestões foi iniciada.");
      void carregarSessoes(false);
    } catch (erro) {
      setErroEnvio(
        erro instanceof Error
          ? erro.message
          : "Erro ao iniciar a geração da tipificação.",
      );
    } finally {
      setEnviando(false);
    }
  }

  function abrirEdicao(item: ItemSugestao) {
    setItemEmEdicao(item);
    setTituloEdicao(item.proposed_title);
    setDescricaoEdicao(item.proposed_description ?? "");
    setErroEdicao("");
  }

  async function recarregarAposMutacao(recarregarArvore: boolean) {
    if (!sessaoSelecionadaId) return;
    await carregarDetalhe(sessaoSelecionadaId, false);
    await carregarSessoes(false);
    if (recarregarArvore) aoAplicar?.();
  }

  async function confirmar(
    item: ItemSugestao,
    edicao?: { title: string; description: string },
  ) {
    if (!detalhe || mutacaoAtiva) return;
    const pai = item.parent_item_id ? itensPorId.get(item.parent_item_id) : null;
    if (pai && pai.status !== "confirmed") {
      toast.error("Confirme o item pai antes de aplicar esta sugestão.");
      return;
    }
    if (edicao && !edicao.title.trim()) {
      setErroEdicao("Informe o título que será aplicado.");
      return;
    }

    setMutacaoAtiva({ tipo: "confirmar", itemId: item.id });
    try {
      await confirmarItemSugestaoService(detalhe.id, item.id, {
        title: edicao?.title.trim() || item.proposed_title,
        description: edicao ? edicao.description : item.proposed_description,
      });
      setItemEmEdicao(null);
      toast.success("Sugestão confirmada e aplicada na árvore real.");
      await recarregarAposMutacao(true);
    } catch (erro) {
      toast.error(
        erro instanceof Error
          ? erro.message
          : "Erro ao confirmar e aplicar a sugestão.",
      );
      await recarregarAposMutacao(false);
    } finally {
      setMutacaoAtiva(null);
    }
  }

  async function executarDescarte() {
    if (!detalhe || !confirmacaoDescarte || mutacaoAtiva) return;
    const confirmacao = confirmacaoDescarte;
    setConfirmacaoDescarte(null);
    setMutacaoAtiva(
      confirmacao.tipo === "item"
        ? { tipo: "descartar", itemId: confirmacao.item.id }
        : { tipo: "descartar-todos" },
    );

    try {
      if (confirmacao.tipo === "item") {
        await descartarItemSugestaoService(detalhe.id, confirmacao.item.id);
        toast.success("Sugestão descartada.");
      } else {
        await descartarPendentesSessaoService(detalhe.id);
        toast.success("Sugestões pendentes descartadas.");
      }
      await recarregarAposMutacao(false);
    } catch (erro) {
      toast.error(
        erro instanceof Error ? erro.message : "Erro ao descartar a sugestão.",
      );
      await recarregarAposMutacao(false);
    } finally {
      setMutacaoAtiva(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[92vh] max-w-[95vw] flex-col gap-0 overflow-hidden p-0 sm:max-w-[95vw]">
        <DialogHeader className="border-b border-gray-200 px-5 py-4">
          <DialogTitle className="text-2xl font-bold">
            Gerar tipificação a partir de documento
          </DialogTitle>
          <DialogDescription>
            Envie um PDF normativo, revise cada sugestão e escolha o que deve
            entrar na árvore real. Nenhuma alteração é aplicada automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <aside className="flex min-h-0 flex-col gap-4 border-b border-gray-200 bg-gray-50 p-4 lg:border-b-0 lg:border-r">
            <div className="flex flex-col gap-3 rounded-md border border-gray-200 bg-white p-3">
              <h3 className="font-bold">Novo documento</h3>

              {!modoFixo ? (
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-semibold">Objetivo</Label>
                  <label className="flex cursor-pointer items-start gap-2 rounded-md border border-gray-200 p-2">
                    <input
                      type="radio"
                      name="modo-sugestao"
                      checked={modo === "create"}
                      disabled={enviando}
                      onChange={() => setModo("create")}
                    />
                    <span className="text-xs">
                      <strong className="block">Criar nova tipificação</strong>
                      <span className="text-gray-500">
                        O documento propõe uma árvore do zero.
                      </span>
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-start gap-2 rounded-md border border-gray-200 p-2">
                    <input
                      type="radio"
                      name="modo-sugestao"
                      checked={modo === "enrich"}
                      disabled={enviando}
                      onChange={() => setModo("enrich")}
                    />
                    <span className="text-xs">
                      <strong className="block">
                        Enriquecer uma existente
                      </strong>
                      <span className="text-gray-500">
                        As sugestões entram sob uma tipificação escolhida.
                      </span>
                    </span>
                  </label>
                </div>
              ) : null}

              {modo === "enrich" ? (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="tipificacao-alvo" className="text-xs">
                    Tipificação alvo
                  </Label>
                  {tipificacaoId ? (
                    <p className="rounded-md border border-gray-200 bg-gray-50 p-2 text-xs">
                      {tipificacoes.find((t) => t.id === tipificacaoId)?.name ??
                        tipificacaoId}
                    </p>
                  ) : (
                    <select
                      id="tipificacao-alvo"
                      className="h-10 rounded-md border border-gray-300 bg-white px-2 text-sm"
                      disabled={enviando}
                      value={tipificacaoAlvo}
                      onChange={(evento) =>
                        setTipificacaoAlvo(evento.target.value)
                      }
                    >
                      <option value="">Selecione uma tipificação</option>
                      {tipificacoes.map((tipificacao) => (
                        <option key={tipificacao.id} value={tipificacao.id}>
                          {tipificacao.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ) : null}

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="arquivo-sugestao" className="text-xs">
                  Documento normativo (PDF)
                </Label>
                <Input
                  id="arquivo-sugestao"
                  ref={arquivoRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  disabled={enviando}
                  onChange={(evento) => {
                    setArquivo(evento.target.files?.[0] ?? null);
                    setErroEnvio("");
                  }}
                  className="text-xs file:mr-2 file:rounded-md file:border-0 file:bg-verde file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
                />
              </div>

              {erroEnvio ? (
                <p
                  role="alert"
                  className="rounded-md border border-vermelho/40 bg-vermelho/10 p-2 text-xs font-semibold text-vermelho"
                >
                  {erroEnvio}
                </p>
              ) : null}

              <Button
                onClick={() => void enviarDocumento()}
                disabled={enviando}
                className="w-full bg-verde text-white hover:bg-verde/90"
              >
                {enviando ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <FileUp />
                )}
                {enviando ? "Enviando..." : "Enviar e gerar sugestões"}
              </Button>
            </div>

            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold">Gerações anteriores</h3>
              <Button
                variant="outline"
                size="icon"
                aria-label="Atualizar gerações"
                disabled={carregandoSessoes}
                onClick={() => void carregarSessoes()}
              >
                <RefreshCw className={carregandoSessoes ? "animate-spin" : ""} />
              </Button>
            </div>

            <ScrollArea className="max-h-[45vh] flex-1 pr-2">
              <div className="flex flex-col gap-2">
                {carregandoSessoes ? (
                  <p className="text-xs text-gray-500">Carregando gerações...</p>
                ) : null}
                {!carregandoSessoes && erroSessoes ? (
                  <p className="text-xs font-semibold text-vermelho">
                    {erroSessoes}
                  </p>
                ) : null}
                {!carregandoSessoes && !erroSessoes && sessoes.length === 0 ? (
                  <p className="text-xs text-gray-500">
                    Nenhuma geração encontrada.
                  </p>
                ) : null}

                {sessoes.map((sessao) => (
                  <button
                    key={sessao.id}
                    type="button"
                    onClick={() => selecionarSessao(sessao.id)}
                    className={cn(
                      "flex w-full flex-col gap-1 rounded-md border p-2 text-left transition",
                      sessaoSelecionadaId === sessao.id
                        ? "border-verde bg-verde/5"
                        : "border-gray-200 bg-white hover:border-verde/60",
                    )}
                  >
                    <span
                      className="truncate text-sm font-semibold"
                      title={sessao.original_filename}
                    >
                      {sessao.original_filename}
                    </span>
                    <span className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase",
                          classesStatusSessao(sessao.status),
                        )}
                      >
                        {ROTULO_STATUS_SESSAO[sessao.status]}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {sessao.mode === "enrich"
                          ? "Enriquecimento"
                          : "Nova árvore"}
                      </span>
                    </span>
                    {sessao.mode === "enrich" ? (
                      <span className="truncate text-[11px] text-gray-500">
                        Alvo:{" "}
                        {sessao.target_typification_name ??
                          sessao.target_typification_id ??
                          "indisponível"}
                      </span>
                    ) : null}
                    <span className="text-[11px] text-gray-500">
                      {formatarData(sessao.created_at)}
                    </span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </aside>

          <main className="min-h-0 overflow-y-auto p-4">
            {!sessaoSelecionadaId ? (
              <EstadoVazio
                icone={<Sparkles />}
                titulo="Selecione ou crie uma geração"
                descricao="As sugestões aparecem aqui para revisão antes de modificar a árvore."
              />
            ) : carregandoDetalhe ? (
              <EstadoVazio
                icone={<Loader2 className="animate-spin" />}
                titulo="Carregando sugestões"
                descricao="Buscando o estado mais recente no servidor."
              />
            ) : erroDetalhe ? (
              <EstadoVazio
                icone={<AlertTriangle />}
                titulo="Não foi possível carregar esta geração"
                descricao={erroDetalhe}
                acao={() =>
                  sessaoSelecionadaId &&
                  void carregarDetalhe(sessaoSelecionadaId)
                }
              />
            ) : detalhe ? (
              <DetalheSessao
                detalhe={detalhe}
                filhosPorPai={filhosPorPai}
                itensPorId={itensPorId}
                itensRaiz={itensRaiz}
                mutacaoAtiva={mutacaoAtiva}
                pendentes={pendentes}
                aoConfirmar={(item) => void confirmar(item)}
                aoDescartar={(item) =>
                  setConfirmacaoDescarte({ tipo: "item", item })
                }
                aoDescartarTodos={() =>
                  setConfirmacaoDescarte({ tipo: "sessao" })
                }
                aoEditar={abrirEdicao}
              />
            ) : null}
          </main>
        </div>

        {itemEmEdicao ? (
          <Dialog open onOpenChange={(aberto) => !aberto && setItemEmEdicao(null)}>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  Revisar antes de aplicar
                </DialogTitle>
                <DialogDescription>
                  {ROTULO_TIPO_ITEM[itemEmEdicao.kind]} sugerida pelo
                  servidor. Ao confirmar, a alteração entra imediatamente na
                  árvore real.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="titulo-sugestao">Título</Label>
                  <Input
                    id="titulo-sugestao"
                    value={tituloEdicao}
                    onChange={(evento) => setTituloEdicao(evento.target.value)}
                  />
                </div>

                {itemEmEdicao.kind !== "typification" ? (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="descricao-sugestao">Descrição</Label>
                    <Textarea
                      id="descricao-sugestao"
                      className="min-h-28"
                      value={descricaoEdicao}
                      onChange={(evento) =>
                        setDescricaoEdicao(evento.target.value)
                      }
                    />
                  </div>
                ) : null}

                {erroEdicao ? (
                  <p role="alert" className="text-sm font-semibold text-vermelho">
                    {erroEdicao}
                  </p>
                ) : null}
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setItemEmEdicao(null)}
                  disabled={Boolean(mutacaoAtiva)}
                >
                  Cancelar
                </Button>
                <Button
                  className="bg-verde text-white hover:bg-verde/90"
                  disabled={Boolean(mutacaoAtiva)}
                  onClick={() =>
                    void confirmar(itemEmEdicao, {
                      title: tituloEdicao,
                      description: descricaoEdicao,
                    })
                  }
                >
                  {mutacaoAtiva?.tipo === "confirmar" ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Check />
                  )}
                  Confirmar e aplicar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : null}

        <AlertDialog
          open={Boolean(confirmacaoDescarte)}
          onOpenChange={(aberto) => !aberto && setConfirmacaoDescarte(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirmacaoDescarte?.tipo === "sessao"
                  ? "Descartar todas as pendentes?"
                  : "Descartar esta sugestão?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {confirmacaoDescarte?.tipo === "sessao"
                  ? "Todos os itens ainda pendentes serão descartados."
                  : `"${confirmacaoDescarte?.tipo === "item" ? confirmacaoDescarte.item.proposed_title : ""}" e possíveis descendentes pendentes poderão ser descartados.`}{" "}
                Itens já confirmados permanecem aplicados na árvore real.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={(evento) => {
                  evento.preventDefault();
                  void executarDescarte();
                }}
              >
                <Trash2 />
                Descartar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}

function EstadoVazio({
  icone,
  titulo,
  descricao,
  acao,
}: {
  icone: React.ReactNode;
  titulo: string;
  descricao: string;
  acao?: () => void;
}) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
      <span className="text-verde">{icone}</span>
      <h3 className="text-xl font-bold">{titulo}</h3>
      <p className="max-w-lg text-sm text-gray-500">{descricao}</p>
      {acao ? (
        <Button variant="outline" onClick={acao}>
          Tentar novamente
        </Button>
      ) : null}
    </div>
  );
}

function DetalheSessao({
  detalhe,
  filhosPorPai,
  itensPorId,
  itensRaiz,
  mutacaoAtiva,
  pendentes,
  aoConfirmar,
  aoDescartar,
  aoDescartarTodos,
  aoEditar,
}: {
  detalhe: SessaoSugestaoDetalhe;
  filhosPorPai: Map<string, ItemSugestao[]>;
  itensPorId: Map<string, ItemSugestao>;
  itensRaiz: ItemSugestao[];
  mutacaoAtiva: MutacaoAtiva;
  pendentes: number;
  aoConfirmar: (item: ItemSugestao) => void;
  aoDescartar: (item: ItemSugestao) => void;
  aoDescartarTodos: () => void;
  aoEditar: (item: ItemSugestao) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <header className="rounded-md border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="break-words text-xl font-bold">
              {detalhe.original_filename}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase",
                  classesStatusSessao(detalhe.status),
                )}
              >
                {ROTULO_STATUS_SESSAO[detalhe.status]}
              </span>
              <span>
                {detalhe.mode === "enrich" ? "Enriquecimento" : "Nova árvore"}
              </span>
              {detalhe.page_count != null ? (
                <span>{detalhe.page_count} página(s)</span>
              ) : null}
              {detalhe.generation_model ? (
                <span>Modelo {detalhe.generation_model}</span>
              ) : null}
            </div>
            {detalhe.mode === "enrich" ? (
              <p className="mt-2 text-sm text-gray-500">
                Alvo:{" "}
                <strong>
                  {detalhe.target_typification_name ??
                    detalhe.target_typification_id ??
                    "indisponível"}
                </strong>
              </p>
            ) : null}
          </div>

          {detalhe.status === "ready" && pendentes > 0 ? (
            <Button
              variant="outline"
              disabled={Boolean(mutacaoAtiva)}
              onClick={aoDescartarTodos}
              className="border-vermelho/50 text-vermelho hover:bg-vermelho/10"
            >
              <Trash2 />
              Descartar {pendentes} pendente(s)
            </Button>
          ) : null}
        </div>

        {detalhe.status === "processing" ? (
          <p className="mt-4 flex items-center gap-2 rounded-md border border-amber-500/40 bg-amber-50 p-3 text-sm">
            <Loader2 className="animate-spin" />
            O servidor está processando o documento. Você pode fechar esta janela
            e voltar depois.
          </p>
        ) : null}

        {detalhe.status === "failed" ? (
          <p
            role="alert"
            className="mt-4 rounded-md border border-vermelho/40 bg-vermelho/10 p-3 text-sm"
          >
            <strong>Falha na geração: </strong>
            {detalhe.error_message || "O servidor não informou o motivo."}
          </p>
        ) : null}

        {detalhe.status === "ready" && pendentes > 0 ? (
          <p className="mt-4 rounded-md border border-verde/30 bg-verde/5 p-3 text-sm">
            <strong>Atenção: </strong>
            cada confirmação modifica imediatamente a árvore real. Fechar ou
            abandonar a revisão não desfaz itens já confirmados.
          </p>
        ) : null}
      </header>

      {detalhe.status !== "processing" &&
      detalhe.status !== "failed" &&
      itensRaiz.length === 0 ? (
        <EstadoVazio
          icone={<FileText />}
          titulo="Nenhuma sugestão disponível"
          descricao="Esta sessão não possui itens de árvore para apresentar."
        />
      ) : null}

      {itensRaiz.length > 0 ? (
        <section className="flex flex-col gap-3" aria-label="Sugestões da árvore">
          {itensRaiz.map((item) => (
            <ItemSugestao
              key={item.id}
              item={item}
              filhosPorPai={filhosPorPai}
              itensPorId={itensPorId}
              mutacaoAtiva={mutacaoAtiva}
              nivel={0}
              aoConfirmar={aoConfirmar}
              aoDescartar={aoDescartar}
              aoEditar={aoEditar}
            />
          ))}
        </section>
      ) : null}

      {(detalhe.excluded_rules?.length ?? 0) > 0 ? (
        <details className="rounded-md border border-dashed border-gray-300 bg-white p-4">
          <summary className="cursor-pointer font-bold">
            Fora do escopo da árvore ({detalhe.excluded_rules?.length})
          </summary>
          <p className="mt-2 text-sm text-gray-500">
            Regras identificadas como formatação ou orientação textual. Elas não
            podem ser confirmadas como itens da árvore.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {detalhe.excluded_rules?.map((regra, indice) => (
              <article
                key={`${regra.title}-${indice}`}
                className="rounded-md border border-gray-200 bg-gray-50 p-3"
              >
                <h4 className="font-bold">{regra.title}</h4>
                <blockquote className="mt-2 border-l-2 border-verde pl-3 text-sm text-gray-600">
                  {regra.quote}
                </blockquote>
                {regra.pages?.length ? (
                  <p className="mt-2 text-xs font-semibold text-gray-500">
                    Página(s): {regra.pages.join(", ")}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}

function ItemSugestao({
  item,
  filhosPorPai,
  itensPorId,
  mutacaoAtiva,
  nivel,
  aoConfirmar,
  aoDescartar,
  aoEditar,
}: {
  item: ItemSugestao;
  filhosPorPai: Map<string, ItemSugestao[]>;
  itensPorId: Map<string, ItemSugestao>;
  mutacaoAtiva: MutacaoAtiva;
  nivel: number;
  aoConfirmar: (item: ItemSugestao) => void;
  aoDescartar: (item: ItemSugestao) => void;
  aoEditar: (item: ItemSugestao) => void;
}) {
  const Icone = ICONE_TIPO_ITEM[item.kind];
  const filhos = filhosPorPai.get(item.id) ?? [];
  const pai = item.parent_item_id ? itensPorId.get(item.parent_item_id) : null;
  const paiBloqueia = Boolean(pai && pai.status !== "confirmed");
  const processando = mutacaoAtiva?.itemId === item.id;
  const snapshot = Object.entries(item.target_snapshot ?? {}).filter(
    ([, valor]) => ["string", "number", "boolean"].includes(typeof valor),
  );

  return (
    <div className={nivel > 0 ? "ml-3 border-l-2 border-gray-200 pl-3" : ""}>
      <article
        className={cn(
          "rounded-md border bg-white p-4",
          item.status === "discarded" && "border-gray-200 opacity-60",
          item.status === "confirmed" && "border-green-600/40",
          item.status === "pending" && "border-gray-200",
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-md border border-gray-200 bg-gray-50 text-verde">
              <Icone />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-gray-300 bg-gray-50 px-2 py-0.5 text-[10px] font-bold uppercase">
                  {ROTULO_TIPO_ITEM[item.kind]}
                </span>
                <span className="rounded-full border border-gray-300 bg-gray-50 px-2 py-0.5 text-[10px] font-bold uppercase">
                  {item.operation === "create" ? "Criar" : "Atualizar"}
                </span>
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase",
                    classesStatusItem(item.status),
                  )}
                >
                  {ROTULO_STATUS_ITEM[item.status]}
                </span>
              </div>
              <h4 className="mt-2 break-words text-lg font-bold">
                {item.final_title || item.proposed_title}
              </h4>
              {item.parent_entity_title ? (
                <p className="mt-1 text-xs text-gray-500">
                  Sob item existente: {item.parent_entity_title}
                </p>
              ) : null}
            </div>
          </div>

          {item.status === "pending" ? (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={Boolean(mutacaoAtiva) || paiBloqueia}
                onClick={() => aoEditar(item)}
              >
                <Pencil />
                Editar
              </Button>
              <Button
                size="sm"
                disabled={Boolean(mutacaoAtiva) || paiBloqueia}
                onClick={() => aoConfirmar(item)}
                className="bg-verde text-white hover:bg-verde/90"
              >
                {processando && mutacaoAtiva?.tipo === "confirmar" ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Check />
                )}
                Confirmar e aplicar
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label={`Descartar ${item.proposed_title}`}
                disabled={Boolean(mutacaoAtiva)}
                onClick={() => aoDescartar(item)}
                className="border-vermelho/40 text-vermelho hover:bg-vermelho/10"
              >
                <Trash2 />
              </Button>
            </div>
          ) : null}
        </div>

        {paiBloqueia ? (
          <p className="mt-3 rounded-md border border-amber-500/40 bg-amber-50 p-2 text-xs font-semibold">
            Confirme o item pai antes de aplicar esta sugestão.
          </p>
        ) : null}

        {item.proposed_description ? (
          <div className="mt-3">
            <span className="text-xs font-bold uppercase text-gray-500">
              Descrição proposta
            </span>
            <p className="mt-1 text-sm text-gray-600">
              {item.final_description || item.proposed_description}
            </p>
          </div>
        ) : null}

        {item.rationale ? (
          <div className="mt-3">
            <span className="text-xs font-bold uppercase text-gray-500">
              Justificativa
            </span>
            <p className="mt-1 text-sm text-gray-600">{item.rationale}</p>
          </div>
        ) : null}

        {item.similarity_note || item.similar_to_id ? (
          <p className="mt-3 rounded-md border border-amber-500/40 bg-amber-50 p-2 text-xs">
            <strong>Possível correspondência: </strong>
            {item.similarity_note || item.similar_to_id}
          </p>
        ) : null}

        {snapshot.length ? (
          <details className="mt-3 rounded-md border border-gray-200 bg-gray-50 p-3 text-xs">
            <summary className="cursor-pointer font-bold">
              Valores atuais da entidade
            </summary>
            <dl className="mt-2 flex flex-col gap-2">
              {snapshot.map(([chave, valor]) => (
                <div key={chave} className="flex flex-col gap-0.5">
                  <dt className="font-semibold text-gray-500">{chave}</dt>
                  <dd className="break-words">{String(valor)}</dd>
                </div>
              ))}
            </dl>
          </details>
        ) : null}

        {(item.evidence?.length ?? 0) > 0 ? (
          <details className="mt-3 rounded-md border border-gray-200 bg-gray-50 p-3">
            <summary className="cursor-pointer text-xs font-bold">
              Evidências do PDF ({item.evidence?.length})
            </summary>
            <div className="mt-3 flex flex-col gap-3">
              {item.evidence?.map((evidencia, indice) => (
                <blockquote
                  key={`${item.id}-evidencia-${indice}`}
                  className="border-l-2 border-verde pl-3 text-sm"
                >
                  {evidencia.quote}
                  {evidencia.pages?.length ? (
                    <footer className="mt-1 text-xs font-semibold text-gray-500">
                      Página(s): {evidencia.pages.join(", ")}
                    </footer>
                  ) : null}
                </blockquote>
              ))}
            </div>
          </details>
        ) : null}

        {item.status === "confirmed" ? (
          <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-green-700">
            <Check />
            Aplicado na árvore
            {item.applied_entity_id ? ` (${item.applied_entity_id})` : ""}.
          </p>
        ) : null}

        {item.status === "discarded" ? (
          <p className="mt-3 text-xs font-semibold text-gray-500">
            Sugestão descartada; nenhuma reversão de itens já confirmados foi
            realizada.
          </p>
        ) : null}
      </article>

      {filhos.length > 0 ? (
        <div className="mt-3 flex flex-col gap-3">
          {filhos.map((filho) => (
            <ItemSugestao
              key={filho.id}
              item={filho}
              filhosPorPai={filhosPorPai}
              itensPorId={itensPorId}
              mutacaoAtiva={mutacaoAtiva}
              nivel={nivel + 1}
              aoConfirmar={aoConfirmar}
              aoDescartar={aoDescartar}
              aoEditar={aoEditar}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
