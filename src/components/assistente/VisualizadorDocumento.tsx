"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Loader2 } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export interface DestaquePdf {
  page: number;
  rects: { x1: number; y1: number; x2: number; y2: number }[];
}

interface Props {
  fileDataUrl: string;
  fileName: string;
  destaque?: DestaquePdf | null;
}

const PRE_RENDER_MARGIN = "900px 0px";
const PLACEHOLDER_HEIGHT = 1100;
const MAX_PAGE_WIDTH = 1000;

export default function VisualizadorDocumento({
  fileDataUrl,
  fileName,
  destaque,
}: Props) {
  const [numPages, setNumPages] = useState(0);
  const [containerWidth, setContainerWidth] = useState(800);
  const [renderedPages, setRenderedPages] = useState<Set<number>>(new Set());
  const [pageDims, setPageDims] = useState<Map<number, { w: number; h: number }>>(
    new Map()
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const wrapRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());
  const pendingScrollRef = useRef<number | null>(null);

  useEffect(() => {
    setNumPages(0);
    setRenderedPages(new Set());
    setPageDims(new Map());
    wrapRefs.current.clear();
  }, [fileDataUrl]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () =>
      setContainerWidth(Math.max(320, Math.min(el.clientWidth - 24, MAX_PAGE_WIDTH)));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!numPages || !scrollRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const p = Number((e.target as HTMLElement).dataset.page);
          if (!p) continue;
          setRenderedPages((prev) => {
            if (prev.has(p)) return prev;
            const next = new Set(prev);
            next.add(p);
            return next;
          });
        }
      },
      { root: scrollRef.current, rootMargin: PRE_RENDER_MARGIN }
    );
    scrollRef.current
      .querySelectorAll("[data-page]")
      .forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [numPages]);

  const tryScrollTo = useCallback((page: number) => {
    const el = wrapRefs.current.get(page);
    if (el && el.dataset.rendered === "true") {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      pendingScrollRef.current = null;
    }
  }, []);

  useEffect(() => {
    const target = destaque?.page ?? 0;
    if (!target || target < 1 || target > numPages) return;
    setRenderedPages((prev) => {
      if (prev.has(target)) return prev;
      const next = new Set(prev);
      next.add(target);
      return next;
    });
    pendingScrollRef.current = target;
    requestAnimationFrame(() => tryScrollTo(target));
  }, [destaque, numPages, tryScrollTo]);

  function handlePageLoadSuccess(pageNumber: number, proxy: unknown) {
    const vp = (
      proxy as { getViewport: (o: { scale: number }) => { width: number; height: number } }
    ).getViewport({ scale: 1 });
    setPageDims((prev) => {
      const next = new Map(prev);
      next.set(pageNumber, { w: vp.width, h: vp.height });
      return next;
    });
    const el = wrapRefs.current.get(pageNumber);
    if (el) el.dataset.rendered = "true";
    setTimeout(() => {
      if (pendingScrollRef.current === pageNumber)
        tryScrollTo(pageNumber);
    }, 60);
  }

  function boxesFor(page: number) {
    if (!destaque || destaque.page !== page) return [];
    const dims = pageDims.get(page);
    if (!dims || !containerWidth) return [];
    const scale = containerWidth / dims.w;
    return destaque.rects.map((r, i) => ({
      key: i,
      left: r.x1 * scale,
      top: (dims.h - r.y2) * scale,
      width: Math.max(2, (r.x2 - r.x1) * scale),
      height: Math.max(2, (r.y2 - r.y1) * scale),
    }));
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div ref={scrollRef} className="flex-1 overflow-auto bg-zinc-200">
        {!numPages && (
          <div className="flex justify-center items-center h-full gap-2 text-zinc-500">
            <Loader2 className="animate-spin w-5 h-5" />
            <span className="text-sm">Carregando documento...</span>
          </div>
        )}
        <Document
          file={fileDataUrl}
          onLoadSuccess={({ numPages: n }) => setNumPages(n)}
          className="py-4 flex flex-col items-center gap-4"
          loading={null}
        >
          {Array.from({ length: numPages }, (_, i) => {
            const pageNumber = i + 1;
            const isVisible = renderedPages.has(pageNumber);
            const boxes = boxesFor(pageNumber);
            return (
              <div
                key={pageNumber}
                data-page={pageNumber}
                ref={(el) => {
                  wrapRefs.current.set(pageNumber, el);
                }}
                className="relative shadow-md"
                style={{
                  width: containerWidth,
                  minHeight: isVisible ? undefined : PLACEHOLDER_HEIGHT,
                  backgroundColor: "#fff",
                }}
              >
                {isVisible ? (
                  <>
                    <Page
                      pageNumber={pageNumber}
                      width={containerWidth}
                      onLoadSuccess={(proxy) =>
                        handlePageLoadSuccess(pageNumber, proxy)
                      }
                      loading={
                        <div
                          className="flex items-center justify-center text-zinc-400"
                          style={{ width: containerWidth, height: 600 }}
                        >
                          <Loader2 className="animate-spin w-5 h-5" />
                        </div>
                      }
                    />
                    {boxes.length > 0 &&
                      boxes.map((b) => (
                        <div
                          key={`hl-${b.key}`}
                          className="pointer-events-none absolute rounded-sm bg-amber-300/40 border border-amber-500/70"
                          style={{
                            left: b.left,
                            top: b.top,
                            width: b.width,
                            height: b.height,
                          }}
                        />
                      ))}
                  </>
                ) : (
                  <div
                    className="w-full flex items-end justify-center text-xs text-zinc-300 pb-2"
                    style={{ height: PLACEHOLDER_HEIGHT }}
                  >
                    página {pageNumber}
                  </div>
                )}
              </div>
            );
          })}
        </Document>
      </div>
    </div>
  );
}
