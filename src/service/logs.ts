const urlBase = process.env.NEXT_PUBLIC_URL_BASE

async function buscarLogsEditalService(id: string) {
    try {
        const resposta = await fetch(`${urlBase}/audit-log?record_id=${id}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            }
        })

        if (!resposta.ok) return

        const data = await resposta.json();

        return data
    } catch(e) {
        return
    }
}

export {
    buscarLogsEditalService
}