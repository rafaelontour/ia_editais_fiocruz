import { Taxonomia } from "@/core"

async function getTaxonomias() : Promise<Taxonomia[]> {
    const dados = await fetch('http://localhost:3000/api/taxonomias')

    if (!dados.ok) {
        throw new Error('Erro ao buscar taxonomias')
    }
    
    const taxonomias = await dados.json()
    return taxonomias
}

async function adicionarTaxonomia(taxonomia: Taxonomia) : Promise<void> {
    try {
        await fetch('http://localhost:3000/api/taxonomias', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taxonomia)
        });
    } catch (error) {
        console.error('Erro ao adicionar taxonomia:', error);
    }
}

async function excluirTaxonomia(idTaxomonia: number) {
    try {
        const resposta = await fetch(`http://localhost:3000/api/taxonomias?id=${idTaxomonia}`, { method: 'DELETE' });
    
        const dado = await resposta.json();
    
        if (!resposta.ok) {
            console.error('Erro ao excluir taxonomia:', dado.error);
            throw new Error(dado.error);
        }
        
        return dado
    } catch (error) {
        console.error('Erro ao excluir taxonomia:', error);
    }
}

export {
    getTaxonomias,
    adicionarTaxonomia,
    excluirTaxonomia
}