import Link from "next/link"
export default function Cadastro(){
    return(
        <div className="flex items-center bg-gray-100 h-full justify-center">
            <div className="w-3/4 2xl:w-1/2 flex flex-col gap-4 2xl:gap-6">
            <div >
                <h2 className="text-cinza text-4xl self-baseline font-bold mb-2">Criar Conta</h2>
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

            <form action="" className="flex flex-col gap-4 font-medium  text-lg 2xl:text-xl">
                <label htmlFor="nome" className="flex flex-col   gap-2">
                    Nome Completo
                    <input name="nome" type="text" className="bg-branco rounded-md border-gray-300 border-1 py-2 px-2"/>
                </label>
                <label htmlFor="email" className="flex flex-col  gap-2">
                    Email
                    <input name="email" type="text" className="bg-branco rounded-md border-gray-300 border-1 py-2 px-2"/>
                </label>
                <div className="flex gap-4  ">
                <label htmlFor="senha" className="flex flex-col  gap-2 w-1/2">
                    Senha
                    <input name="senha" type="text" className="bg-branco rounded-md border-gray-300 border-1 py-2 px-2 w-full" />
                </label>

                <label htmlFor="confirmarsenha" className="flex flex-col  gap-2 w-1/2">
                    Confirmar Senha
                    <input name="confirmarsenha" type="text" className="bg-branco rounded-md border-gray-300 border-1 py-2 px-2 w-full" />
                </label>
                </div>

                <button type="submit" className="bg-vermelho text-branco rounded-md px-6 py-3 text-xl">Criar Conta</button>
                <div className="flex justify-between"> 
                   <Link href={"/login"} className="cursor-pointer">Já possui conta? Fazer login</Link>
                </div>
            </form>

        </div>
        </div>
    )
}