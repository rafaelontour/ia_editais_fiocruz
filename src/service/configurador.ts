import { DocumentGroup, DocumentGroupItem } from "@/core/configurador/GrupoDocumento";

const urlBase = process.env.NEXT_PUBLIC_URL_BASE;

export async function getDocumentGroupsService(): Promise<DocumentGroup[] | undefined> {
  try {
    const res = await fetch(`${urlBase}/document-group`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return;

    const { groups } = await res.json();
    return groups;
  } catch {
    return;
  }
}

export async function getDocumentGroupByIdService(
  groupId: string,
): Promise<DocumentGroup | null> {
  try {
    const res = await fetch(`${urlBase}/document-group/${groupId}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}

export async function adicionarGrupoDocumentoService(
  name: string,
): Promise<[number, string]> {
  try {
    const res = await fetch(`${urlBase}/document-group`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const json = await res.json();
    return [res.status, json.id];
  } catch {
    return [500, ""];
  }
}

export async function atualizarGrupoDocumentoService(
  id: string,
  name: string,
): Promise<number> {
  try {
    const res = await fetch(`${urlBase}/document-group`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name }),
    });

    return res.status;
  } catch {
    return 500;
  }
}

export async function excluirGrupoDocumentoService(id: string): Promise<number> {
  try {
    const res = await fetch(`${urlBase}/document-group/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    return res.status;
  } catch {
    return 500;
  }
}

export async function getDocumentGroupItemsService(
  groupId: string,
): Promise<DocumentGroupItem[]> {
  try {
    const res = await fetch(`${urlBase}/document-group/${groupId}/items`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return [];

    return await res.json();
  } catch {
    return [];
  }
}

export async function getAllDocumentGroupItemsService(): Promise<
  DocumentGroupItem[]
> {
  try {
    const groups = await getDocumentGroupsService();
    if (!groups) return [];

    const all = await Promise.all(
      groups.map((g) => getDocumentGroupItemsService(g.id)),
    );
    return all.flat();
  } catch {
    return [];
  }
}

export async function adicionarDocumentoConfiguravelService(
  groupId: string,
  name: string,
  icon_path?: string,
): Promise<[number, string]> {
  try {
    const res = await fetch(`${urlBase}/document-group/${groupId}/item`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, icon_path }),
    });

    const json = await res.json();
    return [res.status, json.id];
  } catch {
    return [500, ""];
  }
}

export async function atualizarDocumentoConfiguravelService(
  itemId: string,
  name: string,
  icon_path?: string,
): Promise<number> {
  try {
    const res = await fetch(`${urlBase}/document-group/item`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: itemId, name, icon_path }),
    });

    return res.status;
  } catch {
    return 500;
  }
}

export async function excluirDocumentoConfiguravelService(
  itemId: string,
): Promise<number> {
  try {
    const res = await fetch(`${urlBase}/document-group/item/${itemId}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    return res.status;
  } catch {
    return 500;
  }
}
