
const urlBase = process.env.NEXT_PUBLIC_URL_BASE


export async function getTodasUnidades(){
    try{
        const res = await fetch(`${urlBase}/unit`);

        if (!res.ok) throw new Error("Erro ao buscar Unidades");

        const data = await res.json();

        return data;
        
    }catch(e){
        throw new Error("Erro ao buscar tipificacoes: " + e)

    }
}




export async function getUnidadePorId(unidadeId: string){
    try{
        const res = await fetch(`${urlBase}/unit/${unidadeId}`);

        if (!res.ok) throw new Error("Erro ao buscar unidade ");

        const data = await res.json();

        return data;
        
    }catch(e){
        throw new Error("Erro ao buscar unidade: " + e)

    }
}

export async function postUnidade(name: string, location : string){
    try{
        const res = await fetch(`${urlBase}/unit`,{
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({name, location})
        });

        if (!res.ok) throw new Error("Erro ao criar unidade ");

        const data = await res.json();
        return data;
        
    }catch(e){
        throw new Error("Erro ao criar unidade: " + e)

    }
}

export async function deleteUnidade(unidadeId: string){
    try{
        const res = await fetch(`${urlBase}/unit/${unidadeId}`);

        if (!res.ok) throw new Error("Erro ao deletar unidade ");

        const data = await res.json();
        return data;
        
    }catch(e){
        throw new Error("Erro ao deletar unidade: " + e)

    }
}


