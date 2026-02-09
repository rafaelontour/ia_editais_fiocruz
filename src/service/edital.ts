import { Edital } from "@/core";

const urlBase = process.env.NEXT_PUBLIC_URL_BASE

async function getEditaisService(idUnidade: string | undefined): Promise<Edital[] | undefined> {
    try {
        const res = await fetch(`${urlBase}/doc?unit_id=${idUnidade}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            }
        })

        if (!res.ok) return

        const { documents } = await res.json();
        return documents;
    } catch (e) {
        return
    }
}

async function getEditalPorIdService(id: string | undefined): Promise<Edital | undefined> {
    console.log("getEditalPorIdService id:", id);
    try {
        const res = await fetch(`${urlBase}/doc/${id}`, {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            headers: {
                "Content-type": "application/json"
            }
        })

        
        if (!res.ok) return
        
        const data = await res.json();

        return data;
        
    } catch(e) {
        return
    }
}

async function adicionarEditalService(dados: any): Promise<[number, string] | undefined> {
    try {
        const resposta = await fetch(`${urlBase}/doc`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(dados)
        })

        const json = await resposta.json()

        return [resposta.status, json.id]
    } catch (e) {
        return
    }
}

async function atualizarEditalService(dados: any): Promise<number | undefined> {
    try {
        const resposta = await fetch(`${urlBase}/doc`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                id: dados.id,
                name: dados.name,
                identifier: dados.identifier,
                description: dados.description,
                editors_ids: dados.editors_ids,
                typification_ids: dados.typification_ids,
            })
        })

        return resposta.status
    } catch (e) {
        return
    }
}

async function excluirEditalService(editalId: string): Promise<number | undefined> {
    try {
        const responsta = await fetch(`${urlBase}/doc/${editalId}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            }
        })

        return responsta.status
    } catch (e) {
        return
    }
}

async function definirStatusRascunho(editalId: string): Promise<number | undefined> {
    try {
        const res = await fetch(`${urlBase}/doc/${editalId}/status/pending`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            }
        })

        return res.status
    } catch (e) {
        return
    }
}

async function definirStatusEmConstrucao(editalId: string): Promise<number | undefined> {
    try {
        const res = await fetch(`${urlBase}/doc/${editalId}/status/under-construction`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            }
        })

        return res.status
    } catch (e) {
        return
    }
}

async function definirStatusEmAnalise(editalId: string): Promise<number | undefined> {
    try {
        const res = await fetch(`${urlBase}/doc/${editalId}/status/waiting-review`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            }
        })

        return res.status
    } catch (e) {
        return
    }
}

async function definirStatusConcluido(editalId: string): Promise<number | undefined> {
    try {
        const res = await fetch(`${urlBase}/doc/${editalId}/status/completed`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            }
        })

        return res.status
    } catch (e) {
        return
    }
}

async function arquivarEditalService(editalId: string) {
    try {
        const resposta = await fetch(`${urlBase}/doc/${editalId}/toggle-archive`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            }
        })

        return resposta.status
    } catch (e) {
        return
    }
}

async function getEditaisArquivadosService(idUnidade: string | undefined) {
    try {
        const res = await fetch(`${urlBase}/doc?unit_id=${idUnidade}&archived=true`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            }
        })

        
        if (res.status !== 200) return
        
        const editais = await res.json();

        return editais
    } catch (e) {
        return
    }
}

export {
    getEditaisService,
    getEditalPorIdService,
    adicionarEditalService,
    atualizarEditalService,
    excluirEditalService,
    definirStatusRascunho,
    definirStatusEmConstrucao,
    definirStatusEmAnalise,
    definirStatusConcluido,
    arquivarEditalService,
    getEditaisArquivadosService
}