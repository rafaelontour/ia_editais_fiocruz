import Link from "next/link"

export default function Login(){

    return(
        <div className="flex items-center bg-gray-100 h-full justify-center">
            <div className="w-3/4 2xl:w-1/2 flex flex-col gap-4 2xl:gap-6">
            <div >
                <h2 className="text-cinza text-4xl self-baseline font-bold mb-2">Fazer Login</h2>
                <p className="text-xl">Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
            </div>

            <div className="flex flex-col gap-6 text-xl font-medium">
                <button className="border-gray-300 border-1 bg-branco rounded-sm text-black px-6 py-2 ">Login com Microsoft</button>
                <button className="border-gray-300 border-1 bg-branco rounded-sm text-black px-6 py-2 ">Login com Google</button>
            </div>

            <div className="flex flex-row items-center gap-4">
                <hr className="bg-gray-800 w-1/2" />
                <p>Ou</p>
                <hr className="bg-gray-800  w-1/2" />
            </div>
            <form action="" className="flex flex-col gap-4 font-medium text-lg 2xl:text-xl">
                <label htmlFor="email" className="flex flex-col gap-2">
                    Email
                    <input name="email" type="text" className="bg-branco rounded-md #b5b5b5 border-gray-300 border-1 py-2 px-2"/>
                </label>
                <label htmlFor="senha" className="flex flex-col gap-2">
                    Senha
                    <input name="senha" type="text" className="bg-branco rounded-md border-gray-300 border-1 py-2 px-2" />
                </label>

                <button type="submit" className="bg-vermelho text-branco rounded-md px-6 py-3 ">Fazer Login</button>
                <div className="flex justify-between">
                    <p>Esqueci a senha</p>
                   <Link href={"/cadastro"} className="cursor-pointer">Criar conta</Link>
                </div>
            </form>

        </div>
        </div>
    )
  
}