import { Projeto } from "@/core/projeto/Projeto";

const KEY = "ia_projetos_v1";

function _load(): Projeto[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Projeto[];
  } catch (e) {
    return [];
  }
}

function _save(list: Projeto[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export async function getProjetosService(): Promise<Projeto[]> {
  return _load();
}

export async function adicionarProjetoService(
  name: string,
  description?: string,
  document_group_id?: string,
  document_group_name?: string,
): Promise<[number, string]> {
  const list = _load();
  const novo: Projeto = {
    id: String(Date.now()),
    name,
    description,
    status: "INICIADO",
    document_group_id,
    document_group_name,
    created_at: new Date().toISOString(),
  };
  list.unshift(novo);
  _save(list);
  return [201, novo.id];
}

export async function atualizarProjetoService(
  id: string,
  name: string,
  description?: string,
  document_group_id?: string,
  document_group_name?: string,
  status?: string,
): Promise<number> {
  const list = _load();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return 404;
  list[idx] = {
    ...list[idx],
    name,
    description,
    document_group_id,
    document_group_name,
    status: (status as any) ?? list[idx].status,
  };
  _save(list);
  return 200;
}

export async function excluirProjetoService(id: string): Promise<number> {
  const list = _load();
  const novo = list.filter((p) => p.id !== id);
  _save(novo);
  return 204;
}
