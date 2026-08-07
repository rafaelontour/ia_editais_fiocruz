import { Projeto } from "@/core/projeto/Projeto";

const urlBase = process.env.NEXT_PUBLIC_URL_BASE;

export async function getProjetosService(): Promise<Projeto[]> {
  try {
    const res = await fetch(`${urlBase}/project`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return [];

    const { projects } = await res.json();
    return projects;
  } catch {
    return [];
  }
}

export async function adicionarProjetoService(
  name: string,
  description?: string,
  document_group_id?: string,
  document_group_name?: string,
): Promise<[number, string]> {
  try {
    const res = await fetch(`${urlBase}/project`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, document_group_id }),
    });

    const json = await res.json();
    return [res.status, json.id];
  } catch {
    return [500, ""];
  }
}

export async function atualizarProjetoService(
  id: string,
  name: string,
  document_group_id?: string,
  status?: string,
): Promise<number> {
  try {
    const body: Record<string, unknown> = { id, name };
    if (document_group_id) body.document_group_id = document_group_id;
    if (status) body.status = status;

    const res = await fetch(`${urlBase}/project`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return res.status;
  } catch {
    return 500;
  }
}

export async function excluirProjetoService(id: string): Promise<number> {
  try {
    const res = await fetch(`${urlBase}/project/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    return res.status;
  } catch {
    return 500;
  }
}
