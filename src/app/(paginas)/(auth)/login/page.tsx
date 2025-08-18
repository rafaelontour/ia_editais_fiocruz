"use client"

import { useForm } from "react-hook-form"
import { set, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { getToken } from "@/service/auth"
import { useRouter } from "next/navigation"
import { useState } from "react"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Campo obrigatório!"),
  senha: z
    .string()
    .min(3, "Campo obrigatório!"),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors }, setError
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function logar(data: LoginFormData) {
    try {
        if (!data.email || !data.senha) {
          setError("email", {
            type: "manual",
            message: "O email é obrigatório"
          })

          setError("senha", {
            type: "manual",
            message: "/a senha é obrigatória"
          })

          return
        }

        const formData = new FormData();
        formData.append("username", data.email)
        formData.append("password", data.senha)
        const token = await getToken(formData)

        if (!token) {
          return
        }

        router.push("/adm")
    } catch(e) {
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
          onSubmit={handleSubmit(logar)}
          className="flex flex-col gap-4 font-medium text-lg 2xl:text-xl"
        >
          <label htmlFor="username" className="flex flex-col gap-2">
            Email
            <input
              {...register("email")}
              type="text"
              className="bg-branco rounded-md border-gray-300 border py-2 px-2"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
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
