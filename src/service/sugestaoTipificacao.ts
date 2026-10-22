import type {
  EdicaoConfirmacaoSugestao,
  ItemSugestao,
  RespostaSessoesSugestao,
  SessaoSugestao,
  SessaoSugestaoDetalhe,
} from "@/core/sugestaoTipificacao";

const urlBase: string | undefined = process.env.NEXT_PUBLIC_URL_BASE;

async function extrairDetalhe(
  response: Response,
  mensagemPadrao: string,
): Promise<string> {
  try {
    const corpo = await response.json();
    if (typeof corpo?.detail === "string") {
      return corpo.detail;
    }
  } catch {
    // resposta sem corpo JSON
  }
  return mensagemPadrao;
}

async function criarSessaoSugestaoService(
  arquivo: File,
  tipificacaoId?: string,
  documento?: {
    groupId?: string;
    groupItemId?: string;
  },
): Promise<SessaoSugestaoDetalhe> {
  const dados = new FormData();
  dados.append("file", arquivo);
  if (tipificacaoId) {
    dados.append("typification_id", tipificacaoId);
  }
  if (documento?.groupId) {
    dados.append("document_group_id", documento.groupId);
  }
  if (documento?.groupItemId) {
    dados.append("document_group_item_id", documento.groupItemId);
  }

  const response = await fetch(`${urlBase}/tree-suggestion`, {
    method: "POST",
    credentials: "include",
    body: dados,
  });

  if (!response.ok) {
    throw new Error(
      await extrairDetalhe(
        response,
        "Não foi possível iniciar a geração da tipificação.",
      ),
    );
  }

  return (await response.json()) as SessaoSugestaoDetalhe;
}

async function listarSessoesSugestaoService(): Promise<SessaoSugestao[]> {
  const response = await fetch(`${urlBase}/tree-suggestion?limit=100`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      await extrairDetalhe(
        response,
        "Erro ao buscar as gerações por documento.",
      ),
    );
  }

  const json = (await response.json()) as RespostaSessoesSugestao;
  return json.sessions ?? [];
}

async function obterSessaoSugestaoService(
  sessionId: string,
): Promise<SessaoSugestaoDetalhe> {
  const response = await fetch(
    `${urlBase}/tree-suggestion/${encodeURIComponent(sessionId)}`,
    {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (!response.ok) {
    throw new Error(
      await extrairDetalhe(
        response,
        "Erro ao buscar os detalhes da geração.",
      ),
    );
  }

  return (await response.json()) as SessaoSugestaoDetalhe;
}

async function confirmarItemSugestaoService(
  sessionId: string,
  itemId: string,
  edicao?: EdicaoConfirmacaoSugestao,
): Promise<ItemSugestao> {
  const response = await fetch(
    `${urlBase}/tree-suggestion/${encodeURIComponent(sessionId)}/items/${encodeURIComponent(itemId)}/confirm`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(edicao ?? {}),
    },
  );

  if (!response.ok) {
    throw new Error(
      await extrairDetalhe(
        response,
        "Erro ao confirmar e aplicar a sugestão.",
      ),
    );
  }

  return (await response.json()) as ItemSugestao;
}

async function descartarItemSugestaoService(
  sessionId: string,
  itemId: string,
): Promise<SessaoSugestaoDetalhe> {
  const response = await fetch(
    `${urlBase}/tree-suggestion/${encodeURIComponent(sessionId)}/items/${encodeURIComponent(itemId)}/discard`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (!response.ok) {
    throw new Error(
      await extrairDetalhe(response, "Erro ao descartar a sugestão."),
    );
  }

  return (await response.json()) as SessaoSugestaoDetalhe;
}

async function descartarPendentesSessaoService(
  sessionId: string,
): Promise<SessaoSugestaoDetalhe> {
  const response = await fetch(
    `${urlBase}/tree-suggestion/${encodeURIComponent(sessionId)}/discard`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (!response.ok) {
    throw new Error(
      await extrairDetalhe(
        response,
        "Erro ao descartar as sugestões pendentes.",
      ),
    );
  }

  return (await response.json()) as SessaoSugestaoDetalhe;
}

export {
  criarSessaoSugestaoService,
  listarSessoesSugestaoService,
  obterSessaoSugestaoService,
  confirmarItemSugestaoService,
  descartarItemSugestaoService,
  descartarPendentesSessaoService,
};
