const urlBase = process.env.NEXT_PUBLIC_URL_BASE;

async function buscarVersaoPlataformaService() {
    try {
        const resposta = await fetch(`${urlBase}/health`, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        })

        if (resposta.status !== 200) return 

        const data = await resposta.json();

        return data
    } catch(e) {
        return
    }
}

export {
    buscarVersaoPlataformaService
}