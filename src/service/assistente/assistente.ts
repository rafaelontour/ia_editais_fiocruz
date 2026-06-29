export interface ChatDocumentoMeta {
  id: string
  name: string
  fileName: string
  fileUrl: string
  created_at: string
}

export interface ChatMensagem {
  id: string
  role: "user" | "assistant"
  content: string
  created_at: string
}

const STORAGE_KEY = "ia_chat_documentos_v1"
const MESSAGES_KEY = "ia_chat_mensagens_v1"
const urlBase = process.env.NEXT_PUBLIC_URL_BASE

function loadMetas(): ChatDocumentoMeta[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ChatDocumentoMeta[]
  } catch {
    return []
  }
}

function saveMetas(docs: ChatDocumentoMeta[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs))
}

function loadMensagens(documentoId: string): ChatMensagem[] {
  try {
    const raw = localStorage.getItem(`${MESSAGES_KEY}_${documentoId}`)
    if (!raw) return []
    return JSON.parse(raw) as ChatMensagem[]
  } catch {
    return []
  }
}

function saveMensagens(documentoId: string, msgs: ChatMensagem[]) {
  localStorage.setItem(`${MESSAGES_KEY}_${documentoId}`, JSON.stringify(msgs))
}

export function getDocumentosChat(): ChatDocumentoMeta[] {
  return loadMetas()
}

export function getDocumentoChatPorId(id: string): ChatDocumentoMeta | undefined {
  return loadMetas().find((d) => d.id === id)
}

export function getMensagensChat(documentoId: string): ChatMensagem[] {
  return loadMensagens(documentoId)
}

export function excluirDocumentoChat(id: string): boolean {
  const docs = loadMetas()
  const index = docs.findIndex((d) => d.id === id)
  if (index === -1) return false
  docs.splice(index, 1)
  saveMetas(docs)
  localStorage.removeItem(`${MESSAGES_KEY}_${id}`)
  return true
}

export function adicionarMensagemLocal(documentoId: string, role: "user" | "assistant", content: string): ChatMensagem {
  const msgs = loadMensagens(documentoId)
  const msg: ChatMensagem = {
    id: crypto.randomUUID(),
    role,
    content,
    created_at: new Date().toISOString(),
  }
  msgs.push(msg)
  saveMensagens(documentoId, msgs)
  return msg
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
}): Promise<{ id: string; fileUrl: string; fileName: string }> {
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
    }),
  })

  if (!res.ok) throw new Error("Erro ao criar documento")
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

  const meta: ChatDocumentoMeta = {
    id: docId,
    name: data.name,
    fileName: data.arquivo.name,
    fileUrl: `${urlBase}${filePath}`,
    created_at: new Date().toISOString(),
  }

  const docs = loadMetas()
  docs.unshift(meta)
  saveMetas(docs)

  return { id: meta.id, fileUrl: meta.fileUrl, fileName: meta.fileName }
}

export async function enviarMensagemChat(
  documentoId: string,
  message: string,
  history: { role: string; content: string }[],
): Promise<string> {
  const res = await fetch(`${urlBase}/doc/${documentoId}/assistant/chat`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ message, history }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.detail ?? "Erro ao enviar mensagem")
  }

  const data = await res.json()
  return data.response as string
}
