const urlBase = process.env.NEXT_PUBLIC_URL_BASE

async function enviarArquivoService(idEdital: string | undefined, arquivo: File): Promise<number | undefined> {

    try {
        const formData = new FormData();
        formData.append('file', arquivo);

        const res = await fetch(`${urlBase}/doc/${idEdital}/release/`, {
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
    enviarArquivoService
}