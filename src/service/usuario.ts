import { Usuario } from "@/core";
import { UsuarioUnidade } from "@/core/usuario";

const urlBase = process.env.NEXT_PUBLIC_URL_BASE

async function getUsuarioLogado(): Promise<UsuarioUnidade | undefined> {
    try {
        const res = await fetch(`${urlBase}/user/my-self/`, {
            method: "GET",
            credentials: "include",
            headers: {
                "content-type": "application/json"
            }
        })

        const data =  await res.json();

        console.log("usuario: ", data)

        return data
    } catch(e) {
        console.error("Erro na busca de usuario: ", e)
    }
}

async function getUsuariosPorUnidade(unidadeId: string | undefined): Promise<UsuarioUnidade[] | undefined> {
    try {
        const res = await fetch(`${urlBase}/user/?unit_id=${unidadeId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "content-type": "application/json"
            }
        })
        
        const data =  await res.json();

        if(!data || data.lenght === 0) return []
        
        return data
        
    } catch(e) {
        console.error("Erro na busca de usuario: ", e)
    }
}

async function adicionarUsuarioService(dados: any) {
    try {
        const url = `${urlBase}/user/`;

        console.log(dados)
        
        const res = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: dados.nome,
                email: dados.email,
                unit_id: dados.unidade,
                phone_number: dados.whatsapp,
                access_level: dados.perfil
            })

        });
        
        return res.status

    } catch(e) {
        console.error("Erro ao tentar criar usuário: ", e);
    }

}

async function atualizarUsuarioService(usuarioId: string, email:string, username: string, access_level : string, phone_number: string, unit_id: string) {
     try {
        const url = `${urlBase}/user/`;

        const res = await fetch(url, {
            method: "PUT",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                unit_id: unit_id,
                phone_number: phone_number,
                access_level: access_level,
                id: usuarioId,
            })
        });

        const data = await res.json()
        
        return data;
    } catch(e) {
        console.error("Erro ao tentar criar usuário: ", e);
    }
}

async function excluirUsuarioService(usuarioId: string): Promise<number | undefined> {
    try {
        const res = await fetch(`${urlBase}/user/${usuarioId}/`, {
            method: "DELETE",
            credentials: "include",
        });

        return res.status;
        
    } catch(e) {
        throw new Error("Erro ao deletar Usuario: " + e)

    }
}

export {
    getUsuarioLogado,
    getUsuariosPorUnidade,
    adicionarUsuarioService,
    atualizarUsuarioService,
    excluirUsuarioService,
}