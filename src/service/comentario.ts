const urlBase = process.env.NEXT_PUBLIC_URL_BASE

// Tipos para Envio
export interface CreateMessagePayload {
    content: string
    mentions?: {
        id: string
        type: 'USER' | 'MESSAGE' | 'SOURCE' | 'TYPIFICATION' | 'TAXONOMY' | 'BRANCH'
        label?: string
    }[]
    quoted_message?: {
        id: string
    }
}

// Tipos para Recebimento/Listagem
export interface MessageAuthor {
    id: string
    name: string
    email: string
}

export interface DocumentMessage {
    id: string
    content: string
    created_at: string
    author: MessageAuthor
    mentions: any[]
    quoted_message: any | null
}

export interface MessageFilter {
    offset?: number
    limit?: number
    author_id?: string
    start_date?: string
    end_date?: string
    mention_id?: string
    mention_type?: 'USER' | 'MESSAGE' | 'SOURCE' | 'TYPIFICATION' | 'TAXONOMY' | 'BRANCH'
}

// --- Funções ---

async function enviarMensagemDocumentoService(docId: string, payload: CreateMessagePayload) {
    const url = `${urlBase}/doc/${docId}/message`

    try {
        const response = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            console.error(`Erro API (POST): ${response.status}`)
            return null
        }

        return await response.json()
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error)
        return null
    }
}

async function listarMensagensDocumentoService(docId: string, filtros?: MessageFilter): Promise<{ messages: DocumentMessage[] } | null> {
    // Construção da Query String
    const params = new URLSearchParams()

    if (filtros) {
        if (filtros.offset) params.append('offset', filtros.offset.toString())
        if (filtros.limit) params.append('limit', filtros.limit.toString())
        if (filtros.mention_id) params.append('mention_id', filtros.mention_id)
        if (filtros.mention_type) params.append('mention_type', filtros.mention_type)
        if (filtros.start_date && filtros.end_date) {
            params.append('start_date', filtros.start_date)
            params.append('end_date', filtros.end_date)
        }
    }

    const url = `${urlBase}/doc/${docId}/messages?${params.toString()}`

    try {
        const response = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        })

        if (!response.ok) {
            console.error(`Erro API (GET): ${response.status}`)
            return null
        }

        return await response.json()
    } catch (error) {
        console.error("Erro ao listar mensagens:", error)
        return null
    }
}

export {
    enviarMensagemDocumentoService,
    listarMensagensDocumentoService
}