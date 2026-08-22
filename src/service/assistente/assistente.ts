export interface ChatDocumentoMeta {
  id: string
  documentId: string
  name: string
  identifier: string
  fileName: string
  fileUrl: string
  created_at: string
}

export interface ChatCitation {
  chunk_id: string
  text_snippet?: string | null
  page?: number | null
  rects?: Array<{ x1: number; y1: number; x2: number; y2: number }> | null
}

export interface PdfDestino {
  /** Página em base humana (1 = primeira página) */
  pagina: number
  rects: Array<{ x1: number; y1: number; x2: number; y2: number }>
}

export interface ChatMensagem {
  id: string
  role: "user" | "assistant"
  content: string
  created_at: string
  references?: ChatCitation[]
}

const urlBase = process.env.NEXT_PUBLIC_URL_BASE

export async function getDocumentosChat(): Promise<ChatDocumentoMeta[]> {
  const res = await fetch(`${urlBase}/chat/conversations`, {
    credentials: "include",
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.map((c: any) => ({
    id: c.id,
    documentId: c.document_id,
    name: c.document_name,
    identifier: c.document_identifier ?? "",
    fileName: c.document_name,
    fileUrl: `${urlBase}${c.file_url}`,
    created_at: c.created_at,
  }))
}

export async function getMensagensChat(conversationId: string): Promise<ChatMensagem[]> {
  const res = await fetch(`${urlBase}/chat/conversations/${conversationId}/messages`, {
    credentials: "include",
  })
  if (!res.ok) return []
  return await res.json()
}

export async function excluirDocumentoChat(id: string): Promise<boolean> {
  const res = await fetch(`${urlBase}/chat/conversations/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  return res.ok
}

export async function criarDocumentoChat(data: {
  name: string
  identifier: string
  description: string
  grupo: string
  tipo_documento: string
  projeto_nome: string
  typification_ids: string[]
  editors_ids: string[]
  arquivo: File
}): Promise<{ conversationId: string; documentId: string; fileUrl: string; fileName: string }> {
  const res = await fetch(`${urlBase}/doc`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      name: data.name,
      identifier: data.identifier,
      description: data.description,
      grupo: data.grupo,
      tipo_documento: data.tipo_documento,
      projeto_nome: data.projeto_nome,
      typification_ids: data.typification_ids,
      editors_ids: data.editors_ids,
      source: 'assistant',
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.detail ?? "Erro ao criar documento")
  }
  const doc = await res.json()
  const docId = doc.id as string

  const formData = new FormData()
  formData.append("file", data.arquivo)

  const uploadRes = await fetch(`${urlBase}/doc/${docId}/release`, {
    method: "POST",
    credentials: "include",
    body: formData,
  })

  if (!uploadRes.ok) throw new Error("Erro ao fazer upload do arquivo")
  const release = await uploadRes.json()
  const filePath = release.file_path as string

  const convRes = await fetch(`${urlBase}/chat/conversations`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ document_id: docId }),
  })

  if (!convRes.ok) throw new Error("Erro ao criar conversa")
  const conv = await convRes.json()

  return {
    conversationId: conv.id as string,
    documentId: docId,
    fileUrl: `${urlBase}${filePath}`,
    fileName: data.arquivo.name,
  }
}

export async function enviarMensagemChat(
  conversationId: string,
  documentId: string,
  message: string,
  history: { role: string; content: string }[],
): Promise<string> {
  const res = await fetch(`${urlBase}/doc/${documentId}/assistant/chat`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ message, history, conversation_id: conversationId }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.detail ?? "Erro ao enviar mensagem")
  }

  const data = await res.json()
  return data.response as string
}

export async function getMensagensDocumentoService(documentId: string): Promise<ChatMensagem[]> {
  const res = await fetch(`${urlBase}/doc/${documentId}/messages`, {
    credentials: "include",
  })
  if (!res.ok) return []
  const data = await res.json()
  const msgs = data.messages ?? []

  const hasAiMention = msgs.some((m: any) =>
    m.mentions?.some((mention: any) => mention.type === "AI")
  )

  return msgs.reverse().map((m: any, idx: number) => {
    const isAi = hasAiMention
      ? m.mentions?.some((mention: any) => mention.type === "AI")
      : idx % 2 === 1
    return {
      id: m.id,
      role: isAi ? "assistant" : "user",
      content: m.content,
      created_at: m.created_at,
      references: m.references ?? [],
    }
  })
}

export async function enviarMensagemAiService(
  documentId: string,
  content: string,
): Promise<ChatMensagem | null> {
  const res = await fetch(`${urlBase}/doc/${documentId}/message/ai`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ content }),
  })

  if (!res.ok) return null

  const data = await res.json()
  const msg = data.message ?? data
  return {
    id: msg.id,
    role: "assistant",
    content: msg.content,
    created_at: msg.created_at,
    references: data.references ?? [],
  }
}
