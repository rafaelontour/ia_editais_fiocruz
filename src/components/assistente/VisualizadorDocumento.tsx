"use client";

import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { PdfDestino } from "@/service/assistente/assistente";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modoMarcador, setModoMarcador] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [numPaginas, setNumPaginas] = useState(0);
  const [escala, setEscala] = useState(0);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    if (!paginaAlvo) {
      setModoMarcador(false);
      return;
    }
    if (paginaAlvo.rects.length > 0) {
      setModoMarcador(true);
      setPaginaAtual(paginaAlvo.pagina);
    }
  }, [paginaAlvo]);

  useEffect(() => {
    if (!modoMarcador) return;

    let cancelado = false;
    let doc: pdfjsLib.PDFDocumentProxy | null = null;

    async function renderizar() {
      try {
        setErro(false);
        const tarefa = pdfjsLib.getDocument({
          url: fileDataUrl,
          withCredentials: true,
        });
        doc = await tarefa.promise;
        if (cancelado) return;

        const total = doc.numPages;
        setNumPaginas(total);
        const destino = Math.min(Math.max(paginaAtual, 1), total);
        const page = await doc.getPage(destino);
        if (cancelado) return;

        const base = page.getViewport({ scale: 1 });
        const larguraContainer =
          containerRef.current?.clientWidth ?? 800;
        const escalaCalculada = Math.max(
          0.3,
          Math.min(3, larguraContainer / base.width),
        );
        const viewport = page.getViewport({ scale: escalaCalculada });

        const canvas = canvasRef.current;
        if (!canvas || cancelado) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        await page.render({
          canvasContext: ctx,
          viewport,
          transform:
            dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined,
        }).promise;
        if (!cancelado) setEscala(escalaCalculada);
      } catch {
        if (!cancelado) setErro(true);
      }
    }

    renderizar();
    return () => {
      cancelado = true;
      doc?.destroy();
    };
  }, [modoMarcador, fileDataUrl, paginaAtual]);

  const srcComPagina =
    paginaAlvo && paginaAlvo.pagina > 0 && !modoMarcador
      ? `${fileDataUrl}#page=${paginaAlvo.pagina}`
      : fileDataUrl;

  return (
    <div className="flex flex-col h-full w-full">
      {modoMarcador && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 border-b">
          <span className="text-xs font-medium text-zinc-600 flex-1 truncate">
            Trecho destacado · {fileName}
          </span>
          <button
            type="button"
            onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
            disabled={paginaAtual <= 1}
            className="p-1 rounded hover:bg-zinc-200 text-zinc-600 disabled:opacity-30 cursor-pointer"
            title="Página anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-zinc-500 tabular-nums">
            Pág. {paginaAtual}
            {numPaginas ? ` de ${numPaginas}` : ""}
          </span>
          <button
            type="button"
            onClick={() =>
              setPaginaAtual((p) => Math.min(numPaginas || p + 1, p + 1))
            }
            disabled={numPaginas > 0 && paginaAtual >= numPaginas}
            className="p-1 rounded hover:bg-zinc-200 text-zinc-600 disabled:opacity-30 cursor-pointer"
            title="Próxima página"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setModoMarcador(false)}
            className="p-1 rounded hover:bg-zinc-200 text-zinc-600 cursor-pointer ml-1"
            title="Voltar ao documento completo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div ref={containerRef} className="flex-1 bg-zinc-200 overflow-auto">
        {modoMarcador ? (
          erro ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-zinc-500">
                Não foi possível carregar o PDF.
              </p>
            </div>
          ) : (
            <div className="flex justify-center p-4">
              <div className="relative shadow-md">
                <canvas ref={canvasRef} />
                {escala > 0 &&
                  paginaAlvo?.rects.map((r, i) => (
                    <div
                      key={i}
                      className="absolute bg-yellow-300/50 mix-blend-multiply rounded-[2px] pointer-events-none"
                      style={{
                        left: r.x1 * escala,
                        top: r.y1 * escala,
                        width: (r.x2 - r.x1) * escala,
                        height: (r.y2 - r.y1) * escala,
                      }}
                    />
                  ))}
              </div>
            </div>
          )
        ) : (
          <iframe
            key={srcComPagina}
            src={srcComPagina}
            className="w-full h-full"
            title={fileName}
          />
        )}
      </div>
    </div>
  );
}
