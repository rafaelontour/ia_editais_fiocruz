import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Info } from "lucide-react";
import z, { email } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Unidade } from "@/core/unidade";

const usuarioSchema = z.object({
    nome: z.string().min(4, "O nome do usuário é obrigatório"),
    email: z.email("O email é obrigatório"),
    whatsapp: z.string().min(10, "O WhatsAapp é obrigatório"),
    unidade: z.string().min(1, "Selecione uma unidade"),
    perfil: z.string().min(1, "Selecione um perfil"),
})

interface AdicionarUsuarioProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    unidades: Unidade[]
}

export default function AdicionarUsuario({ open, onOpenChange, unidades }: AdicionarUsuarioProps) {
    type UsuarioFormData = z.infer<typeof usuarioSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset
    } = useForm<UsuarioFormData>({
        resolver: zodResolver(usuarioSchema),
        defaultValues: {
            unidade: "",
            perfil: ""
        }
    })

    const [nomeUsuario, setNomeUsuario] = useState<string>("");
    const [emailUsuario, setEmailUsuario] = useState<string>("");
    const [telWhatsApp, setTelWhatsApp] = useState<string>("");
    const [unidade, setUnidade] = useState<string>("");
    const [perfil, setPerfil] = useState<string>("");

    function limparCampos() {
        reset();
        setNomeUsuario("");
        setEmailUsuario("");
        setTelWhatsApp("");
        setUnidade("");
        setPerfil("");
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent onCloseAutoFocus={limparCampos}>
                <DialogHeader className="mb-3">
                    <div className="flex flex-row gap-2 items-center">
                        <DialogTitle>Adicionar usuário</DialogTitle>
                    </div>
                    <DialogDescription>Adicione um usuário</DialogDescription>
                </DialogHeader>

                <form className="flex flex-col gap-5" onSubmit={handleSubmit((data) => console.log(data))}>
                    <div className="flex flex-col gap-3">
                        <div className="flex w-full gap-3">
                            <div className="flex w-1/2 flex-col gap-1">
                                <Label>Nome</Label>
                                <Input
                                    {...register("nome")}
                                    placeholder="Insira o nome"
                                />
                                {errors.nome && <span className="text-xs text-red-500 italic">{errors.nome.message}</span>}
                            </div>
                            <div className="flex w-1/2 flex-col gap-1">
                                <Label>Email</Label>
                                <Input
                                    {...register("email")}
                                    className="w-full"
                                    placeholder="Insira o email"
                                />
                                {errors.email && <span className="text-xs text-red-500 italic">{errors.email.message}</span>}
                            </div>
                        </div>
                        <div className="flex w-full flex-col gap-1 relative">
                            <Label>WhatsApp</Label>
                            <Input
                                {...register("whatsapp")}
                                placeholder="Insira o telefone do WhatsApp"
                            />
                            {errors.whatsapp && <span className="text-xs text-red-500 italic">{errors.whatsapp.message}</span>}

                            <Tooltip>
                                <TooltipTrigger className="absolute right-4 top-7">
                                    <Info className="w-4 h-4" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-xs">O usuário receberá o acesso via WhatsApp!</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        <div className="flex gap-3 items-center">
                            <div className="flex w-1/2 flex-col gap-1">
                                <Label>Unidade</Label>
                                <Controller
                                    name="unidade"
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
                                {errors.unidade && (
                                    <span className="text-xs text-red-500 italic">
                                        {errors.unidade.message}
                                    </span>
                                )}
                            </div>

                            <div className="flex w-1/2 flex-col gap-1">
                                <Label>Perfil</Label>
                                <Controller
                                    name="perfil"
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
                                {errors.perfil && (
                                    <span className="text-xs text-red-500 italic">
                                        {errors.perfil.message}
                                    </span>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" className="cursor-pointer">Cancelar</Button>
                            </DialogClose>

                            <Button
                                type="submit"
                                className="bg-verde hover:bg-green-900 cursor-pointer"
                            >
                                Adicionar
                            </Button>
                        </DialogFooter>
                    </div>
                </form>

            </DialogContent>
        </Dialog>
    );
}