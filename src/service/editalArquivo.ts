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


async function enviarArquivoService(idEdital: string | undefined, arquivo: File | undefined | null, tipoAlteracao: string = "patch"): Promise<number | undefined> {
    try {
        const formData = new FormData();
        formData.append('file', arquivo!);
        formData.append('bump', tipoAlteracao);

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

async function reenviarArquivoService(idEdital: string | undefined, projectDocumentId: string, tipoAlteracao: string = "patch"): Promise<number | undefined> {
    try {
        const res = await fetch(`${urlBase}/doc/${idEdital}/release/from-file`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ project_document_id: projectDocumentId, bump: tipoAlteracao })
        });

        return res.status;
    } catch (e) {
        return
    }
}

export {
    enviarArquivoService,
    reenviarArquivoService,
    getEditalArquivoService
}