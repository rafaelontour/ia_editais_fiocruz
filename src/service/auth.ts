const urlBase: string | undefined = process.env.NEXT_PUBLIC_URL_BASE



export async function getToken(formData:any) {
     try{
        const url = `${urlBase}/token `;

        const res = await fetch(url, {
            method: "POST",
            body: formData
        });
      const data = await res.json()
      return data;
    }catch(e){
        console.error("Erro ao tentar criar usuário: ", e);
    }
}

