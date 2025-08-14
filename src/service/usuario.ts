import { Usuario } from "@/core";
import { NivelAcesso } from "@/core/enum/nivelAcessoEnum";


const urlBase = process.env.NEXT_PUBLIC_URL_BASE

async function getUsuario(): Promise<Usuario | null> {
    return null;
}

async function deleteUsuario(usuarioId: string) {
     try{
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
        
    }catch(e){
        throw new Error("Erro ao deletar Usuario: " + e)

    }
}

async function updateUser(usuarioId: string, email:string, username: string, access_level : string) {
     try{
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
    }catch(e){
        console.error("Erro ao tentar criar usuário: ", e);
    }
}


async function postUser(name : string, password: string, email: string) {
    try{
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

    }catch(e){
        console.error("Erro ao tentar criar usuário: ", e);
    }
}

export {
    getUsuario,
    deleteUsuario,
    updateUser,
    postUser
}