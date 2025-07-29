import { Ramo } from "@/core";

const urlBase: string | undefined = process.env.NEXT_PUBLIC_URL_BASE

async function adicionarRamoService(ramo: Ramo): Promise<number | undefined> {
    try {
        const resposta = await fetch(`${urlBase}/taxonomy/branch/`, { 
            method: 'POST',
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

async function excluirRamo(idRamo: number) {
    try {
        const resposta = await fetch(`${urlBase}/taxonomias/${idRamo}`, { method: 'DELETE' });
    
        const dado = await resposta.json();
    
        if (!resposta.ok) {
            console.error('Erro ao excluir ramo:', dado.error);
            throw new Error(dado.error);
        }
        
        return dado
    } catch (error) {
        console.error('Erro ao excluir ramo:', error);
    }
}

export {
    adicionarRamoService,
    excluirRamo
}