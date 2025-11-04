import { Comentario, Comentarios } from "@/core/edital/Edital";

const urlBase = process.env.NEXT_PUBLIC_URL_BASE;

async function buscarComentariosPorIdEditalService(id: string): Promise<Comentarios | undefined> {
    try {
        const res = await fetch(`${urlBase}/doc/${id}/messages`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            }
        })

        if (!res.ok) return

        const data = await res.json();

        return data
    } catch(e) {
        return
    }
}

async function fazerComentarioEditalService(id: string | undefined, comentario: Comentario): Promise<number | undefined> {
    console.log("dados: ", id, comentario);
    try {
        const resposta = await fetch(`${urlBase}/doc/${id}/message`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                content: comentario.content
            })
        })

        return resposta.status
    } catch(e) {
        return
    }
}

async function excluirComentarioEditalService(idComentario: string | undefined): Promise<number | undefined> {
    try {
        const resposta = await fetch(`${urlBase}/doc/message/${idComentario}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            }
        })

        return resposta.status
    } catch(e) {
        return
    }
}

export {
    buscarComentariosPorIdEditalService,
    fazerComentarioEditalService,
    excluirComentarioEditalService
}