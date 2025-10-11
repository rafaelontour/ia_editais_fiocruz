"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { getToken } from "@/service/auth"
import { useRouter } from "next/navigation"
import useUsuario from "@/data/hooks/useUsuario"
import { getUsuarioLogado } from "@/service/usuario"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { toast } from 'sonner';

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

  const { logarUsuario } = useUsuario()

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
      if (!data.email) {
        setError("email", {
          type: "manual",
          message: "O email é obrigatório"
        })

        return
      }

      if (!data.senha) {
        setError("senha", {
          type: "manual",
          message: "A senha é obrigatória"
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

      const [ daados, status ] = await getUsuarioLogado()

      if (status == 401) {
        toast.error("Erro ao fazer login! Credenciais inválidas.")
        return
      }

      logarUsuario()
      toast.success("Login efetuado com sucesso!")

      router.push("/adm")
      
    } catch(e) {
      toast.error("Erro ao efetuar login! - " + e)
    }  
  }

  return (
    <div className="flex items-center bg-gray-100 h-full justify-center">
      <div className="w-3/4 2xl:w-1/2 flex flex-col gap-4 2xl:gap-6">
        <div>
          <h2 className="text-cinza text-center text-4xl self-baseline font-bold mb-5">
            Fazer Login
          </h2>
          <p className="text-xl text-center">
            Para acessar a plataforma e gerenciar os editais, faça o login abaixo!
          </p>
        </div>

        <form
          onSubmit={handleSubmit(logar)}
          className="flex flex-col gap-4 font-medium text-lg 2xl:text-xl"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-xl">Email</Label>
            <Input
              id="email"
              {...register("email")}
              type="text"
              className="bg-branco rounded-md border-gray-300 border py-2 px-2"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="senha" className="text-xl">Senha</Label>
            <Input
              id="senha"
              {...register("senha")}
              type="password"
              className="bg-branco rounded-md border-gray-300 border py-2 px-2"
            />
            {errors.senha && (
              <span className="text-red-500 text-sm">
                {errors.senha.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="bg-vermelho hover:bg-red-800 text-branco rounded-md cursor-pointer py-2 px-4"
          >
            <span className="text-xl">Entrar</span>
          </button>
          
          <div className="flex justify-between">
            <a
              href="#"
              className="hover:cursor-pointer hover:underline text-sm"
            >
              Esqueci a senha
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
