import { DocumentGroup, DocumentGroupItem } from "@/core/configurador/GrupoDocumento";

const GROUPS_KEY = "ia_document_groups_v1";
const ITEMS_KEY = "ia_document_group_items_v1";

function loadGroups(): DocumentGroup[] {
  try {
    const raw = localStorage.getItem(GROUPS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as DocumentGroup[];
  } catch (error) {
    return [];
  }
}

function saveGroups(groups: DocumentGroup[]) {
  localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
}

function loadItems(): DocumentGroupItem[] {
  try {
    const raw = localStorage.getItem(ITEMS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as DocumentGroupItem[];
  } catch (error) {
    return [];
  }
}

function saveItems(items: DocumentGroupItem[]) {
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
}

export async function getDocumentGroupsService(): Promise<DocumentGroup[]> {
  return loadGroups();
}

export async function getDocumentGroupByIdService(
  groupId: string,
): Promise<DocumentGroup | null> {
  const groups = loadGroups();
  return groups.find((group) => group.id === groupId) ?? null;
}

export async function adicionarGrupoDocumentoService(
  name: string,
): Promise<[number, string]> {
  const groups = loadGroups();
  const novo: DocumentGroup = {
    id: String(Date.now()),
    name,
    created_at: new Date().toISOString(),
  };
  groups.unshift(novo);
  saveGroups(groups);
  return [201, novo.id];
}

export async function atualizarGrupoDocumentoService(
  id: string,
  name: string,
): Promise<number> {
  const groups = loadGroups();
  const index = groups.findIndex((group) => group.id === id);
  if (index === -1) return 404;
  groups[index] = { ...groups[index], name };
  saveGroups(groups);
  return 200;
}

export async function excluirGrupoDocumentoService(id: string): Promise<number> {
  const groups = loadGroups();
  const nextGroups = groups.filter((group) => group.id !== id);
  saveGroups(nextGroups);

  const items = loadItems();
  const remainingItems = items.filter((item) => item.group_id !== id);
  saveItems(remainingItems);

  return 204;
}

export async function getDocumentGroupItemsService(
  groupId: string,
): Promise<DocumentGroupItem[]> {
  const items = loadItems();
  return items.filter((item) => item.group_id === groupId);
}

export async function adicionarDocumentoConfiguravelService(
  groupId: string,
  name: string,
): Promise<[number, string]> {
  const items = loadItems();
  const novo: DocumentGroupItem = {
    id: String(Date.now()),
    group_id: groupId,
    name,
    created_at: new Date().toISOString(),
  };
  items.unshift(novo);
  saveItems(items);
  return [201, novo.id];
}

export async function atualizarDocumentoConfiguravelService(
  itemId: string,
  name: string,
): Promise<number> {
  const items = loadItems();
  const index = items.findIndex((item) => item.id === itemId);
  if (index === -1) return 404;
  items[index] = { ...items[index], name };
  saveItems(items);
  return 200;
}

export async function excluirDocumentoConfiguravelService(
  itemId: string,
): Promise<number> {
  const items = loadItems();
  const nextItems = items.filter((item) => item.id !== itemId);
  saveItems(nextItems);
  return 204;
}
