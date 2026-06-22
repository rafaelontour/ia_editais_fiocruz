import { Fonte, Tipificacao } from "@/core";

const urlBase = process.env.NEXT_PUBLIC_URL_BASE;

async function getTipificacoesService(): Promise<Tipificacao[] | undefined> {
  const url = `${urlBase}/typification`;

  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return;
    }

    const json = await response.json();
    return json.typifications ?? [];
  } catch (e) {
    return;
  }
}

async function getTipificacaoPorIdService(
  id: string | undefined,
): Promise<Tipificacao | null> {
  const url = `${urlBase}/typification/${id}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    return null;
  }
}

async function adicionarTipificacaoService(
  nome: string,
  fontesSelecionadas: Fonte[],
  document_group_id?: string,
  document_group_name?: string,
  document_group_item_id?: string,
  document_group_item_name?: string,
): Promise<Tipificacao | null> {
  const url = `${urlBase}/typification`;

  try {
    const listaIds = fontesSelecionadas.map((fonte) => fonte.id);
    const dados = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: nome,
        source_ids: listaIds,
        document_group_id,
        document_group_name,
        document_group_item_id,
        document_group_item_name,
      }),
    });

    if (dados.status !== 201) {
      return null;
    }

    return await dados.json();
  } catch (error) {
    return null;
  }
}

async function excluirTipificacaoService(
  id: string,
): Promise<number | undefined> {
  const url = `${urlBase}/typification/${id}`;

  try {
    const dados = await fetch(url, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });

    return dados.status;
  } catch (error) {
    throw new Error("Erro ao excluir tipificacao no arquivo ts: " + error);
  }
}

async function atualizarTipificacaoService(
  tipificacao: Tipificacao,
): Promise<number | undefined> {
  const url = `${urlBase}/typification`;

  try {
    const dados = await fetch(url, {
      method: "PUT",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: tipificacao.id,
        name: tipificacao.name,
        source_ids: tipificacao.source_ids ?? tipificacao.sources?.map((s) => s.id),
        document_group_id: tipificacao.document_group_id,
        document_group_item_id: tipificacao.document_group_item_id,
      }),
    });

    return dados.status;
  } catch (error) {
    throw new Error("Erro ao atualizar tipificacao no arquivo ts: " + error);
  }
}

export {
  getTipificacoesService,
  getTipificacaoPorIdService,
  adicionarTipificacaoService,
  atualizarTipificacaoService,
  excluirTipificacaoService,
};
