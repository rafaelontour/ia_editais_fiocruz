const urlBase = process.env.NEXT_PUBLIC_URL_BASE

export interface ContextItem {
  id: string
  label: string
  type: string
  typification_name: string
  taxonomy_title: string
  branch_title: string
}

export async function getContextItemsService(documentId: string): Promise<ContextItem[]> {
  try {
    const res = await fetch(`${urlBase}/doc/${documentId}/context-items`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-type": "application/json" },
    })
    if (!res.ok) return []
    const json = await res.json()
    return json.items ?? []
  } catch {
    return []
  }
}
