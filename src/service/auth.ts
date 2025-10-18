const urlBase: string | undefined = process.env.NEXT_PUBLIC_URL_BASE

async function getToken(dados: any) {
    try {
        const url = `${urlBase}/auth/sign-in`;

        const dadosLogin = new URLSearchParams(dados).toString()

        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: dadosLogin,
            credentials: "include"
        });

        const data = await res.json()

        return data;
    } catch (e) {
        return
    }
}

async function logout() {
    try {
        const url = `${urlBase}/auth/sign-out`;

        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            credentials: "include"
        });

        return res.status
    } catch (e) {
        return
    }
}

export {
    getToken,
    logout
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