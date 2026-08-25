"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import type { PdfDestino } from "@/service/assistente/assistente";

interface Props {
  fileDataUrl: string;
  fileName: string;
  paginaAlvo?: (PdfDestino & { ts: number }) | null;
}

export default function VisualizadorDocumento({
  fileDataUrl,
  fileName,
  paginaAlvo,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const prontoRef = useRef(false);
  const pendenteRef = useRef<PdfDestino | null>(null);
  // Alvos de página criados ANTES da montagem são resquícios de
  // sessões anteriores do chat e devem ser ignorados.
  const montadoEmRef = useRef(Date.now());

  // Viewer oficial do pdf.js servido localmente (public/pdfjs):
  // cópia de texto, busca (Ctrl+F), scroll e zoom nativos.
  const viewerSrc = useMemo(
    () =>
      `/pdfjs/web/viewer.html?file=${encodeURIComponent(fileDataUrl)}`,
    [fileDataUrl],
  );

  const enviarAlvo = useCallback((alvo: PdfDestino) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage(
      {
        type: "oiac-highlight",
        page: alvo.pagina,
        highlights: [{ page: alvo.pagina, rects: alvo.rects ?? [] }],
      },
      "*",
    );
  }, []);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.source !== iframeRef.current?.contentWindow) return;
      const data = event.data as { type?: string } | null;
      if (data?.type === "oiac-viewer-ready") {
        prontoRef.current = true;
        if (pendenteRef.current) {
          enviarAlvo(pendenteRef.current);
          pendenteRef.current = null;
        }
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [enviarAlvo]);

  useEffect(() => {
    prontoRef.current = false;
    pendenteRef.current = null;
  }, [fileDataUrl]);

  useEffect(() => {
    if (!paginaAlvo) return;
    if (paginaAlvo.ts <= montadoEmRef.current) return;
    const alvo: PdfDestino = {
      pagina: paginaAlvo.pagina,
      rects: paginaAlvo.rects,
    };
    if (prontoRef.current) {
      enviarAlvo(alvo);
    } else {
      pendenteRef.current = alvo;
    }
  }, [paginaAlvo, enviarAlvo]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 bg-zinc-200 overflow-hidden">
        <iframe
          ref={iframeRef}
          src={viewerSrc}
          className="w-full h-full border-0"
          title={fileName}
        />
      </div>
    </div>
  );
}
