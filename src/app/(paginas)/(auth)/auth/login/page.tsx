"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { enviarCodigoWhatsAppService, getToken, mandarEmailParaRecuperarSenhaService } from "@/service/auth"
import { useRouter } from "next/navigation"
import useUsuario from "@/data/hooks/useUsuario"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { toast } from 'sonner';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Send } from "lucide-react"
import { useRef, useState } from "react"
import BotaoCancelar from "@/components/botoes/BotaoCancelar"
import BotaoSalvar from "@/components/botoes/BotaoSalvar"


const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Campo obrigatório!"),
  senha: z
    .string()
    .min(3, "Campo obrigatório!"),
})

const schemaTrocarSenha = z.object({
  senha: z.string(),
  confirmarSenha: z.string(),
})

const schemaEmailTrocarSenha = z.object({
  email: z
    .string()
    .min(1, "O email é obrigatório!"),
})


type LoginFormData = z.infer<typeof loginSchema>
type formTrocarSenha = z.infer<typeof schemaTrocarSenha>;
type emailTrocarSenha = z.infer<typeof schemaEmailTrocarSenha>;

export default function Login() {

  const { logarUsuario } = useUsuario()
  const [carregando, setCarregando] = useState<boolean>(false)
  const [codigo, setCodigo] = useState<string[]>(["", "", "", "", "", ""])
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const [digitandoEmail, setDigitandoEmail] = useState<boolean>(false)
  const [esqueceuSenha, setEsqueceuSenha] = useState<boolean>(false)
  const [trocarSenha, setTrocarSenha] = useState<boolean>(false)

  const [emailTrocarSenha, setEmailTrocarSenha] = useState<string>("")

  const router = useRouter()
  
  const {
    register: registerTrocarSenha,
    handleSubmit: handleSubmitTrocarSenha,
    watch: watchSenhaNova,
    reset: resetTrocarSenha,
    formState: { errors: errorsTrocarSenha },
    setError: setErrorTrocarSenha
  } = useForm<formTrocarSenha>({
    resolver: zodResolver(schemaTrocarSenha),
    defaultValues: {
      senha: "",
      confirmarSenha: "",
    }
  });
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const {
    register: registerEmailTrocarSenha,
    handleSubmit: handleSubmitEmailTrocarSenha,
    formState: { errors: errorsEmailTrocarSenha },
    reset: reserEmailTrocarSenha
  } = useForm<emailTrocarSenha>({
    resolver: zodResolver(schemaEmailTrocarSenha),
  });

  const senhaNova = watchSenhaNova("senha", "");

  const regrasDeSenha = {
    tamanho_min_8: senhaNova.length >= 8,
    numeros: /\d/.test(senhaNova),
    maiusculas_minusculas:
      /[A-Z]/.test(senhaNova) && /[a-z]/.test(senhaNova),
  };
  
  async function logar(data: LoginFormData) {
    try {
      
      const formData = new FormData();
      formData.append("username", data.email)
      formData.append("password", data.senha)
      const token = await getToken(formData)

      if (!token) {
        toast.error("Email ou senha inválidos")
        return
      }

      // const [ dados, status ] = await getUsuarioLogado()

      // if (status == 401) {
      //   toast.error("Erro ao fazer login! Credenciais inválidas.")
      //   return
      // }

      logarUsuario()
      toast.success("Login efetuado com sucesso!")

      router.push("/adm")
      
    } catch(e: any) {
      toast.error("Erro ao efetuar login!")
    }  
  }

  function handleChange(valor: string, index: number) {
    if (!/^\d?$/.test(valor)) return // só números (0-9)

    const novoCodigo = [...codigo]
    novoCodigo[index] = valor
    setCodigo(novoCodigo)

    // vai para o próximo input automaticamente
    if (valor && index < 3) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) {
    if (e.key === "Backspace" && !codigo[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  async function alterarSenha(formData: formTrocarSenha) {

    setCarregando(true)

    if (regrasDeSenha.tamanho_min_8 === false || regrasDeSenha.numeros === false || regrasDeSenha.maiusculas_minusculas === false) {
      setErrorTrocarSenha("senha", { message: "Siga as instruções para criação de senha acima" });
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setErrorTrocarSenha("confirmarSenha", { message: "Senhas não coincidem" });
      return;
    }

    const res = await enviarCodigoWhatsAppService(emailTrocarSenha, inputsRef.current.map((input) => input?.value).join(""), formData.senha);

    if (res === 400) {
      toast.error("Código inválido!");
      return
    }

    toast.success("Senha alterada com sucesso!");
    setTrocarSenha(false);
  }

  async function digitouEmail(formDataEmail: emailTrocarSenha) {
    setEmailTrocarSenha(formDataEmail.email)
    setCarregando(true)

    const res = await mandarEmailParaRecuperarSenhaService(formDataEmail.email)

    console.log(res)

    if (res !== 200) {
      toast.error("Email inválido!");
      setCarregando(false)
      return
    }


    setDigitandoEmail(false)
    setTimeout(() => {
      setEsqueceuSenha(true)
    }, 500)
  }

  async function digitouCodigo() {
    setCarregando(true)

    const codigo = inputsRef.current.map((input) => input?.value).join("")
    
    if (codigo.length !== 4) {
      toast.error("Digite o código completo!")
      setCarregando(false)
      return
    }

    setEsqueceuSenha(false)
    setTimeout(() => {
      setTrocarSenha(true)
    }, 500)
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
              type="email"
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
            id="login"
            type="submit"
            className="bg-vermelho hover:bg-red-800 text-branco rounded-md cursor-pointer py-2 px-4"
          >
            <span className="text-xl">Entrar</span>
          </button>
          
          <div className="flex justify-between">
            <Dialog open={digitandoEmail} onOpenChange={setDigitandoEmail}>
              <DialogTrigger onClick={() => setDigitandoEmail(true)}>
                <p
                  className="hover:cursor-pointer hover:underline text-sm"
                >
                  Esqueci a senha
                </p>
              </DialogTrigger>
              
              <DialogContent
                onCloseAutoFocus={() => {
                  setCarregando(false)
                  reserEmailTrocarSenha() 
                }}
              >
                <DialogHeader>
                  <DialogTitle className="text-2xl">Redefinir senha</DialogTitle>

                  <DialogDescription></DialogDescription>
                </DialogHeader>

                <p>Informe seu email abaixo:</p>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="text-xl">Email</Label>
                  <Input
                    disabled={carregando}
                    {...registerEmailTrocarSenha("email")}
                    type="email"
                    className="bg-branco rounded-md border-gray-300 border py-2 px-2"
                  />
                  {errorsEmailTrocarSenha.email && (
                    <span className="text-red-500 text-sm">
                      {errorsEmailTrocarSenha.email.message}
                    </span>
                  )}
                </div>

                <Button
                  disabled={carregando}
                  onClick={
                    handleSubmitEmailTrocarSenha(digitouEmail)
                  }
                  className="flex items-center p-2 cursor-pointer"
                  type="button"
                >
                  {
                    carregando ? (
                      <>
                          <Loader2 size={16} className="animate-spin" />
                      </>
                    ) : (
                      <>
                          <Send size={16} />
                      </>
                    )
                  }
                  <span className="ml-2">Enviar</span>
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </form>

        <Dialog open={esqueceuSenha} onOpenChange={setEsqueceuSenha}>
          <DialogTrigger onClick={() => setEsqueceuSenha(true)}>
            <p
              className="hover:cursor-pointer hover:underline text-sm"
            >
              
            </p>
          </DialogTrigger>
          
          <DialogContent
            onCloseAutoFocus={() => {
              setCarregando(false)
              setCodigo(["", "", "", ""])
            }}
          >
            <DialogHeader>
              <DialogTitle className="text-2xl">Redefinir senha</DialogTitle>

              <DialogDescription></DialogDescription>
            </DialogHeader>

            <p>Insira abaixo o código que você recebeu no seu Whatsapp</p>

            <div className="w-full flex justify-center gap-4">
              {codigo.map((valor, index) => (
                <input
                  disabled={carregando}
                  key={index}
                  ref={(el) => { inputsRef.current[index] = el }}
                  value={valor}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  maxLength={1}
                  inputMode="numeric"
                  className="w-10 h-12 text-center text-xl border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-verde"
                />
              ))}
            </div>

            <Button
              disabled={carregando}
              onClick={() => {
                digitouCodigo()
              }}
              className="flex items-center p-2 cursor-pointer"
              type="button"
            >
              {
                carregando && (
                  <>
                      <Loader2 size={16} className="animate-spin" />
                  </>
                )
              }
              <span className="ml-2">Próximo</span>
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog open={trocarSenha} onOpenChange={setTrocarSenha}>

          <DialogContent
            onCloseAutoFocus={() => { 
              setCodigo(["", "", "", ""])
              setCarregando(false)
              setEmailTrocarSenha("")
            }}
            className="p-8"
          >
            <DialogHeader>
              <DialogTitle className="text-2xl">Redefina a senha</DialogTitle>

              <DialogDescription></DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3">

              <div className="flex flex-col gap-3">
                <Label htmlFor="senha" className="text-lg">Nova senha</Label>
                <Input
                  {...registerTrocarSenha("senha")}
                  type="password"
                  className="border-2 border-gray-300 rounded-md p-2 w-full"
                />

                <div>
                  <p
                    className={
                      `transition-all duration-200 ${regrasDeSenha.tamanho_min_8 ? "text-green-800" : "text-red-500"}
                    `}
                  >
                    A senha deve conter pelo menos 8 caracteres
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

                {errorsTrocarSenha.senha && (
                  <span className="text-red-500 text-sm italic">
                    {errorsTrocarSenha.senha.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="senha" className="text-lg">Confirmar nova senha</Label>
                <Input
                  {...registerTrocarSenha("confirmarSenha")}
                  type="password"
                  className="border-2 border-gray-300 rounded-md p-2 w-full"
                />

                {errorsTrocarSenha.confirmarSenha && (
                  <span className="text-red-500 text-sm italic">
                    {errorsTrocarSenha.confirmarSenha.message}
                  </span>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose>
                <BotaoCancelar />
              </DialogClose>

              <BotaoSalvar rotulo="Redefinir" onClick={handleSubmitTrocarSenha(alterarSenha)} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}