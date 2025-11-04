import { useParams } from "next/navigation";
import VisualizarComentariosEditalCliente from "./VisualizarComentariosEditalCliente";

export default function Comentarios({ params }: { params: { id: string } }) {

    const urlBase = process.env.NEXT_PUBLIC_URL_BASE;
    const { id } = params;

    return (
        <VisualizarComentariosEditalCliente idEdital={id} urlBase={urlBase} />
    );
}