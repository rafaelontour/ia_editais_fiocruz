const urlBase: string | undefined = process.env.NEXT_PUBLIC_URL_BASE

async function adicionarUsuarioService(name : string, password: string, email: string) {
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

    } catch(e) {
        console.error("Erro ao tentar criar usuário: ", e);
    }
}

async function getToken(dados: any) {
     try {
        const url = `${urlBase}/token/`;

        const dadosLogin = new URLSearchParams(dados).toString();

        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: dadosLogin,
            credentials: "include"
        });

        const data = await res.json()

        console.log("token: ", data)
        return data;
    } catch (e) {
        console.error("Erro ao tentar criar usuário: ", e);
    }
}

export {
    adicionarUsuarioService,
    getToken
}

// async function atualizarUsuario(email: string, password: string) {
//      try{
//         const url = `${urlBase}/token `;

//         const res = await fetch(url, {
//             method: "GET",
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 password, email
//             })
//         });
//       const data = await res.json()
//      return data;
//     }catch(e){
//         console.error("Erro ao tentar criar usuário: ", e);
//     }
// }