import VisualizarComentariosEditalCliente from "./VisualizarComentariosEditalCliente";

export default async function Comentarios({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // ✅ aguarda resolver a Promise

  const urlBase = process.env.NEXT_PUBLIC_URL_BASE;

  return <VisualizarComentariosEditalCliente idEdital={id} urlBase={urlBase} />;
}
