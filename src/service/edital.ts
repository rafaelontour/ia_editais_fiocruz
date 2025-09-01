import { Edital } from "@/core";
import { toast } from "sonner";

const urlBase = process.env.NEXT_PUBLIC_URL_BASE

async function getEditaisService(): Promise<Edital[] | undefined> {
    try {
        const res = await fetch(`${urlBase}/doc/`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            }
        })

        if (!res.ok) toast.error("Erro ao buscar editais")

        const data = await res.json();

        return data;
        
    } catch(e) {
        throw new Error("Erro ao buscar edital: " + e)
    }
}

async function adicionarEditalService(dados: any): Promise<number | undefined> {
    try {
        const resposta = await fetch(`${urlBase}/doc/`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                name: dados.name,
                identifier: dados.identifier,
                description: dados.description,
                editors: dados.editors,
                typification: dados.typification,
            })
        })

        return resposta.status
    } catch(e) {
        return
    }
}

async function excluirEditalService(editalId: string): Promise<number | undefined> {
    try {
        const responsta = await fetch(`${urlBase}/doc/${editalId}/`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            }
        })

        return responsta.status
    } catch(e) {
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
    } catch(e) {
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
    } catch(e) {
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
    } catch(e) {
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
    } catch(e) {
        return
    }
}

export {
    getEditaisService,
    adicionarEditalService,
    excluirEditalService,
    definirStatusRascunho,
    definirStatusEmConstrucao,
    definirStatusEmAnalise,
    definirStatusConcluido
}