/* Ponte OiacIA: recebe postMessage do app pai e desenha destaques
   amarelos sobre as páginas do visualizador oficial do pdf.js. */
(function () {
  "use strict";

  let pendingHighlights = [];
  let debounceTimer = null;

  function clearOverlays(pageEl) {
    if (!pageEl) return;
    pageEl.querySelectorAll(".oiac-highlight").forEach((el) => el.remove());
  }

  function clearAll() {
    const app = window.PDFViewerApplication;
    if (!app || !app.pdfViewer) return;
    for (let i = 0; i < app.pagesCount; i++) {
      const view = app.pdfViewer.getPageView(i);
      if (view && view.div) clearOverlays(view.div);
    }
  }

  async function drawForPage(pageNumber) {
    const app = window.PDFViewerApplication;
    if (!app || !app.pdfViewer || !app.pdfDocument) return;
    const pageIndex = pageNumber - 1;
    const view = app.pdfViewer.getPageView(pageIndex);
    const pageEl = view && view.div;
    if (!pageEl || !pageEl.clientWidth) return;

    clearOverlays(pageEl);
    const items = pendingHighlights.filter(
      (h) => h.page === pageNumber && Array.isArray(h.rects)
    );
    if (!items.length) return;

    try {
      const pdfPage = await app.pdfDocument.getPage(pageNumber);
      const widthPts = pdfPage.view[2];
      if (!widthPts) return;
      const scale = pageEl.clientWidth / widthPts;

      for (const item of items) {
        for (const r of item.rects) {
          if (
            typeof r.x1 !== "number" ||
            typeof r.y1 !== "number" ||
            typeof r.x2 !== "number" ||
            typeof r.y2 !== "number"
          ) {
            continue;
          }
          const div = document.createElement("div");
          div.className = "oiac-highlight";
          Object.assign(div.style, {
            position: "absolute",
            left: `${r.x1 * scale}px`,
            top: `${r.y1 * scale}px`,
            width: `${(r.x2 - r.x1) * scale}px`,
            height: `${(r.y2 - r.y1) * scale}px`,
            background: "rgba(253, 224, 71, 0.55)",
            mixBlendMode: "multiply",
            borderRadius: "2px",
            pointerEvents: "none",
            zIndex: 30,
          });
          pageEl.appendChild(div);
        }
      }
    } catch (err) {
      console.warn("[oiac-bridge] falha ao desenhar destaque", err);
    }
  }

  function scheduleRedrawAll() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const app = window.PDFViewerApplication;
      if (!app || !app.pdfViewer) return;
      for (let i = 0; i < app.pagesCount; i++) {
        drawForPage(i + 1);
      }
    }, 200);
  }

  function init() {
    const app = window.PDFViewerApplication;
    if (!app) return;

    app.initializedPromise.then(() => {
      const bus = app.eventBus;
      if (bus) {
        bus.on("pagerendered", (evt) => drawForPage(evt.pageNumber));
        bus.on("scalechanging", scheduleRedrawAll);
        bus.on("rotationchanging", scheduleRedrawAll);
        bus.on("pagesinit", scheduleRedrawAll);
      }

      window.addEventListener("message", (event) => {
        const data = event.data;
        if (!data || typeof data !== "object") return;

        if (data.type === "oiac-highlight") {
          pendingHighlights = Array.isArray(data.highlights)
            ? data.highlights
            : [];
          scheduleRedrawAll();
          if (typeof data.page === "number" && data.page > 0) {
            app.page = data.page;
          }
        } else if (data.type === "oiac-goto") {
          if (typeof data.page === "number" && data.page > 0) {
            app.page = data.page;
          }
        } else if (data.type === "oiac-clear") {
          pendingHighlights = [];
          clearAll();
        }
      });

      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: "oiac-viewer-ready" }, "*");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
