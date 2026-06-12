"use client";

import { Bot, Send, User, ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useEffect, useRef, useState } from "react";
import type { ChatDocumento } from "@/core/assistente/ChatDocumento";
import {
  adicionarMensagem,
  getDocumentoChatPorId,
  gerarRespostaMock,
} from "@/service/assistente/assistente";

interface Props {
  documentoId: string;
  onVoltar: () => void;
}

export default function ChatIA({ documentoId, onVoltar }: Props) {
  const [documento, setDocumento] = useState<ChatDocumento | undefined>();
  const [mensagem, setMensagem] = useState("");
  const [pensando, setPensando] = useState(false);
  const fimDaListaRef = useRef<HTMLDivElement>(null);

  function carregar() {
    const doc = getDocumentoChatPorId(documentoId);
    setDocumento(doc);
  }

  useEffect(() => {
    carregar();
  }, [documentoId]);

  useEffect(() => {
    fimDaListaRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [documento?.mensagens]);

  async function enviar() {
    if (!mensagem.trim() || !documento) return;

    const pergunta = mensagem.trim();
    setMensagem("");

    adicionarMensagem(documento.id, "user", pergunta);
    carregar();
    setPensando(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 1500),
    );

    const resposta = gerarRespostaMock(pergunta, documento);
    adicionarMensagem(documento.id, "assistant", resposta);
    carregar();
    setPensando(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  }

  if (!documento) return null;

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
            {documento.name}
          </h2>
          <p className="text-xs text-zinc-500 truncate">{documento.fileName}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-verde/10 rounded-lg flex-shrink-0">
            <Bot className="w-5 h-5 text-verde" />
          </div>
          <div className="bg-zinc-100 rounded-lg px-4 py-2.5 max-w-[85%]">
            <p className="text-sm text-zinc-700">
              Olá! Sou o OiacIA assistente do documento{" "}
              <strong>{documento.name}</strong>. Faça perguntas sobre o
              conteúdo, prazos, requisitos ou qualquer informação presente no
              documento.
            </p>
          </div>
        </div>

        {documento.mensagens.map((msg) => (
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
                {msg.content}
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

      <div className="border-t p-4 bg-white">
        <div className="flex gap-2">
          <Textarea
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua pergunta..."
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
          Pressione Enter para enviar, Shift+Enter para nova linha
        </p>
      </div>
    </div>
  );
}
