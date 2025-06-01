import { Fonte } from "@/core/fonte"

async function getFontes(): Promise<Fonte[] | null> {
    try {
        const dados = await fetch('http://localhost:3000/api/fontes', { method: 'GET' })
        
        if (!dados.ok) {
            throw new Error('Erro ao buscar fontes')
        }
        const fontes: Fonte[] = await dados.json()
        return fontes
    } catch (error) {
        console.error('Erro ao buscar fontes', error)
        return null
    }
}

async function adicionarFonte(fonte: Fonte) : Promise<boolean> {
    try {
        fonte.id = Math.floor(Math.random() * 1000)
        const resposta = await fetch('http://localhost:3000/api/fontes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fonte)
        });

        return resposta.ok
    } catch (error) {
        console.error('Erro ao adicionar fonte:', error);
    }

    return false
}

async function excluirFonte(id: number): Promise<boolean> {
    try {
        const resposta = await fetch(`http://localhost:3000/api/fontes?id=${id}`, { method: 'DELETE' });
    
        const dado = await resposta.json();
    
        if (!resposta.ok) {
            console.error('Erro ao excluir fonte:', dado.error);
            throw new Error(dado.error);
        }
        
        return resposta.ok
    } catch (error) {
        console.error('Erro ao excluir fonte:', error);
    }

    return false
}

export { 
    getFontes,
    adicionarFonte,
    excluirFonte

}