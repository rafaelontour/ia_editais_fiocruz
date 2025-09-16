import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Calendar, PencilLine, Trash, UserPen } from "lucide-react";
import { useState, useEffect } from "react";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { UsuarioUnidade } from "@/core/usuario";
import { Unidade } from "@/core/unidade";
import { adicionarUsuarioService, atualizarUsuarioService, excluirUsuarioService } from "@/service/usuario";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "sonner";

const schemaUsuario = z.object({
  username: z.string().min(1, "O nome é obrigatório"),
  email: z.string().min(1, "O email é obrigatório"),
  unit_id: z.string().min(1, "A unidade é obrigatória"),
  access_level: z.string().min(1, "O nível de acesso é obrigatório"),
  phone_number: z.string().min(7, "O telefone é obrigatório"),
});

interface UsuarioCardProps {
  usuario: UsuarioUnidade;
  unidades: Unidade[];
  buscarUsuarios: (unidadeId: string | undefined) => Promise<void>;
}

export const UsuarioCard = ({ usuario, unidades, buscarUsuarios }: UsuarioCardProps) => {
  type FormData = z.infer<typeof schemaUsuario>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<FormData>({
    resolver: zodResolver(schemaUsuario),
    defaultValues: {
      username: usuario.username,
      email: usuario.email,
      unit_id: usuario.unit_id ?? "",
      access_level: usuario.access_level ?? "",
      phone_number: usuario.phone_number ?? ""
    }
  });

  const [openDialogEditar, setOpenDialogEditar] = useState(false);
  const [openDialogExcluir, setOpenDialogExcluir] = useState(false);

  useEffect(() => {
    if (openDialogEditar) {
      reset({
        username: usuario.username,
        email: usuario.email,
        unit_id: usuario.unit_id ?? "",
        access_level: usuario.access_level ?? "",
        phone_number: usuario.phone_number ?? ""
    });
    }
  }, [openDialogEditar, reset, usuario]);

  const atualizarUsuario = async (data: FormData) => {
    const resposta =atualizarUsuarioService(data, usuario.id);

    if (await resposta !== 200) {
      toast.error('Não foi possível atualizar o usuário!');
      return
    }
    
    toast.success('Usuário atualizado com sucesso!');
    buscarUsuarios(usuario.unit_id);
    setOpenDialogEditar(false);
  };

  const excluirUsuario = async (id: string) => {
    const resposta = await excluirUsuarioService(id)

    if (resposta !== 204) {
      toast.error('Erro ao excluir usuario')
      return
    }
    
    toast.success('Usuário excluido com sucesso!');
    buscarUsuarios(usuario.unit_id);
    setOpenDialogExcluir(false);
  };

  return (
    <div
      style={{ boxShadow: "0 0 5px rgba(0,0,0,.3)" }}
      className="
        flex flex-col justify-between gap-2 rounded-md p-4 mb-4
        transition ease-in-out duration-100
        min-w-[290px]
      "
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">{usuario.username}</h2>
        <p className="py-1 w-fit break-words text-sm">{usuario.email}</p>
        <p className="py-1 w-fit break-words text-sm">{usuario.access_level}</p>

      </div>

      <div className="flex justify-between items-center mt-3">
        <p className="flex items-center gap-2 text-sm text-gray-400">
          <Calendar size={16} />
            <span className="flex justify-center flex-col">
                <span className="text-[10px] font-semibold mb-[-5px] mt-1">Criado em</span>
                <span>{usuario.created_at}</span>
            </span>
        </p>

        <div className="flex gap-3">
          <Dialog open={openDialogEditar} onOpenChange={setOpenDialogEditar}>
            <DialogTrigger asChild>
              <Button
                title="Editar usuário"
                className="h-8 w-8 hover:cursor-pointer border border-gray-300 rounded-sm bg-white hover:bg-gray-100"
                size="icon"
                onClick={() => setOpenDialogEditar(true)}
              >
                <UserPen color="black" />
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold">Atualizando {usuario.username}</DialogTitle>
                <DialogDescription className="text-md pb-4">
                  Modifique os dados do usuário
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit(atualizarUsuario)} className="flex text-lg flex-col gap-4">

                <div className="flex flex-col gap-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    defaultValue={usuario.username}
                    {...register("username")}
                    id="username"
                    className="border-2 border-gray-300 rounded-md p-2 w-full"
                  />
                  {errors.username && (
                    <span className="text-red-500 text-sm italic">{errors.username.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    defaultValue={usuario.email}
                    {...register("email")}
                    id="email"
                    className="border-2 border-gray-300 rounded-md p-2 w-full"
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm italic">{errors.email.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone_number">WhatsApp</Label>
                  <Input
                    defaultValue={usuario.phone_number}
                    {...register("phone_number")}
                    id="phone_number"
                    className="border-2 border-gray-300 rounded-md p-2 w-full"
                  />
                  {errors.phone_number && (
                    <span className="text-red-500 text-sm italic">{errors.phone_number.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="unidade">Unidade</Label>
                  <Controller
                    name="unit_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione a unidade" />
                          </SelectTrigger>

                          <SelectContent>
                              <SelectGroup>
                                  <SelectLabel>Unidade</SelectLabel>
                                  {unidades.map((unidade) => (
                                    <SelectItem key={unidade.id} value={unidade.id}>
                                      {unidade.name}
                                    </SelectItem>
                                  ))}
                              </SelectGroup>
                          </SelectContent>
                      </Select>
                    )}
                />
                  {errors.unit_id && (
                    <span className="text-red-500 text-sm italic">{errors.unit_id.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="nivelAcesso">Nível de Acesso</ Label>
                  <Controller
                    name="access_level"
                    control={control}
                    render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione o perfil" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Perfil</SelectLabel>
                                  <SelectItem value="DEFAULT">Usuário</SelectItem>
                                  <SelectItem value="ANALYST">Analista</SelectItem>
                                  <SelectItem value="AUDITOR">Auditor</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                />
                  {errors.access_level && (
                    <span className="text-red-500 text-sm italic">{errors.access_level.message}</span>
                  )}
                </div>

                <div className="flex justify-end gap-4 mt-4">
                  <DialogClose asChild>
                    <Button variant="outline" className="cursor-pointer">Cancelar</Button>
                  </DialogClose>

                  <Button
                    variant={"destructive"}
                    className="flex bg-verde hover:bg-green-900 text-white hover:cursor-pointer"
                  >
                    Salvar alterações
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={openDialogExcluir} onOpenChange={setOpenDialogExcluir}>
            <DialogTrigger asChild>
              <Button
                title="Excluir usuário"
                className="h-8 w-8 bg-red-500 hover:bg-red-600 hover:cursor-pointer rounded-sm"
                size="icon"
                onClick={() => setOpenDialogExcluir(true)}
              >
                <Trash />
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Excluir Usuário</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja excluir o usuário <strong>{usuario.username}</strong>?
                </DialogDescription>
              </DialogHeader>

              <div className="flex justify-end gap-4 mt-4">
                <DialogClose className="transition ease-in-out text-black rounded-md px-3 hover:cursor-pointer hover:scale-110 active:scale-100">
                  Cancelar
                </DialogClose>

                <Button
                  className="flex bg-red-500 hover:bg-red-600 text-white hover:cursor-pointer hover:scale-110 active:scale-100"
                  onClick={() => excluirUsuario(usuario.id)}
                >
                  Excluir
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
