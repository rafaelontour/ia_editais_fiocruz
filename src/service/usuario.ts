import { Usuario } from "@/core";
import { NivelAcesso } from "@/core/enum/nivelAcessoEnum";
import { UsuarioUnidade } from "@/core/usuario";

const urlBase = process.env.NEXT_PUBLIC_URL_BASE

async function getUsuario(): Promise<Usuario | null> {
    return null;
}

async function getUsuariosPorUnidade(unidadeId: string, unidadeNome: string) {
    try {
        const res = await fetch(`${urlBase}/user_units/unit/${unidadeId}`)
        
        
        const data =  await res.json();
        if(!data || data.lenght === 0) return []
        
        return data.map((usuario: any) => ({
            ...usuario,
            unidade: unidadeNome
        }));
        
    } catch(e) {
        console.error("Erro na busca de usuario: ", e)
    }
}

async function adicionarUsuarioService(name : string, password: string, email: string) {
    try {
        const url = `${urlBase}/users `;
        
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,password, email
            })

        });
        
        return res.status

    } catch(e) {
        console.error("Erro ao tentar criar usuário: ", e);
    }

}

async function atualizarUsuarioService(usuarioId: string, email:string, username: string, access_level : string) {
     try {
        const url = `${urlBase}/user/${usuarioId} `;

        const res = await fetch(url, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                id: usuarioId, email, username, access_level
            })
        });

        const data = await res.json()
        return data;
    } catch(e) {
        console.error("Erro ao tentar criar usuário: ", e);
    }
}

async function excluirUsuarioService(usuarioId: string) {
    try {
        const token = localStorage.getItem("token")

        const res = await fetch(`${urlBase}/user/${usuarioId}`, {
            method: "DELETE",
            
             headers: {
                "Authorization": `Bearer ${token}`
            },
        });

        if (!res.ok) throw new Error("Erro ao deletar Usuario ");

        const data = await res.json();
        return data;
        
    } catch(e) {
        throw new Error("Erro ao deletar Usuario: " + e)

    }
}

export {
    getUsuario,
    getUsuariosPorUnidade,
    adicionarUsuarioService,
    atualizarUsuarioService,
    excluirUsuarioService,
}