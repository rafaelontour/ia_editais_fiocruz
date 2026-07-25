"use client";

import { Bot, Send, User, ChevronLeft, FileSearch } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useEffect, useRef, useState } from "react";
import {
  getMensagensDocumentoService,
  enviarMensagemAiService,
} from "@/service/assistente/assistente";
import type { ChatMensagem } from "@/service/assistente/assistente";
import { getContextItemsService } from "@/service/assistente/contextItems";
import type { ContextItem } from "@/service/assistente/contextItems";

interface Props {
  conversationId: string;
  documentId: string;
  onVoltar: () => void;
  onAbrirAnalise: () => void;
}

export default function ChatIA({ conversationId, documentId, onVoltar, onAbrirAnalise }: Props) {
  const [mensagens, setMensagens] = useState<ChatMensagem[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [pensando, setPensando] = useState(false);
  const [contextItems, setContextItems] = useState<ContextItem[]>([]);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionIndex, setMentionIndex] = useState(0);
  const fimDaListaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mentionMapRef = useRef<Map<string, string>>(new Map());

  const contextMapRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    getMensagensDocumentoService(documentId).then(setMensagens);
  }, [documentId]);

  useEffect(() => {
    getContextItemsService(documentId).then((items) => {
      setContextItems(items);
      const map = new Map<string, string>();
      for (const item of items) {
        const name = item.label.split(" > ").pop() ?? item.id;
        map.set(item.id, name);
      }
      contextMapRef.current = map;
    });
  }, [documentId]);

  useEffect(() => {
    fimDaListaRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  async function enviar() {
    if (!mensagem.trim()) return;

    let pergunta = mensagem.trim();
    mentionMapRef.current.forEach((uuid, name) => {
      pergunta = pergunta.replaceAll(`<branch:${name}>`, `<branch:${uuid}>`);
    });
    setMensagem("");
    setPensando(true);

    setMensagens((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: pergunta,
        created_at: new Date().toISOString(),
      },
    ]);

    try {
      const ai = await enviarMensagemAiService(documentId, pergunta);

      setMensagens((prev) => [
        ...prev,
        {
          id: ai?.id ?? crypto.randomUUID(),
          role: "assistant",
          content: ai?.content ?? "Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.",
          created_at: ai?.created_at ?? new Date().toISOString(),
        },
      ]);
    } catch {
      setMensagens((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.",
          created_at: new Date().toISOString(),
        },
      ]);
    }

    setPensando(false);
  }

  function handleChange(value: string) {
    setMensagem(value);

    const pos = textareaRef.current?.selectionStart ?? value.length;
    const beforeCursor = value.slice(0, pos);
    const atIndex = beforeCursor.lastIndexOf("@");

    if (atIndex !== -1 && beforeCursor.slice(atIndex).length <= 50) {
      const query = beforeCursor.slice(atIndex + 1);
      const hasSpace = /\s/.test(query);
      if (!hasSpace && contextItems.length > 0) {
        setMentionQuery(query.toLowerCase());
        setShowMentions(true);
        setMentionIndex(0);
        return;
      }
    }
    setShowMentions(false);
  }

  function insertMention(item: ContextItem) {
    const pos = textareaRef.current?.selectionStart ?? mensagem.length;
    const beforeCursor = mensagem.slice(0, pos);
    const atIndex = beforeCursor.lastIndexOf("@");
    if (atIndex === -1) return;

    const before = mensagem.slice(0, atIndex);
    const after = mensagem.slice(pos);
    const name = item.label.split(" > ").pop() ?? item.id;
    mentionMapRef.current.set(name, item.id);
    const tag = `<branch:${name}>`;
    const nova = `${before}${tag} ${after}`;
    setMensagem(nova);
    setShowMentions(false);
    setTimeout(() => {
      textareaRef.current?.focus();
      const newPos = before.length + tag.length + 1;
      textareaRef.current?.setSelectionRange(newPos, newPos);
    }, 0);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (showMentions) {
      const filtered = contextItems.filter((i) =>
        i.label.toLowerCase().includes(mentionQuery)
      );
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setMentionIndex((prev) => Math.min(prev + 1, filtered.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setMentionIndex((prev) => Math.max(prev - 1, 0));
        return;
      }
      if ((e.key === "Enter" || e.key === "Tab") && filtered.length > 0) {
        e.preventDefault();
        insertMention(filtered[mentionIndex]);
        return;
      }
      if (e.key === "Escape") {
        setShowMentions(false);
        return;
      }
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  }

  const filteredMentions = showMentions
    ? contextItems.filter((i) =>
        i.label.toLowerCase().includes(mentionQuery)
      )
    : [];

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 border w-full">
        <Button
          variant="ghost"
          size="icon"
          onClick={onVoltar}
          className="cursor-pointer shrink-0"
          title="Voltar"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-zinc-800 truncate">
            Assistente IA
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAbrirAnalise}
          className="cursor-pointer shrink-0 flex items-center gap-1.5 text-xs text-zinc-600 hover:text-verde"
          title="Ver análise detalhada"
        >
          <FileSearch className="w-4 h-4" />
          Análise
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-verde/10 rounded-lg flex-shrink-0">
            <Bot className="w-5 h-5 text-verde" />
          </div>
          <div className="bg-zinc-100 rounded-lg px-4 py-2.5 max-w-[85%]">
            <p className="text-sm text-zinc-700">
              Olá! Sou o OiacIA assistente. Faça perguntas sobre o
              conteúdo, prazos, requisitos ou qualquer informação presente no
              documento.
            </p>
          </div>
        </div>

        {mensagens.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`p-2 rounded-lg flex-shrink-0 ${
                msg.role === "user" ? "bg-blue-100" : "bg-verde/10"
              }`}
            >
              {msg.role === "user" ? (
                <User className="w-5 h-5 text-blue-600" />
              ) : (
                <Bot className="w-5 h-5 text-verde" />
              )}
            </div>
            <div
              className={`rounded-lg px-4 py-2.5 max-w-[85%] ${
                msg.role === "user" ? "bg-blue-50" : "bg-zinc-100"
              }`}
            >
              <p className="text-sm text-zinc-700 whitespace-pre-wrap">
                {msg.content.replace(/<branch:([^>]+)>/g, (_, id) => {
                  const name = contextMapRef.current.get(id)
                  return name ? `@${name}` : ""
                })}
              </p>
            </div>
          </div>
        ))}

        {pensando && (
          <div className="flex items-start gap-3">
            <div className="p-2 bg-verde/10 rounded-lg flex-shrink-0">
              <Bot className="w-5 h-5 text-verde" />
            </div>
            <div className="bg-zinc-100 rounded-lg px-4 py-2.5">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" />
                <span
                  className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <span
                  className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={fimDaListaRef} />
      </div>

      <div className="border-t p-4 bg-white relative">
        {showMentions && filteredMentions.length > 0 && (
          <div className="absolute bottom-full left-4 right-4 mb-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
            {filteredMentions.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  insertMention(item);
                }}
                onMouseEnter={() => setMentionIndex(idx)}
                className={`w-full text-left px-3 py-2 text-sm cursor-pointer ${
                  idx === mentionIndex ? "bg-verde/10 text-verde" : "hover:bg-zinc-50"
                }`}
              >
                <span className="font-medium text-xs text-zinc-500">{item.type}</span>
                <span className="ml-1 text-zinc-800">{item.label}</span>
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={mensagem}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Digite sua pergunta... Use @ para mencionar uma tipificação, taxonomia ou ramo'
            className="resize-none min-h-[44px] max-h-[120px]"
            rows={1}
          />
          <Button
            onClick={enviar}
            disabled={!mensagem.trim() || pensando}
            size="icon"
            className="bg-verde hover:bg-verde/90 cursor-pointer flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Enter para enviar · Shift+Enter para nova linha · @ para mencionar itens do documento
        </p>
      </div>
    </div>
  );
}
