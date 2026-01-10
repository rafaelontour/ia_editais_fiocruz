import { UsuarioUnidade } from "@/core/usuario";

const urlBase = process.env.NEXT_PUBLIC_URL_BASE

async function getUsuarioLogado() {
    try {

        const res = await fetch(`${urlBase}/user/my`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            }
        })

        const data = await res.json();

        return [data, res.status]
    } catch (e) {
        return [undefined, 401]
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

        const data = await res.json();

        if (!data || data.lenght === 0) return []

        return data.users

    } catch (e) {
        return
    }
}

async function adicionarUsuarioService(dados: any) {
    try {
        const url = `${urlBase}/user/`;

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

    } catch (e) {
        console.error("Erro ao tentar criar usuário: ", e);
    }

}

async function atualizarUsuarioService(dados: any, id: string): Promise<number | undefined> {
    try {
        const url = `${urlBase}/user/`;

        const res = await fetch(url, {
            method: "PUT",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                username: dados.username,
                email: dados.email,
                unit_id: dados.unit_id,
                phone_number: dados.phone_number,
                access_level: dados.access_level
            })
        });

        return res.status
    } catch (e) {
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

    } catch (e) {
        throw new Error("Erro ao deletar Usuario: " + e)

    }
}

async function buscarResponsavelEdital(idResponsavel: string): Promise<string> {
    try {
        const res = await fetch(`${urlBase}/user/${idResponsavel}/`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            }
        })

        const data =  await res.json();

        return data.username;
    } catch(e) {
        return ""
    }
}

export {
    getUsuarioLogado,
    getUsuariosPorUnidade,
    adicionarUsuarioService,
    atualizarUsuarioService,
    excluirUsuarioService,
    buscarResponsavelEdital
}