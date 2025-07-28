const urlBase: string | undefined = process.env.NEXT_PUBLIC_URL_BASE

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
    excluirRamo
}