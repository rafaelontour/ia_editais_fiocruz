import { cookies } from "next/headers";

import { remark } from "remark";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

import type { EditalArquivo, Edital } from "@/core/edital/Edital";
import VisualizarEditalCliente from "./VisualizarEditalCliente";

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
    .process(editalArquivo?.releases?.[0]?.description || "");

  return (
    <VisualizarEditalCliente
      edital={edital}
      editalArquivo={editalArquivo}
      urlBase={urlBase!}
      resumoIA={String(resumoIA)}
    />
  );
}
