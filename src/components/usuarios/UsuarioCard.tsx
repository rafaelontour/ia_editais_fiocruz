import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Calendar, PencilLine, Trash, UserPen } from "lucide-react";
import { useState, useEffect } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { UsuarioUnidade } from "@/core/usuario";
import { Unidade } from "@/core/unidade";
import { NivelAcesso } from "@/core/enum/nivelAcessoEnum";

const schemaUsuario = z.object({
  unidade: z.string().min(1, "A unidade é obrigatória"),
  nivelAcesso: z.string().min(1, "O nível de acesso é obrigatório")
});




interface UsuarioCardProps {
  usuario: UsuarioUnidade;
  unidades: Unidade[];
}

export const UsuarioCard = ({ usuario, unidades }: UsuarioCardProps) => {
  type FormData = z.infer<typeof schemaUsuario>;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schemaUsuario)
  });

  const [openDialogEditar, setOpenDialogEditar] = useState(false);
  const [openDialogExcluir, setOpenDialogExcluir] = useState(false);

  useEffect(() => {
    if (openDialogEditar) {
      const unidadeUsuario = unidades.find(u => u.name === usuario.unidade)
      reset({
        unidade: unidadeUsuario?.id ?? "",
        nivelAcesso: usuario.access_level ?? ""
      });
    }
  }, [openDialogEditar, reset, usuario]);

  const onSubmit = (data: FormData) => {
    console.log("Dados para atualizar:", data);
    setOpenDialogEditar(false);
  };

  const excluirUsuario = (id: string) => {
    console.log("Excluir usuário:", id);
    setOpenDialogExcluir(false);
  };

  return (
    <div
      style={{ boxShadow: "0 0 5px rgba(0,0,0,.3)" }}
      className="
        flex flex-col gap-2 rounded-md p-4 mb-4
        transition ease-in-out duration-100
        min-w-[320px]
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
                  <span>{new Date(usuario.created_at).toLocaleString()}</span>
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

              <form onSubmit={handleSubmit(onSubmit)} className="flex text-lg flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="unidade">Unidade</label>
                  <select
                    {...register("unidade")}
                    id="unidade"
                    className="border-2 border-gray-300 rounded-md p-2 w-full"
                  >
                    {unidades.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                  {errors.unidade && (
                    <span className="text-red-500 text-sm italic">{errors.unidade.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="nivelAcesso">Nível de Acesso</label>
                  <select
                    {...register("nivelAcesso")}
                    id="nivelAcesso"
                    className="border-2 border-gray-300 rounded-md p-2 w-full"
                    
                  >
                    {Object.values(NivelAcesso).map((nivel) => (
                      <option key={nivel} value={nivel}>
                        {nivel}
                      </option>
                    ))}
                  </select>
                  {errors.nivelAcesso && (
                    <span className="text-red-500 text-sm italic">{errors.nivelAcesso.message}</span>
                  )}
                </div>

                <div className="flex justify-end gap-4 mt-4">
                  <DialogClose className="transition ease-in-out text-white rounded-md px-3 bg-red-500 hover:cursor-pointer hover:scale-110 active:scale-100">
                    Cancelar
                  </DialogClose>

                  <Button
                    type="submit"
                    className="flex bg-green-500 hover:bg-green-600 text-white hover:cursor-pointer hover:scale-110 active:scale-100"
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
