import { Fonte, Tipificacao } from "@/core";

const urlBase = process.env.NEXT_PUBLIC_URL_BASE

async function getTipificacoesService(): Promise<Tipificacao[]> {
    const url = `${urlBase}/typification/`

    try {
        const dados = await fetch(url, {
            "method": "GET",
            "headers": {
                "content-type": "application/json"
            }
        })

        if (!dados.ok) {
            throw new Error('Erro ao buscar tipificacoes no try/catch')
        }

        const tipificacoes = await dados.json()

        for (let tipificacao of tipificacoes) {
            tipificacao.created_at = new Date(tipificacao.created_at).toLocaleString()
        }
        
        return tipificacoes
    } catch(error) {
        throw new Error("Erro ao buscar tipificacoes: " + error)
    }
}

async function adicionarTipificacaoService(nome: string, fontesSelecionadas: Fonte[]): Promise<Tipificacao> {
    const url = `${urlBase}/typification/`
    
    try {
        let listaIds = fontesSelecionadas.map(fonte => fonte.id)
        const dados = await fetch(url, {
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "body": JSON.stringify({
                "name": nome,
                "source": listaIds
            })
        })

        if (dados.status !== 201) {
            throw new Error('Erro ao adicionar tipificacao no try/catch')
        }

        const tipificacao = await dados.json()
        return tipificacao
    } catch(error) {
        throw new Error("Erro ao adicionar tipificacao: " + error)
    }
}

async function excluirTipificacaoService(id: string): Promise<number | undefined> {
    const url = `${urlBase}/typification/${id}`

    try {
        const dados = await fetch(url, {
            method: "DELETE",
            headers: {
                "content-type": "application/json"
            }
        })

        return dados.status
    } catch(error) {
        throw new Error("Erro ao excluir tipificacao no arquivo ts: " + error)
    }
}

async function atualizarTipificacaoService(tipificacao: Tipificacao): Promise<number | undefined> {
    const url = `${urlBase}/typification/`
    
    try {
        const dados = await fetch(url, {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(tipificacao)
        })
        
        console.log(dados)

        return dados.status
    } catch(error) {
        throw new Error("Erro ao atualizar tipificacao no arquivo ts: " + error)
    }
}

export {
    getTipificacoesService,
    adicionarTipificacaoService,
    atualizarTipificacaoService,
    excluirTipificacaoService
}