"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  InfoIcon,
  Loader2,
  MessageSquare,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Masonry from "react-masonry-css";
import Div from "@/components/Div";
import Calendario from "@/components/Calendario";
import FormularioUpload from "@/components/assistente/FormularioUpload";
import VisualizadorDocumento from "@/components/assistente/VisualizadorDocumento";
import ChatIA from "@/components/assistente/ChatIA";
import AnaliseDetalhadaAssistente from "@/components/assistente/AnaliseDetalhadaAssistente";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ChatDocumentoMeta } from "@/service/assistente/assistente";
import {
  getDocumentosChat,
  excluirDocumentoChat,
} from "@/service/assistente/assistente";
import { toast } from "sonner";

type PaginaState =
  | { tipo: "lista" }
  | { tipo: "formulario" }
  | {
      tipo: "chat";
      doc: { conversationId: string; documentId: string; fileDataUrl: string; fileName: string };
    };

export default function AssistentePage() {
  const [state, setState] = useState<PaginaState>({ tipo: "lista" });
  const [conversas, setConversas] = useState<ChatDocumentoMeta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [showAnalise, setShowAnalise] = useState(false);

  async function carregarConversas() {
    setCarregando(true);
    const docs = await getDocumentosChat();
    setConversas(docs);
    setCarregando(false);
  }

  useEffect(() => {
    carregarConversas();
  }, []);

  useEffect(() => {
    if (state.tipo === "lista") {
      setShowAnalise(false);
      carregarConversas();
    }
  }, [state.tipo]);

  async function handleExcluir(id: string) {
    const ok = await excluirDocumentoChat(id);
    if (ok) {
      toast.success("Conversa excluída");
      carregarConversas();
    } else {
      toast.error("Erro ao excluir conversa");
    }
  }

  const breakpointColumns = {
    default: 3,
    1500: 3,
    1000: 2,
    700: 1,
  };

  if (state.tipo === "chat") {
    return (
      <ResizablePanelGroup
        direction="horizontal"
        className="flex h-[calc(100vh-7rem)] gap-0 -mt-5"
      >
        <ResizablePanel minSize={30} defaultSize={showAnalise ? 35 : 50}>
          <VisualizadorDocumento
            fileDataUrl={state.doc.fileDataUrl}
            fileName={state.doc.fileName}
          />
        </ResizablePanel>

        <div className="flex flex-col mt-2 items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon color="green" size={15} />
            </TooltipTrigger>
            <TooltipContent className="italic">
              Clique sobre a linha abaixo, segure e puxe para os lados para
              alterar a vizualização
            </TooltipContent>
          </Tooltip>

          <ResizableHandle className="w-px h-full" />
        </div>

        <ResizablePanel minSize={25} defaultSize={showAnalise ? 30 : 50}>
          <ChatIA
            conversationId={state.doc.conversationId}
            documentId={state.doc.documentId}
            onVoltar={() => setState({ tipo: "lista" })}
            onAbrirAnalise={() => setShowAnalise(true)}
          />
        </ResizablePanel>

        {showAnalise && (
          <>
            <ResizableHandle className="w-px h-full" />
            <ResizablePanel minSize={25} defaultSize={35}>
              <AnaliseDetalhadaAssistente
                documentId={state.doc.documentId}
                onFechar={() => setShowAnalise(false)}
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    );
  }

  if (state.tipo === "formulario") {
    return (
      <FormularioUpload
        onDocumentoCriado={(doc) => {
          setState({ tipo: "chat", doc });
        }}
        onCancelar={() => setState({ tipo: "lista" })}
      />
    );
  }

  return (
    <div className="flex flex-col h-full gap-5 px-7.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-verde/10 rounded-lg">
            <Bot className="w-6 h-6 text-verde" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-800">OiacIA</h1>
            <p className="text-sm text-zinc-500">Conversas com assistente IA</p>
          </div>
        </div>

        <Button
          className="flex items-center gap-2 bg-vermelho text-white cursor-pointer"
          onClick={() => setState({ tipo: "formulario" })}
        >
          <Plus size={18} />
          Nova conversa
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-1 ">
        {carregando ? (
          <div className="flex justify-center items-center gap-2 h-full">
            <p className="animate-pulse">Carregando conversas...</p>
            <Loader2 className="animate-spin" />
          </div>
        ) : conversas.length === 0 ? (
          <Div>
            <p className="text-gray-500 text-center py-8">
              Nenhuma conversa iniciada ainda. Clique em "Nova conversa" para
              começar.
            </p>
          </Div>
        ) : (
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex gap-4"
            columnClassName="flex flex-col gap-4"
          >
            {conversas.map((conv) => {
              return (
                <Div key={conv.id}>
                  <h3 className="text-lg font-semibold truncate">
                    {conv.name}
                  </h3>

                  <p className="text-xs text-zinc-400 truncate mt-1">
                    {conv.identifier || conv.fileName}
                  </p>

                

                  <div className="flex justify-between items-center mt-3">
                    <Calendario data={conv.created_at} />

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="icon"
                        className="h-8 w-8 bg-verde hover:bg-verde/90 cursor-pointer rounded-sm text-white"
                        title="Abrir conversa"
                        onClick={() =>
                          setState({
                            tipo: "chat",
                            doc: {
                              conversationId: conv.id,
                              documentId: conv.documentId,
                              fileDataUrl: conv.fileUrl,
                              fileName: conv.fileName,
                            },
                          })
                        }
                      >
                        <Bot size={16} />
                      </Button>

                      <Button
                        type="button"
                        size="icon"
                        className="h-8 w-8 bg-vermelho hover:bg-vermelho/90 cursor-pointer rounded-sm text-white"
                        title="Excluir conversa"
                        onClick={() => handleExcluir(conv.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </Div>
              );
            })}
          </Masonry>
        )}
      </div>
    </div>
  );
}
