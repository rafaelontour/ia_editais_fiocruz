import { Usuario } from "@/core";


const urlBase = process.env.NEXT_PUBLIC_URL_BASE

async function getUsuario(): Promise<Usuario | null> {
    return null;
}

async function deleteUsuario(usuarioId: string) {
     try{
        const res = await fetch(`${urlBase}/user/${usuarioId}`, {
            method: "DELETE",
             headers: {
                "content-type": "application/json"
            },
        });

        if (!res.ok) throw new Error("Erro ao deletar Usuario ");

        const data = await res.json();
        return data;
        
    }catch(e){
        throw new Error("Erro ao deletar Usuario: " + e)

    }
}

export {
    getUsuario,
    deleteUsuario
}