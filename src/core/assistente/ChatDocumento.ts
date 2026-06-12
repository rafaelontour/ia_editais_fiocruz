export interface ChatMensagem {
  id: string
  role: "user" | "assistant"
  content: string
  created_at: string
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
