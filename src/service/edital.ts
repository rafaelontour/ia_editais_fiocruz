import { Edital } from "@/core";

const urlBase = process.env.NEXT_PUBLIC_URL_BASE

async function getEditaisService(): Promise<Edital[] | undefined> {
    try {
        const res = await fetch(`${urlBase}/doc/`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            }
        })

        if (!res.ok) throw new Error("Erro ao buscar edital");

        const data = await res.json();

        return data;
        
    } catch(e) {
        throw new Error("Erro ao buscar edital: " + e)
    }
}

export {
    getEditaisService
}