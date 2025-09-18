import { Taxonomia } from "@/core"

const urlBase: string | undefined = process.env.NEXT_PUBLIC_URL_BASE

async function getTaxonomiasService(): Promise<Taxonomia[] | undefined> {
    const response = await fetch(`${urlBase}/taxonomy`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        throw new Error('Erro ao buscar taxonomias');
    }

    const json = await response.json();
    const taxonomias: Taxonomia[] = json.taxonomies;

    for (let taxonomia of taxonomias) {
        if (taxonomia.created_at) {
            taxonomia.created_at = new Date(taxonomia.created_at).toLocaleString();
        }
    }

    return taxonomias;
}


async function adicionarTaxonomiaService(taxonomia: Taxonomia): Promise<number | undefined> {

    try {
        const resposta = await fetch(`${urlBase}/taxonomy/`, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taxonomia)
        });

        return resposta.status
    } catch (error) {
        console.error('Erro ao adicionar taxonomia:', error);
    }
}

async function atualizarTaxonomiaService(taxonomia: Taxonomia): Promise<number | undefined> {
    try {
        const resposta = await fetch(`${urlBase}/taxonomy`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(taxonomia)
        })

        return resposta.status
    } catch (error) {
        console.error('Erro ao atualizar taxonomia:', error);
    }
}

async function excluirTaxonomiaService(idTaxomonia: string | undefined): Promise<number | undefined> {
    try {
        const resposta = await fetch(`${urlBase}/taxonomy/${idTaxomonia}/`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return resposta.status
    } catch (error) {
        console.error('Erro ao excluir taxonomia:', error);
    }
}

export {
    getTaxonomiasService,
    adicionarTaxonomiaService,
    atualizarTaxonomiaService,
    excluirTaxonomiaService
}