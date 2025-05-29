import { Fontes } from "@/core/fonte"

async function getFontes() : Promise<Fontes[]> {
    const dados = await fetch('http://localhost:3000/api/fontes', { method: 'GET' })

    if (!dados.ok) {
        throw new Error('Erro ao buscar fontes')
    }
    
    const fontes = await dados.json()
    return fontes
}

export { getFontes }