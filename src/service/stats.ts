const urlBase = process.env.NEXT_PUBLIC_URL_BASE


async function getKpiStatsService(): Promise<any> {
    try {
        const resposta = await fetch(`${urlBase}/stats/kpis`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            }
        })

        if (!resposta.ok) throw new Error('Falha ao buscar KPIs');
        return await resposta.json();

    } catch (e) {
        console.error("Erro em getKpiStatsService:", e);
        return null;
    }
}


async function getDocumentsByUnitService(): Promise<any> {
    try {
        const resposta = await fetch(`${urlBase}/stats/documents-by-unit`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            }
        })

        if (!resposta.ok) throw new Error('Falha ao buscar documentos por unidade');
        return await resposta.json();

    } catch (e) {
        console.error("Erro em getDocumentsByUnitService:", e);
        return { stats: [] };
    }
}


async function getMostUsedTypificationsService(): Promise<any> {
    try {
        const resposta = await fetch(`${urlBase}/stats/most-used-typifications`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            }
        })

        if (!resposta.ok) throw new Error('Falha ao buscar tipificações');
        return await resposta.json();

    } catch (e) {
        console.error("Erro em getMostUsedTypificationsService:", e);
        return { stats: [] };
    }
}


export {
    getKpiStatsService,
    getDocumentsByUnitService,
    getMostUsedTypificationsService
}