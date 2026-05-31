import { DocumentoProjeto } from "@/core/projeto/Projeto";

const KEY = "ia_documentos_v1";

function _load(): DocumentoProjeto[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as DocumentoProjeto[];
  } catch (e) {
    return [];
  }
}

function _save(list: DocumentoProjeto[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export async function getDocumentosPorProjetoService(
  projectId: string,
): Promise<DocumentoProjeto[]> {
  const all = _load();
  return all.filter((d) => d.project_id === projectId);
}

export async function adicionarDocumentoService(
  projectId: string,
  payload: Partial<DocumentoProjeto>,
): Promise<[number, string]> {
  const list = _load();
  const novo: DocumentoProjeto = {
    id: String(Date.now()),
    project_id: projectId,
    type: payload.type ?? "Documento",
    name: payload.name ?? "Sem nome",
    number: payload.number,
    status: payload.status ?? "PENDING",
    responsible: payload.responsible,
    responsible_name: payload.responsible_name,
    responsible_icon: payload.responsible_icon,
    created_at: new Date().toISOString(),
    sent_to_kanban: false,
  };
  list.unshift(novo);
  _save(list);
  return [201, novo.id];
}

export async function enviarArquivoDocumentoService(
  documentId: string,
  arquivo?: File | null,
): Promise<number> {
  try {
    const filesRaw = localStorage.getItem("ia_documentos_files_v1") ?? "{}";
    const files = JSON.parse(filesRaw) as Record<
      string,
      { name: string; size: number; type?: string }
    >;
    if (arquivo) {
      files[documentId] = {
        name: arquivo.name,
        size: arquivo.size,
        type: arquivo.type,
      };
      localStorage.setItem("ia_documentos_files_v1", JSON.stringify(files));
      return 201;
    }
    return 400;
  } catch (e) {
    return 500;
  }
}

export async function marcarEnviadoAoKanban(
  documentId: string,
): Promise<number> {
  const list = _load();
  const idx = list.findIndex((d) => d.id === documentId);
  if (idx === -1) return 404;
  list[idx].sent_to_kanban = true;
  _save(list);
  return 200;
}

export async function excluirDocumentoService(
  documentId: string,
): Promise<number> {
  const list = _load();
  const nextList = list.filter((d) => d.id !== documentId);
  if (nextList.length === list.length) return 404;
  _save(nextList);
  return 204;
}
