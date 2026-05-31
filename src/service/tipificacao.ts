import { Fonte, Tipificacao } from "@/core";

const urlBase = process.env.NEXT_PUBLIC_URL_BASE;
const TYPIFICATION_GROUPS_KEY = "ia_typification_groups_v1";

type TipificacaoGroupMock = {
  id: string;
  document_group_id?: string;
  document_group_name?: string;
  document_group_item_id?: string;
  document_group_item_name?: string;
};

function loadTipificacaoGroupMocks(): TipificacaoGroupMock[] {
  try {
    const raw = localStorage.getItem(TYPIFICATION_GROUPS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as TipificacaoGroupMock[];
  } catch (error) {
    return [];
  }
}

function saveTipificacaoGroupMocks(mocks: TipificacaoGroupMock[]) {
  localStorage.setItem(TYPIFICATION_GROUPS_KEY, JSON.stringify(mocks));
}

function mergeTipificacaoGroupMock(tipificacao: Tipificacao): Tipificacao {
  const mocks = loadTipificacaoGroupMocks();
  const mock = mocks.find((item) => item.id === tipificacao.id);
  if (!mock) return tipificacao;

  return {
    ...tipificacao,
    document_group_id: tipificacao.document_group_id ?? mock.document_group_id,
    document_group_name:
      tipificacao.document_group_name ?? mock.document_group_name,
    document_group_item_id:
      tipificacao.document_group_item_id ?? mock.document_group_item_id,
    document_group_item_name:
      tipificacao.document_group_item_name ?? mock.document_group_item_name,
  };
}

function addTipificacaoGroupMock(
  tipificacao: Tipificacao,
  document_group_id?: string,
  document_group_name?: string,
  document_group_item_id?: string,
  document_group_item_name?: string,
) {
  if (!tipificacao?.id) return;
  const mocks = loadTipificacaoGroupMocks();
  const existingIndex = mocks.findIndex((item) => item.id === tipificacao.id);
  const nextMock: TipificacaoGroupMock = {
    id: tipificacao.id,
    document_group_id,
    document_group_name,
    document_group_item_id,
    document_group_item_name,
  };
  if (existingIndex === -1) {
    mocks.push(nextMock);
  } else {
    mocks[existingIndex] = nextMock;
  }
  saveTipificacaoGroupMocks(mocks);
}

function removeTipificacaoGroupMock(id: string) {
  const mocks = loadTipificacaoGroupMocks();
  saveTipificacaoGroupMocks(mocks.filter((item) => item.id !== id));
}

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
    const tipifications: Tipificacao[] = json.typifications ?? [];
    return tipifications.map(mergeTipificacaoGroupMock);
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

    const json = await response.json();
    return json ? mergeTipificacaoGroupMock(json) : null;
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

    const tipificacao = await dados.json();
    if (tipificacao) {
      const merged = mergeTipificacaoGroupMock({
        ...tipificacao,
        document_group_id,
        document_group_name,
        document_group_item_id,
        document_group_item_name,
      });
      addTipificacaoGroupMock(
        merged,
        document_group_id,
        document_group_name,
        document_group_item_id,
        document_group_item_name,
      );
      return merged;
    }

    return null;
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

    if (dados.status === 204) {
      removeTipificacaoGroupMock(id);
    }

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
      body: JSON.stringify(tipificacao),
    });

    if (dados.status === 200 && tipificacao.id) {
      addTipificacaoGroupMock(
        tipificacao,
        tipificacao.document_group_id,
        tipificacao.document_group_name,
        tipificacao.document_group_item_id,
        tipificacao.document_group_item_name,
      );
    }

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
