import { Fonte } from "@/core/fonte"

const urlBase: string | undefined = process.env.NEXT_PUBLIC_URL_BASE

async function getFontesService(): Promise<Fonte[] | undefined> {
    try {
        const dados = await fetch(`${urlBase}/source/`, { method: 'GET' })
        
        if (!dados.ok) {
            throw new Error('Erro ao buscar fontes')
        }
        const fontes: Fonte[] = await dados.json()

        for (let fonte of fontes) {
            fonte.created_at = new Date(fonte.created_at).toLocaleString()
        }
        
        return fontes
    } catch (error) {
        console.error('Erro ao buscar fontes', error)
    }
}

async function adicionarFonteService(nome: string, descricao: string) : Promise<number | undefined> {
    try {
        const url = `${urlBase}/source/`
        const resposta = await fetch(`${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: nome,
                description: descricao
            })
        });

        return resposta.status
    } catch (error) {
        console.error('Erro ao adicionar fonte:', error);
    }
}

async function atualizarFonteService(id: string, nome: string, descricao: string) : Promise<number | undefined> {
    try {
        const url = `${urlBase}/source/`
        const resposta = await fetch(`${url}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                name: nome,
                description: descricao
            })
        });

        return resposta.status
    } catch (error) {
        console.error('Erro ao atualizar fonte:', error);
    }
}

async function excluirFonteService(id: string): Promise<number | undefined> {
    const url = `${urlBase}/source/${id}`
    try {
        const resposta = await fetch(`${url}`, { 
            method: "DELETE",
            headers: {
                "content-type": "application/json"
            }
        });

        console.log("Status: ", resposta.status);
        return resposta.status
    } catch (error) {
        console.error('Erro ao excluir fonte:', error);
    }
}

export { 
    getFontesService,
    adicionarFonteService,
    atualizarFonteService,
    excluirFonteService
}