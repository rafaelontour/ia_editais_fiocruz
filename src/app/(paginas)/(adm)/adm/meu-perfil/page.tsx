"use client";

import BotaoCancelar from "@/components/botoes/BotaoCancelar";
import BotaoSalvar from "@/components/botoes/BotaoSalvar";
import RotuloOpcional from "@/components/RotuloOpcional";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Unidade } from "@/core/unidade";
import { UsuarioUnidade } from "@/core/usuario";
import useUsuario from "@/data/hooks/useUsuario";
import { formatarData } from "@/lib/utils";
import { getUnidadePorId } from "@/service/unidade";
import { adicionarFotoPerfilService, atualizarFotoDePerfilService, atualizarInfoUsuarioService, excluirFotoDePerfilService, trocarSenhaService } from "@/service/usuario";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconBrandWhatsapp, IconPassword } from "@tabler/icons-react";
import { url } from "inspector";
import { User, Mail, Shield, LogOut, Pencil, Phone, Info, X, Trash, ImageIcon, ShieldQuestionIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z, { file, set } from "zod";

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
  const { usuario, deslogar, buscarDadosAtualizados } = useUsuario();
  const router = useRouter()

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
    reset,
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
  const [previaImagem, setPreviaImagem] = useState<string | null>(null);
  const [imagem, setImagem] = useState<File | null>(null);
  const urlBase = process.env.NEXT_PUBLIC_URL_BASE
  const [atualizarImagemPerfil, setAtualizarImagemPerfil] = useState<boolean>(false);
  const [adicionouImagemPerfil, setAdicionouImagemPerfil] = useState<boolean>(false);

  useEffect(() => {
    if (!usuario) return;

    reset({
      nome: usuario.username ?? "",
      telefone: usuario.phone_number ?? "",
      email: usuario.email ?? "",
    });
  }, [usuario, reset]);


  useEffect(() => {
    if (usuario?.icon?.file_path) setPreviaImagem(`${urlBase}/${usuario.icon.file_path}`);
    buscarUnidade();
  }, []);

  useEffect(() => {
    if (!usuario) return;

    if (usuario.icon?.file_path) {
      setPreviaImagem(`${urlBase}/${usuario.icon.file_path}`);
    } else {
      setPreviaImagem(null);
    }
  }, [usuario]);

  useEffect(() => {
    if (openEditarInfo) {
      setAtualizarImagemPerfil(false);
      setImagem(null);
    }
  }, [openEditarInfo]);


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

    const res = await atualizarInfoUsuarioService(usuarioModificado);  // Atualizar informações gerais

    if (res !== 200) {
      toast.error("Erro ao atualizar usuário!");
      return
    }

    await buscarDadosAtualizados()
    toast.success("Dados atualizados com sucesso!");
    setOpenEditarInfo(false);
  }

  async function excluirFotoDePerfil() {

    const res = await excluirFotoDePerfilService(usuario?.id);

    if (res !== 200) {
      toast.error("Erro ao excluir foto de perfil!");
      return
    }

    buscarDadosAtualizados()
    toast.success("Foto de perfil excluída com sucesso!");
  }

  async function mostrarImagem(e: React.ChangeEvent<HTMLInputElement>) {

    setAdicionouImagemPerfil(true);

    if (!e.target.files) return;
    setImagem(e.target.files?.[0]);
    const arquivo = e.target.files?.[0];

    setPreviaImagem(URL.createObjectURL(arquivo));
  }

  async function adicionarFotoDePerfil() {
    const dados: FormData = new FormData();
    if (!imagem) return
    dados.append("file", imagem);

    const res2 = await adicionarFotoPerfilService(usuario?.id, dados)
  
    if (res2 !== 200) {
      toast.error("Erro ao adicionar foto de perfil!");
    } else {
      toast.success("Foto de perfil atualizada com sucesso!");
    }

    buscarDadosAtualizados()
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
          
          {
            (atualizarImagemPerfil || adicionouImagemPerfil) && (
              <div className="flex items-center gap-2">
                <Info size={16} />
                <p>Clique em salvar para manter a alteração</p>
              </div>
            )
          }

          {usuario?.icon?.file_path !== undefined ? (
            <div className="relative rounded-full overflow-hidden">
              <img
                src={urlBase + usuario?.icon?.file_path}
                alt="Minha foto"
                className="object-cover h-52 w-52"
              />

              <div 
                className="
                  absolute flex not-odd:items-center justify-center
                  top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
                  bg-zinc-100 opacity-0 hover:opacity-70 w-full h-full z-10
                  
                "
              >
                
                <div className="flex flex-col gap-2">
                  <Button
                    className="hover:cursor-pointer "
                    variant={"destructive"}
                    onClick={() => excluirFotoDePerfil()}
                  >
                    <Trash size={16} />
                    <p>Remover foto</p>
                  </Button>

                  <Button>
                    <ImageIcon size={16} />
                    <p>Alterar foto</p>
                  </Button>
                  
                </div>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden flex items-center justify-center w-52 h-52 bg-zinc-400 rounded-full">

              {
                previaImagem ? (
                  <img
                    src={previaImagem}
                    alt="Minha foto"
                    className="rounded-full object-cover h-52 w-52"
                  />

                ) : (
                  <User color="white" size={80} />
                )
              }
              <div 
                className="
                  absolute flex not-odd:items-center justify-center
                  top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
                  bg-zinc-100 opacity-0 hover:opacity-70 w-full h-full z-10
                "
              >
                
                <div className="flex flex-col gap-2">

                  {
                    previaImagem ? (
                      <div className="flex flex-col gap-2">
                        <Button
                          className="hover:cursor-pointer "
                          variant={"destructive"}
                          onClick={() => {
                            if (!adicionouImagemPerfil) excluirFotoDePerfil();
                            setPreviaImagem(null);
                            setAtualizarImagemPerfil(false) 
                          }}
                        >
                          <Trash size={16} />
                          <p>Remover foto</p>
                        </Button>

                        <Button>
                          <ImageIcon size={16} />
                          <p>Alterar foto</p>
                        </Button>
                        
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <div className="flex items-center gap-2 ">
                          <ImageIcon size={16} />
                          <p>Enviar foto</p>
                          <input
                            className="hidden"
                            type="file"
                            accept="image/*"
                            onChange={(e) => mostrarImagem(e)}
                          />
                        </div>
                      </label>

                    )
                  } 
                </div>

              </div>
            </div>
          )}

          {
            previaImagem && adicionouImagemPerfil && (
                <Button
                  className="cursor-pointer bg-green-400"
                  onClick={() => { adicionarFotoDePerfil(); setAdicionouImagemPerfil(false); setAtualizarImagemPerfil(false) }}
                >
                  Salvar
                </Button>
            )
          }

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
                    Editar informações
                  </button>
                </DialogTrigger>
              </div>
            
              <DialogContent
                onCloseAutoFocus={() => { 
                  reset();
                }}
                className="w-[50%]"
              >
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

          <div className="flex flex-col gap-4 border p-4 rounded-md">
            <div className="flex items-center gap-4">
              <Info className="text-verde" size={38} />
              <p>Este número é usado para notificá-lo sobre os editais. Mantenha-o atualizado para receber as notificações.</p>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <IconBrandWhatsapp size={18} />
                <span>{usuario?.phone_number}</span>
              </div>

              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger>
                    <ShieldQuestionIcon size={20} />
                  </TooltipTrigger>
                  <TooltipContent className="text-md mr-6">
                    <p>Ao clicar em "Testar número", se você receber uma mensagem no WhatsApp, está tudo certo.<br /> Caso contrário, altere em "Editar informações" para ser notificado via mensagem sobre os editais.</p>
                  </TooltipContent>
                </Tooltip>

                <Button className="ml-2 hover:cursor-pointer">
                  Testar número
                </Button>

              </div>
              
            </div>
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

      {/* Botão de sair da conta */}
      <div className="flex justify-end">
        <button
          className="flex items-center gap-2 text-red-600 hover:cursor-pointer border border-red-600 px-4 py-2 rounded hover:bg-red-50"
          onClick={() => { deslogar(); router.push("/"); }}
        >
          <LogOut size={18} />
          Sair da conta
        </button>
      </div>

    </div>
  );
}