"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { getToken } from "@/service/auth"
const loginSchema = z.object({
  username: z
    .string()
    .min(1, "O username é obrigatório"),
  senha: z
    .string()
    .min(3, "A senha deve ter no mínimo 3 caracteres"),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    try{
        const formData = new FormData();
        formData.append("username", data.username)
        formData.append("password", data.senha)
        const token = await getToken(formData)
        console.log(token)
        localStorage.setItem("token", token.access_token)
    }catch(e){
        console.log(e)
    }  

  }

  return (
    <div className="flex items-center bg-gray-100 h-full justify-center">
      <div className="w-3/4 2xl:w-1/2 flex flex-col gap-4 2xl:gap-6">
        <div>
          <h2 className="text-cinza text-4xl self-baseline font-bold mb-2">
            Fazer Login
          </h2>
          <p className="text-xl">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 font-medium text-lg 2xl:text-xl"
        >
          <label htmlFor="username" className="flex flex-col gap-2">
            Username
            <input
              {...register("username")}
              type="text"
              className="bg-branco rounded-md border-gray-300 border py-2 px-2"
            />
            {errors.username && (
              <span className="text-red-500 text-sm">
                {errors.username.message}
              </span>
            )}
          </label>

          <label htmlFor="senha" className="flex flex-col gap-2">
            Senha
            <input
              {...register("senha")}
              type="password"
              className="bg-branco rounded-md border-gray-300 border py-2 px-2"
            />
            {errors.senha && (
              <span className="text-red-500 text-sm">
                {errors.senha.message}
              </span>
            )}
          </label>

          <button
            
            type="submit"
            className="bg-vermelho text-branco rounded-md px-6 py-3 cursor-pointer"
          >
            Fazer Login
          </button>
          <div className="flex justify-between">
            <p>Esqueci a senha</p>
          </div>
        </form>
      </div>
    </div>
  )
}
