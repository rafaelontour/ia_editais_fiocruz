import { Ramo } from "@/core";

const urlBase: string | undefined = process.env.NEXT_PUBLIC_URL_BASE

async function getRamosService(id: string | undefined): Promise<Ramo[] | undefined> {
    try {
        const resposta = await fetch(`${urlBase}/branch?taxonomy_id=${id}/`, {
            method: "GET",
            credentials: "include",
        });

        const dado = await resposta.json();

        if (!resposta.ok) {
            console.error('Erro ao buscar ramos:', dado.error);
            throw new Error(dado.error);
        }

        return dado
    } catch (error) {
        console.error('Erro ao buscar ramo:', error);
    }
}

async function adicionarRamoService(ramo: Ramo): Promise<number | undefined> {
    try {
        const resposta = await fetch(`${urlBase}/branch/`, {
            method: 'POST',
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ramo)
        });

        return resposta.status
    } catch (error) {
        console.error('Erro ao adicionar ramo:', error);
    }
}

async function buscarRamosDaTaxonomiaService(idTaxonomia: string | undefined): Promise<Ramo[] | undefined> {
    try {
        const resposta = await fetch(`${urlBase}/branch?taxonomy_id=${idTaxonomia}`, {
            method: "GET",
            credentials: "include",
        });

        const dado = await resposta.json();

        if (!resposta.ok) {
            console.error('Erro ao buscar ramos:', dado.error);
            throw new Error(dado.error);
        }

        return dado.branches;

    } catch (error) {
        console.error('Erro ao buscar ramo:', error);
    }
}


async function atualizarRamoService(dadosRamos: Ramo): Promise<number | undefined> {
    try {
        const resposta = await fetch(`${urlBase}/branch/`, {
            method: 'PUT',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosRamos)
        });

        return resposta.status
    } catch (error) {
        console.error('Erro ao atualizar ramo:', error);
    }
}

async function excluirRamoService(idRamo: string | undefined): Promise<number | undefined> {
    try {
        const resposta = await fetch(`${urlBase}/branch/${idRamo}/`, { method: "DELETE", credentials: "include" });
        console.log("Status: ", resposta.status);
        return resposta.status
    } catch (error) {
        console.error('Erro ao excluir ramo:', error);
    }
}

export {
    getRamosService,
    adicionarRamoService,
    buscarRamosDaTaxonomiaService,
    atualizarRamoService,
    excluirRamoService
}