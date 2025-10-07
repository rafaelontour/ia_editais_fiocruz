import { Edital } from "@/core";

import { getEditalArquivoService } from "@/service/editalArquivo";
import { getEditalPorIdService } from "@/service/edital";
import { EditalArquivo } from "@/core/edital/Edital";
import useUsuario from "@/data/hooks/useUsuario";
import VisualizarEditalCliente from "./VisualizarEditalCliente";

export default async function VisualizarEdital({ params }: any) {
    const { id } = await params
    const urlBase = process.env.NEXT_PUBLIC_URL_BASE
    const editalArquivo: EditalArquivo = await getEditalArquivoService(id);
    const edital: Edital | undefined = await getEditalPorIdService(id);
    console.log("editalArquivo: ", editalArquivo);


    return <VisualizarEditalCliente edital={edital} editalArquivo={editalArquivo} urlBase={urlBase!} />
}

