"use client";

import BotaoCancelar from "@/components/botoes/BotaoCancelar";
import BotaoSalvar from "@/components/botoes/BotaoSalvar";
import RotuloOpcional from "@/components/RotuloOpcional";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Unidade } from "@/core/unidade";
import useUsuario from "@/data/hooks/useUsuario";
import { formatarData } from "@/lib/utils";
import { getUnidadePorId } from "@/service/unidade";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Shield, LogOut, Pencil, Phone, Info } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const schemaUsuario = z.object({
  nome: z.string().min(4, "O nome de usuário é obrigatório"),
  telefone: z.string().min(11, "O telefone é obrigatório"),
  email: z.string().min(1, "O email é obrigatório"),
  senha: z.string().min(6, "A senha é obrigatória"),
})

export default function MeuPerfil() {
  const { usuario } = useUsuario();

  type formData = z.infer<typeof schemaUsuario>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>({
    resolver: zodResolver(schemaUsuario),
    defaultValues: {
      nome: usuario?.username ?? "",
      telefone: usuario?.phone_number ?? "",
      email: usuario?.email ?? "",
      senha: "",
    }
  });

  const [unidade, setUnidade] = useState<Unidade | null>(null);
  const [carregando, setCarregando] = useState(true);

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

  function salvarDadosUsuario() {

  }

  return (
    <div className="flex flex-col gap-8 w-full">

      <div className="flex items-center justify-between pb-4">
        <h2 className="text-4xl font-bold">Meu perfil</h2>
        <span className="text-sm text-zinc-500">ID: {usuario?.id}</span>
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
          <Dialog>
            <div className="flex gap-3 mt-2">
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 text-sm px-4 py-2 border rounded hover:bg-zinc-100 hover:cursor-pointer">
                  <Pencil size={16} />
                  Editar perfil
                </button>
              </DialogTrigger>
            </div>
            
            <DialogContent className="w-[50%]">
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

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2"><Label htmlFor="senha" className="text-lg">Senha</Label> <RotuloOpcional texto="preencha este campo com a nova senha, caso queira alterá-la" /></div>
                  <Input
                    {...register("senha")}
                    type="password"
                    id="senha"
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
