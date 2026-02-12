import { EditalArquivo } from "@/core/edital/Edital";

const urlBase = process.env.NEXT_PUBLIC_URL_BASE

async function getEditalArquivoService(id: string | null | undefined): Promise<EditalArquivo | undefined> {
    try {
        const resposta = await fetch(`${urlBase}/doc/${id}/release`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            }
        })

        if (!resposta.ok) return

        const data = await resposta.json();

        return data;
        
    } catch(e) {
        return
    }
}


async function enviarArquivoService(idEdital: string | undefined, arquivo: File | undefined | null): Promise<number | undefined> {
    try {
        const formData = new FormData();
        formData.append('file', arquivo!);

        const res = await fetch(`${urlBase}/doc/${idEdital}/release`, {
            method: "POST",
            credentials: "include",
            body: formData
        });
        
        return res.status;
    } catch (e) {
        return
    }
}

export {
    enviarArquivoService,
    getEditalArquivoService
}