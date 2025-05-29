async function excluirRamo(idTaxomonia: number, idRamo: number) {
    try {
        const resposta = await fetch(`http://localhost:3000/api/taxonomias?id=${idTaxomonia}&ramo=${idRamo}`, { method: 'DELETE' });
    
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

export { excluirRamo }