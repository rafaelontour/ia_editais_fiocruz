export interface ChatCitation {
  chunk_id: string
  text_snippet?: string | null
  page?: number | null
  rects?: Array<{ x1: number; y1: number; x2: number; y2: number }> | null
}

export interface ChatMensagem {
  id: string
  role: "user" | "assistant"
  content: string
  created_at: string
  references?: ChatCitation[]
}

export interface ChatDocumento {
  id: string
  name: string
  identifier: string
  description: string
  tipificacoes: string[]
  tipificacoesNomes: string[]
  grupoDocumentoId: string
  grupoDocumentoNome: string
  tipoDocumentoId: string
  tipoDocumentoNome: string
  fileDataUrl: string
  fileName: string
  created_at: string
  mensagens: ChatMensagem[]
  responsavel_id?: string
  responsavel_nome?: string
}
