const urlBase = process.env.NEXT_PUBLIC_URL_BASE

async function getTodasUnidades() {
    try {
        const res = await fetch(`${urlBase}/unit`);

        if (!res.ok) throw new Error("Erro ao buscar Unidades");

        const data = await res.json();

        return data;
        
    } catch(e) {
        throw new Error("Erro ao buscar tipificacoes: " + e)

    }
}

async function getUnidadePorId(unidadeId: string){
    try {
        const res = await fetch(`${urlBase}/unit/${unidadeId}`);

        if (!res.ok) throw new Error("Erro ao buscar unidade ");

        const data = await res.json();

        return data;
        
    } catch(e) {
        throw new Error("Erro ao buscar unidade: " + e)

    }
}

async function adicionarUsuarioService(name: string, location : string){
    try {
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
        
    } catch(e) {
        throw new Error("Erro ao criar unidade: " + e)

    }
}

async function excluirUsuarioService(unidadeId: string){
    try {
        const res = await fetch(`${urlBase}/unit/${unidadeId}`);

        if (!res.ok) throw new Error("Erro ao deletar unidade ");

        const data = await res.json();
        return data;
        
    } catch(e) {
        throw new Error("Erro ao deletar unidade: " + e)

    }
}

export {
    getTodasUnidades,
    getUnidadePorId,
    adicionarUsuarioService,
    excluirUsuarioService
}