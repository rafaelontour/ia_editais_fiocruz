import { Fonte, Tipificacao } from "@/core";

const urlBase = process.env.NEXT_PUBLIC_URL_BASE

async function getTipificacoesService(): Promise<Tipificacao[]> {
    const url = `${urlBase}/typification/`;

    try {
        const response = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar tipificações");
        }
        const json = await response.json();
        return json.typifications;
    } catch (error) {
        throw new Error("Erro ao buscar tipificações: " + (error instanceof Error ? error.message : String(error)));
    }
}

async function getTipificacaoPorIdService(id: string | undefined): Promise<Tipificacao | null> {
    const url = `${urlBase}/typification/${id}`

    try {
        const response = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            return null
        }

        const json = await response.json();
        return json
    } catch (error) {
        return null
    }
}

async function adicionarTipificacaoService(nome: string, fontesSelecionadas: Fonte[]): Promise<Tipificacao | null> {
    const url = `${urlBase}/typification/`

    try {
        let listaIds = fontesSelecionadas.map(fonte => fonte.id)
        const dados = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                name: nome,
                source_ids: listaIds
            })
        })


        if (dados.status !== 201) {
            return null
        }

        const tipificacao = await dados.json()
        return tipificacao
    } catch (error) {
        return null
    }
}

async function excluirTipificacaoService(id: string): Promise<number | undefined> {
    const url = `${urlBase}/typification/${id}`

    try {
        const dados = await fetch(url, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "content-type": "application/json"
            }
        })

        return dados.status
    } catch (error) {
        throw new Error("Erro ao excluir tipificacao no arquivo ts: " + error)
    }
}

async function atualizarTipificacaoService(tipificacao: Tipificacao): Promise<number | undefined> {
    const url = `${urlBase}/typification/`

    try {
        const dados = await fetch(url, {
            method: "PUT",
            credentials: "include",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(tipificacao)
        })

        return dados.status
    } catch (error) {
        throw new Error("Erro ao atualizar tipificacao no arquivo ts: " + error)
    }
}

export {
    getTipificacoesService,
    getTipificacaoPorIdService,
    adicionarTipificacaoService,
    atualizarTipificacaoService,
    excluirTipificacaoService
}