import type { ChatDocumento, ChatMensagem } from "@/core/assistente/ChatDocumento"

const STORAGE_KEY = "ia_chat_documentos_v1"

function load(): ChatDocumento[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ChatDocumento[]
  } catch {
    return []
  }
}

function save(docs: ChatDocumento[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs))
}

export function getDocumentosChat(): ChatDocumento[] {
  return load()
}

export function getDocumentoChatPorId(id: string): ChatDocumento | undefined {
  return load().find((d) => d.id === id)
}

export function criarDocumentoChat(doc: Omit<ChatDocumento, "id" | "created_at" | "mensagens">): ChatDocumento {
  const docs = load()
  const novo: ChatDocumento = {
    ...doc,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    mensagens: [],
  }
  docs.unshift(novo)
  save(docs)
  return novo
}

export function excluirDocumentoChat(id: string): boolean {
  const docs = load()
  const index = docs.findIndex((d) => d.id === id)
  if (index === -1) return false
  docs.splice(index, 1)
  save(docs)
  return true
}

export function adicionarMensagem(documentoId: string, role: "user" | "assistant", content: string): ChatMensagem {
  const docs = load()
  const doc = docs.find((d) => d.id === documentoId)
  if (!doc) throw new Error("Documento não encontrado")

  const msg: ChatMensagem = {
    id: crypto.randomUUID(),
    role,
    content,
    created_at: new Date().toISOString(),
  }
  doc.mensagens.push(msg)
  save(docs)
  return msg
}

const RESPOSTAS_MOCK: { padrao: RegExp; resposta: string }[] = [
  {
    padrao: /(oi|olá|bom dia|boa tarde|boa noite)/i,
    resposta: "Olá! Como posso ajudar você com este documento? Estou aqui para tirar dúvidas sobre o conteúdo, prazos, requisitos e qualquer informação presente nele.",
  },
  {
    padrao: /(prazo|data|quando|vencimento)/i,
    resposta: "Analisando o documento, identifico que os prazos e datas estão especificados ao longo do texto. Recomendo verificar na seção de cronograma ou calendário de eventos. Se precisar de mais detalhes sobre uma data específica, me pergunte!",
  },
  {
    padrao: /(valor|preço|custo|orçamento|orçament[oa])/i,
    resposta: "Com base na análise do documento, os valores e informações orçamentárias estão descritos nas seções financeiras. Posso destacar os principais montantes e ajudar a entender a distribuição dos recursos se você tiver uma pergunta mais específica.",
  },
  {
    padrao: /(resumo|sumário|resumir|sumarizar|sobre o que)/i,
    resposta: "Este documento trata de uma contratação no âmbito da administração pública. Ele descreve o objeto, as especificações técnicas, prazos, obrigações das partes e critérios de avaliação. Em resumo, é um instrumento que formaliza os termos e condições para a aquisição ou contratação de bens/serviços conforme a legislação vigente.",
  },
  {
    padrao: /(requisito|exigência|obrigação|deve|necessário)/i,
    resposta: "Os requisitos e exigências estão detalhados no documento. Geralmente incluem: documentação necessária, qualificação técnica, capacidade financeira, prazos de entrega e condições de participação. Recomendo consultar a seção de 'Condições de Participação' ou 'Requisitos' para verificar os critérios específicos aplicáveis.",
  },
  {
    padrao: /(anexo|arquivo|documento|pdf)/i,
    resposta: "O documento principal contém as informações gerais da contratação. Para acessar anexos específicos, como planilhas orçamentárias, minutas de contrato ou formulários, verifique no final do documento onde costumam estar listados todos os anexos com suas respectivas descrições.",
  },
  {
    padrao: /(lei|legislação|norma|jurídico|legal)/i,
    resposta: "Com base na minha análise, este documento está fundamentado na legislação aplicável, incluindo a Lei nº 8.666/1993 (ou Lei nº 14.133/2021, dependendo do regime), Lei Complementar nº 123/2006 e demais normativas pertinentes. As fontes citadas como referência legal estão listadas nas tipificações associadas a este documento.",
  },
]

export function gerarRespostaMock(pergunta: string, documento: ChatDocumento): string {
  const perguntaLower = pergunta.toLowerCase()

  for (const item of RESPOSTAS_MOCK) {
    if (item.padrao.test(perguntaLower)) {
      return item.resposta
    }
  }

  const respostasGenericas = [
    `Ótima pergunta! Analisando o documento "${documento.name}", posso dizer que as informações relacionadas a esse tópico estão distribuídas ao longo do texto. Recomendo uma leitura atenta das seções principais para obter todos os detalhes. Se puder ser mais específico, posso ajudar com mais precisão.`,
    `Baseado no documento "${documento.name}", identifiquei que este assunto é abordado em diferentes partes. Para uma resposta mais precisa, você poderia me perguntar sobre aspectos específicos como prazos, valores, requisitos ou condições?`,
    `Entendi sua pergunta sobre "${documento.name}". O documento contém diversas informações relevantes sobre este tema. Sugiro verificar a descrição e as seções principais do documento. Se tiver uma dúvida mais específica, ficarei feliz em ajudar!`,
    `Analisando o conteúdo do documento "${documento.name}", posso confirmar que este tópico é relevante para o entendimento do instrumento como um todo. As informações detalhadas estão disponíveis no texto completo. Que aspecto específico você gostaria de explorar?`,
  ]

  return respostasGenericas[Math.floor(Math.random() * respostasGenericas.length)]
}
