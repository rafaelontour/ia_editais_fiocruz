const urlBase: string | undefined = process.env.NEXT_PUBLIC_URL_BASE

async function getToken(dados: any) {
    try {
        const url = `${urlBase}/auth/sign-in`;

        const dadosLogin = new URLSearchParams(dados).toString()

        const res = await fetch(url, {
            method: "POST",www
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: dadosLogin,
            credentials: "include"
        });

        console.log("res:", res)

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

async function mandarEmailParaRecuperarSenhaService(email: string) {
    try {
        const res = await fetch(`${urlBase}/auth/forgot-password`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ email: email })
        })

        return res.status
    } catch (e) {
        return
    }
}

async function enviarCodigoWhatsAppService(email: string, codigo: string, senhaNova: string) {
    console.log("codigo:", codigo);
    try {
        const res = await fetch(`${urlBase}/auth/reset-password`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ email: email, token: codigo, new_password: senhaNova })
        })

        return res.status
    } catch (e) {
        return
    }
}

export {
    getToken,
    logout,
    mandarEmailParaRecuperarSenhaService,
    enviarCodigoWhatsAppService
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