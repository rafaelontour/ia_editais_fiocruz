import { Edital } from "@/core";

import { remark } from "remark";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

import { getEditalArquivoService } from "@/service/editalArquivo";
import { getEditalPorIdService } from "@/service/edital";
import { EditalArquivo } from "@/core/edital/Edital";
import VisualizarEditalCliente from "./VisualizarEditalCliente";

export default async function VisualizarEdital({ params }: any) {
    const { id } = await params
    const urlBase = process.env.NEXT_PUBLIC_URL_BASE
    const editalArquivo: EditalArquivo = await getEditalArquivoService(id);
    const edital: Edital | undefined = await getEditalPorIdService(id);
    const resumoIA = await remark()
        .use(remarkParse) // parse Markdown
        .use(remarkRehype) // converte Markdown -> HTML AST
        .use(rehypeSanitize) // sanitiza tags e atributos
        .use(rehypeStringify) // gera string HTML
        .process(editalArquivo?.releases[0].description || "");


    return <VisualizarEditalCliente edital={edital} editalArquivo={editalArquivo} urlBase={urlBase!} resumoIA={resumoIA.toString()} />
}