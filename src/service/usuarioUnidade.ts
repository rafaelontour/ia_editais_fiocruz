const urlBase = process.env.NEXT_PUBLIC_URL_BASE



export async function getUsuariosUnidade(unidadeId: string, unidadeNome: string) {
    try{
        const res = await fetch(`${urlBase}/user_units/unit/${unidadeId}`)


        const data =  await res.json();
        if(!data || data.lenght === 0) return []

        return data.map((usuario: any) => ({
            ...usuario,
            unidade: unidadeNome
        }));
      
    }catch(e){
        console.error("Erro na busca de usuario: ", e)
    }
}