"use client";

import BotaoCancelar from "@/components/botoes/BotaoCancelar";
import BotaoSalvar from "@/components/botoes/BotaoSalvar";
import RotuloOpcional from "@/components/RotuloOpcional";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Unidade } from "@/core/unidade";
import { UsuarioUnidade } from "@/core/usuario";
import useUsuario from "@/data/hooks/useUsuario";
import { formatarData } from "@/lib/utils";
import { getUnidadePorId } from "@/service/unidade";
import { atualizarInfoUsuarioService, trocarSenhaService } from "@/service/usuario";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPassword } from "@tabler/icons-react";
import { User, Mail, Shield, LogOut, Pencil, Phone, Info } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z, { set } from "zod";

const schemaUsuario = z.object({
  nome: z.string().min(4, "O nome de usuário é obrigatório"),
  telefone: z.string().min(11, "O telefone é obrigatório"),
  email: z.string().min(1, "O email é obrigatório")
})

const schemaTrocarSenha = z.object({
  senhaAntiga: z.string().min(8, "Digite sua senha antiga"),
  senhaAtual: z.string(),
  confirmarSenha: z.string().min(8, "Senhas não coincidem"),
})

export default function MeuPerfil() {
  const { usuario } = useUsuario();

  type formTrocarSenha = z.infer<typeof schemaTrocarSenha>;
  const {
    register: registerTrocarSenha,
    handleSubmit: handleSubmitTrocarSenha,
    watch: watchSenhaAtual,
    reset: resetTrocarSenha,
    formState: { errors: errorsTrocarSenha },
    setError,
  } = useForm<formTrocarSenha>({
    resolver: zodResolver(schemaTrocarSenha),
  });

  type formData = z.infer<typeof schemaUsuario>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<formData>({
    resolver: zodResolver(schemaUsuario),
    defaultValues: {
      nome: usuario?.username ?? "",
      telefone: usuario?.phone_number ?? "",
      email: usuario?.email ?? "",
    }
  });

  const [unidade, setUnidade] = useState<Unidade | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [openAlterarSenha, setOpenAlterarSenha] = useState<boolean>(false);
  const [openEditarInfo, setOpenEditarInfo] = useState<boolean>(false);

  useEffect(() => {
    buscarUnidade();
  }, []);

  async function buscarUnidade() {
    try {
      const u = await getUnidadePorId(usuario?.unit_id);
      if (!u) throw new Error();
      setUnidade(u);
    } catch {
      toast.error("Erro ao buscar unidade");
    } finally {
      setCarregando(false);
    }
  }

  function traduzirCargo() {
    switch (usuario?.access_level) {
      case "ADMIN": return "Administrador";
      case "ANALYST": return "Analista";
      default: return "Auditor";
    }
  }

  async function trocarSenha(formData: formTrocarSenha) {

    if (formData.senhaAtual.length < 8) {
      return;
    }

    if (formData.senhaAtual !== formData.confirmarSenha) {
      setError("confirmarSenha", { message: "Senhas não coincidem" });
      return;
    }

    const res = await trocarSenhaService(usuario?.id, formData.senhaAntiga, formData.senhaAtual);

    if (res !== 200) {
      toast.error("Senha atual inválida!");
      return
    }

    toast.success("Senha alterada com sucesso!");
    setOpenAlterarSenha(false);
  }

  async function salvarDadosUsuario(formData: formData) {
    
    const usuarioModificado: UsuarioUnidade = {
      ...usuario,
      id: usuario?.id,
      username: formData.nome,
      phone_number: formData.telefone,
      email: formData.email,
      unit_id: unidade?.id,
      access_level: usuario?.access_level,
    }

    const res = await atualizarInfoUsuarioService(usuarioModificado);

    if (res !== 200) {
      toast.error("Erro ao atualizar usuário!");
      return
    }

    toast.success("Dados atualizados com sucesso!");
    setOpenEditarInfo(false);
  }

  const senhaAtual = watchSenhaAtual("senhaAtual", "");

  const regrasDeSenha = {
    tamanho_min_8: senhaAtual.length >= 8,
    numeros: /\d/.test(senhaAtual),
    maiusculas_minusculas:
      /[A-Z]/.test(senhaAtual) && /[a-z]/.test(senhaAtual),
  };


  type RegrasSenha = {
    maiusculas_minusculas: boolean;
    numeros: boolean;
    tamanho_min_8: boolean;
  };

  const [regrasSenhas, setRegrasSenhas] = useState<RegrasSenha>({
    maiusculas_minusculas: false,
    numeros: false,
    tamanho_min_8: false,
  });


  return (
    <div className="flex flex-col gap-8 w-full">

      <div className="flex items-center justify-between pb-4">
        <h2 className="text-4xl font-bold">Meu perfil</h2>
        <span className="text-sm text-zinc-500">ID do usuário: {usuario?.id}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        <div className="border rounded-md p-6 flex flex-col items-center gap-4">
          {usuario?.icon ? (
            <Image
              src={usuario.icon.filepath}
              alt="Minha foto"
              width={160}
              height={160}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-40 h-40 bg-zinc-400 rounded-full">
              <User color="white" size={80} />
            </div>
          )}

          <div className="text-center">
            <p className="text-2xl font-bold">{usuario?.username}</p>
            <p className="text-sm text-zinc-500">{traduzirCargo()}</p>
          </div>

          {/* Ações futuras */}
          <div className="flex items-center gap-2">
            <Dialog open={openEditarInfo} onOpenChange={setOpenEditarInfo}>
              <div className="flex gap-3 mt-2">
                <DialogTrigger asChild>
                  <button className="flex items-center gap-2 text-sm px-4 py-2 border rounded hover:bg-zinc-100 hover:cursor-pointer">
                    <Pencil size={16} />
                    Editar perfil
                  </button>
                </DialogTrigger>
              </div>
            
              <DialogContent onCloseAutoFocus={() => reset()} className="w-[50%]">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold">Editar perfil</DialogTitle>
                  <div className="flex items-center gap-2">
                    <DialogDescription className="text-lg">
                      Edite seus dados pessoais
                    </DialogDescription>
                    <div className="flex items-center w-fit px-4 py-2 rounded-md gap-2 bg-zinc-300">
                      <Info  size={16} />
                      <p className="text-[14px]">Para modificar seus dados, altere os campos desejados e clique em salvar</p>
                    </div>
                  </div>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                  <p className="text-lg">Imagem de perfil</p>
            
                  <div className="relative w-full h-fit border border-zinc-300 rounded-md">
                    <div className="">
                      {
                        !usuario?.id ? (
                          <p>tem foto</p>
                        ) : (
                          <div className="flex justify-center w-full relative">
                            <div className="w-full bg-zinc-200 rounded-md" title="Enviar foto de perfil">
                              <FileUpload />
                            </div>
                          </div>
                        )
                      }
            
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="nome" className="text-lg">Nome do usuário</Label>
                    <Input
                        {...register("nome")}
                        type="text"
                        id="nome"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="telefone" className="text-md">Telefone</Label>
                    <Input
                      {...register("telefone")}
                      type="text"
                      id="telefone"
                      className="border-2 border-gray-300 rounded-md p-2 w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="email" className="text-lg">E-mail</Label>
                    <Input
                      {...register("email")}
                      type="text"
                      id="email"
                      className="border-2 border-gray-300 rounded-md p-2 w-full"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose>
                    <BotaoCancelar />
                  </DialogClose>
                  <BotaoSalvar onClick={handleSubmit(salvarDadosUsuario)} />
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={openAlterarSenha} onOpenChange={setOpenAlterarSenha}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 mt-2 text-sm px-4 py-2 border h-fit rounded hover:bg-zinc-100 hover:cursor-pointer">
                  <IconPassword size={16} />
                  Alterar senha
                </button>
              </DialogTrigger>

              <DialogContent onCloseAutoFocus={() => resetTrocarSenha()} className="w-[30%]">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold">Alterar senha</DialogTitle>
                  <DialogDescription className="text-lg">
                    Altere sua senha
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="senha" className="text-lg">Senha atual</Label>
                    <Input
                      {...registerTrocarSenha("senhaAntiga")}
                      type="password"
                      className="border-2 border-gray-300 rounded-md p-2 w-full"
                    />

                    {errorsTrocarSenha.senhaAntiga && (
                      <span className="text-red-500 text-sm italic">
                        {errorsTrocarSenha.senhaAntiga.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <Label htmlFor="senha" className="text-lg">Nova senha</Label>
                    <Input
                      {...registerTrocarSenha("senhaAtual")}
                      type="password"
                      className="border-2 border-gray-300 rounded-md p-2 w-full"
                    />

                    <div>
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

                    {errorsTrocarSenha.senhaAtual && (
                      <span className="text-red-500 text-sm italic">
                        {errorsTrocarSenha.senhaAtual.message}
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
                  <BotaoSalvar onClick={handleSubmitTrocarSenha(trocarSenha)} />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="border rounded-md p-6 flex flex-col gap-4">

          <h3 className="text-xl font-semibold mb-2">Informações da conta</h3>

          <div className="flex items-center gap-3">
            <Phone size={18} />
            <span>{usuario?.phone_number}</span>
          </div>

          <div className="flex items-center gap-3">
            <Mail size={18} />
            <span>{usuario?.email ?? "E-mail não informado"}</span>
          </div>

          <div className="flex items-center gap-3">
            <Shield size={18} />
            <span>Nível de acesso: {traduzirCargo()}</span>
          </div>

          <div className="flex items-center gap-3">
            <span>
              Usuário desde: <strong>{formatarData(usuario?.created_at)}</strong>
            </span>
          </div>

          <hr className="my-2" />

          <h3 className="text-xl font-semibold">Vínculo institucional</h3>

          {carregando ? (
            <p className="animate-pulse text-zinc-500">Carregando unidade...</p>
          ) : (
            <p>
              Unidade vinculada:{" "}
              <strong>{unidade?.name ?? "Não informada"}</strong>
            </p>
          )}
        </div>

      </div>

      {/* AÇÕES GERAIS */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-50">
          <LogOut size={18} />
          Sair da conta
        </button>
      </div>

    </div>
  );
}