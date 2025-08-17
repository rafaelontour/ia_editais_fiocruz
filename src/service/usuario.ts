import { Usuario } from "@/core";
import { UsuarioUnidade } from "@/core/usuario";

const urlBase = process.env.NEXT_PUBLIC_URL_BASE

async function getUsuario(): Promise<Usuario | null> {
    return null;
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
        
        return data.map((usuario: any) => ({
            ...usuario
        }));
        
    } catch(e) {
        console.error("Erro na busca de usuario: ", e)
    }
}

async function adicionarUsuarioService(name : string, password: string, email: string) {
    try {
        const url = `${urlBase}/user/`;
        
        const res = await fetch(url, {
            method: "POST",
            credentials: "include",
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

async function atualizarUsuarioService(usuarioId: string, email:string, username: string, access_level : string, phone_number: string, unit_id: string) {
     try {
        const url = `${urlBase}/user/`;

        const res = await fetch(url, {
            method: "PUT",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
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

async function excluirUsuarioService(usuarioId: string) {
    try {
        const token = localStorage.getItem("token")

        const res = await fetch(`${urlBase}/user/${usuarioId}`, {
            method: "DELETE",
            credentials: "include",
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