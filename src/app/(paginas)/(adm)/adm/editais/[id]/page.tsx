import { cookies } from "next/headers";

import { remark } from "remark";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

import type { EditalArquivo, Edital } from "@/core/edital/Edital";
import VisualizarEditalCliente from "./VisualizarEditalCliente";

const SECOES = [
  { titulo: "Pontos atendidos", regex: /^(?:#+\s*|\*+\s*)?pontos atendidos\b/i },
  { titulo: "Pontos a aprimorar", regex: /^(?:#+\s*|\*+\s*)?pontos a aprimorar\b/i },
  { titulo: "Orientação final", regex: /^(?:#+\s*|\*+\s*)?orientação final\b/i },
];

function normalizarSecoesMarkdown(texto: string): string {
  return texto
    .split("\n")
    .map((linha) => {
      const t = linha.trim();
      if (!t || /^#+\s/.test(t)) return linha;
      for (const secao of SECOES) {
        const m = secao.regex.exec(t);
        if (!m) continue;
        const resto = t.slice(m[0].trim().length).replace(/^\s*[:.\-–—]*\s*/, "");
        return resto ? `# ${secao.titulo}\n\n${resto}` : `# ${secao.titulo}`;
      }
      return linha;
    })
    .join("\n");
}

export default async function VisualizarEdital({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const urlBase = process.env.NEXT_PUBLIC_URL_BASE;
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const authHeaders: Record<string, string> = {
    "Content-type": "application/json",
  };
  if (token) {
    authHeaders["Cookie"] = `access_token=${token}`;
  }

  const [editalArquivo, edital] = await Promise.all([
    fetch(`${urlBase}/doc/${id}/release`, {
      headers: authHeaders,
      cache: "no-store",
    }).then((r) => (r.ok ? r.json() : undefined)) as Promise<EditalArquivo | undefined>,
    fetch(`${urlBase}/doc/${id}`, {
      headers: authHeaders,
      cache: "no-store",
    }).then((r) => (r.ok ? r.json() : undefined)) as Promise<Edital | undefined>,
  ]);

  const resumoIA = await remark()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(normalizarSecoesMarkdown(editalArquivo?.releases?.[0]?.description || ""));

  const resumosIA: Record<string, string> = {};
  for (const release of editalArquivo?.releases ?? []) {
    const html = await remark()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeSanitize)
      .use(rehypeStringify)
      .process(normalizarSecoesMarkdown(release.description || ""));
    resumosIA[release.id] = String(html);
  }

  return (
    <VisualizarEditalCliente
      edital={edital}
      editalArquivo={editalArquivo}
      urlBase={urlBase!}
      resumoIA={String(resumoIA)}
      resumosIA={resumosIA}
    />
  );
}
