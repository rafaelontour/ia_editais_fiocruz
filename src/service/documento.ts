import { DocumentoProjeto } from "@/core/projeto/Projeto";

const urlBase = process.env.NEXT_PUBLIC_URL_BASE;

export async function getDocumentosPorProjetoService(
  projectId: string,
): Promise<DocumentoProjeto[]> {
  try {
    const res = await fetch(
      `${urlBase}/project-document/by-project/${projectId}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (!res.ok) return [];

    const { documents } = await res.json();
    return documents;
  } catch {
    return [];
  }
}

export async function adicionarDocumentoService(
  projectId: string,
  payload: Partial<DocumentoProjeto>,
): Promise<[number, string]> {
  try {
    const res = await fetch(`${urlBase}/project-document`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_id: projectId,
        type: payload.type ?? "Documento",
        name: payload.name ?? "Sem nome",
        number: payload.number,
        status: payload.status ?? "PENDING",
        responsible: payload.responsible,
      }),
    });

    const json = await res.json();
    return [res.status, json.id];
  } catch {
    return [500, ""];
  }
}

export async function enviarArquivoDocumentoService(
  _documentId: string,
  _arquivo?: File | null,
): Promise<number> {
  return 201;
}

export async function marcarEnviadoAoKanban(
  documentId: string,
): Promise<number> {
  try {
    const res = await fetch(`${urlBase}/project-document`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: documentId, sent_to_kanban: true }),
    });

    return res.status;
  } catch {
    return 500;
  }
}

export async function desmarcarEnviadoAoKanban(
  documentId: string,
): Promise<number> {
  try {
    const res = await fetch(`${urlBase}/project-document`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: documentId, sent_to_kanban: false }),
    });

    return res.status;
  } catch {
    return 500;
  }
}

export async function excluirDocumentoService(
  documentId: string,
): Promise<number> {
  try {
    const res = await fetch(`${urlBase}/project-document/${documentId}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    return res.status;
  } catch {
    return 500;
  }
}
