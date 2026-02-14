"use client"

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Unidade } from "@/core/unidade"
import { UsuarioUnidade } from "@/core/usuario"
import { getTodasUnidades } from "@/service/unidade"
import { adicionarUsuarioService } from "@/service/usuario"
import { zodResolver } from "@hookform/resolvers/zod"
import { Info } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const cadastroSchema = z.object({
    nomeCompleto: z.string().min(3, "O nome de usuário é obrigatório"),
    email: z.string().min(7, "O email é obrigatório"),
    senha: z.string(),
    whatsapp: z.string().min(11, "O número de WhatsAapp é obrigatório"),
    unidade: z.string().min(1, "Selecione pelo menos uma unidade"),
})
export default function Cadastro() {

    type formData = z.infer<typeof cadastroSchema>

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        setError,
        watch,
    } = useForm<formData>({
        resolver: zodResolver(cadastroSchema),
        defaultValues: {
            unidade: "",
        }
    })

    const [unidades, setUnidades] = useState<Unidade[]>([])
    const [confirmarSenha, setConfirmarSenha] = useState<string>("")
    const router = useRouter()

    async function buscarUnidades() {
        const unidades = await getTodasUnidades()
        setUnidades(unidades)
    }

    useEffect(() => {
        buscarUnidades()
    }, [])

    const senha = watch("senha", "");

    const regrasDeSenha = {
        tamanho_min_8: senha.length >= 8,
        numeros: /\d/.test(senha),
        maiusculas_minusculas:
        /[A-Z]/.test(senha) && /[a-z]/.test(senha),
    };

    async function cadastrarUsuario(formData: formData) {

        if (formData.senha.length < 8) {
            toast.info("Siga as instruções para criação de senha");
        }

        if (formData.senha !== confirmarSenha) {
            setError("senha", { message: "Senhas não coincidem" });
            return;
        }

        const usuario: UsuarioUnidade = {
            username: formData.nomeCompleto,
            email: formData.email,
            phone_number: formData.whatsapp,
            access_level: "DEFAULT",
            password: formData.senha,
            unit_id: formData.unidade,
        }

        const res = await adicionarUsuarioService(usuario, true);

        if (res !== 201) {
            toast.error("Erro ao cadastrar usuário!");
            return
        }
        toast.success("Usuário cadastrado com sucesso!");
        setTimeout(() => {
            router.push("/auth/login")
        }, 2000)

    }

    return(
        <div className="flex items-center bg-gray-100 h-full justify-center">
            <div className="w-[80%] flex flex-col gap-4 2xl:gap-4">

                <div className="w-full flex flex-col items-center gap-2">
                    <h2 className="text-cinza text-4xl font-bold">Criar Conta</h2>
                    <p className="text-xl">Preencha os dados abaixo para criar sua conta</p>
                </div>

                <div className="flex flex-row items-center gap-4">
                    <hr className="bg-gray-800 w-1/2" />
                    
                    <hr className="bg-gray-800  w-1/2" />
                </div>

                <form onSubmit={handleSubmit(cadastrarUsuario)} className="flex flex-col gap-4 font-medium  text-lg 2xl:text-xl">
                    <label htmlFor="nome" className="flex flex-col gap-2">
                        <p className="text-[18px]">Nome Completo</p>

                        <input {...register("nomeCompleto")} type="text" className="bg-branco rounded-md border-gray-300 border py-2 px-4"/>
                        { errors.nomeCompleto && <span className="text-red-500 text-sm italic">{errors.nomeCompleto.message}</span>}
                    </label>

                    <div className="flex flex-col gap-2">
                        <p className="text-[18px]">Unidade</p>
                        <Controller 
                            name="unidade"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={(value) => {
                                        field.onChange(value)
                                        
                                    }}
                                >
                                    <SelectTrigger className="w-full bg-white p-4">
                                        <SelectValue placeholder="Selecione uma unidade" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Unidades</SelectLabel>

                                            {
                                                unidades.map((unidade) => (
                                                    <SelectItem className="hover:cursor-pointer" key={unidade.id} value={unidade.id}>{unidade.name}</SelectItem>
                                                ))
                                            }

                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )}
                        />

                        { errors.unidade && <span className="text-red-500 text-sm italic">{errors.unidade.message}</span>}
                    </div>

                    <div className="flex items-center gap-4">
                        <label htmlFor="email" className="flex w-1/2 flex-col  gap-2">
                            <p className="text-[18px]">Email</p>
                            <input {...register("email")} type="text" className="bg-branco w-full rounded-md border-gray-300 border py-2 px-2"/>
                            { errors.email && <span className="text-red-500 text-sm italic">{errors.email.message}</span>}
                        </label>

                        <div className="w-1/2 flex gap-4">
                            <label htmlFor="senha" className="flex flex-col gap-2 w-full">
                                <div className="flex items-center gap-2 w-full">
                                    <p className="text-[18px]">Número do WhatsApp</p>
                                    <Tooltip>
                                    <TooltipTrigger>
                                        <Info size={16} />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        O WhastApp será usado para notificá-lo sobre o estado dos editais.
                                    </TooltipContent>
                                </Tooltip>
                                </div>
                                <input {...register("whatsapp")} type="text" className="bg-branco w-full rounded-md border-gray-300 border py-2 px-2" />
                                { errors.whatsapp && <span className="text-red-500 text-sm italic">{errors.whatsapp.message}</span>}
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <label htmlFor="senha" className="flex flex-col w-full gap-2">
                            <p className="text-[18px]">Senha</p>
                            <input {...register("senha")} name="senha" type="password" className="bg-branco rounded-md border-gray-300 border py-2 px-2 w-full" />
                        </label>

                        <label htmlFor="confirmar_senha" className="flex flex-col w-full gap-2">
                            <p className="text-[18px]">Confirmar senha</p>
                            <input onChange={(e) => setConfirmarSenha(e.target.value)} name="confirmar_senha" type="password" className="bg-branco rounded-md border-gray-300 border py-2 px-2 w-full" />
                            {
                                errors.senha && <span className="text-red-500 text-sm italic">{errors.senha.message}</span>
                            }
                        </label>
                    </div>

                    <div className="text-sm">
                      <p
                        className={
                          `transition-all duration-200 ${regrasDeSenha.tamanho_min_8 ? "text-green-800" : "text-red-500"}
                        `}
                      >
                        A senha de conter pelo menos 8 caracteres
                      </p>

                      <p
                        className={`
                          transition-all duration-200 ${regrasDeSenha.maiusculas_minusculas ? "text-green-800" : "text-red-500"}
                        `}
                      >
                        A senha deve conter letras maiúsculas e minúsculas
                      </p>
                      
                      <p
                        className={`
                          transition-all duration-200 ${regrasDeSenha.numeros ? "text-green-800" : "text-red-500"}
                        `}
                      >
                        A senha deve ter pelo menos um número
                      </p>
                    </div>

                    


                    <button type="submit" className="bg-vermelho text-branco rounded-md px-6 py-3 text-xl hover:cursor-pointer">Criar Conta</button>
                    
                    <div className="flex">
                        <p>Já possui conta?&nbsp;</p>
                        <Link href={"/auth/login"} className="cursor-pointer hover:underline">Fazer login</Link>
                    </div>
                </form>

            </div>
        </div>
    )
}