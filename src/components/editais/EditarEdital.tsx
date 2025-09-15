"use client";

import { PencilLine, X } from "lucide-react";
import { Button } from "../ui/button";
import { FileUpload } from "../ui/file-upload";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Textarea } from "../ui/textarea";
import { Edital, Tipificacao } from "@/core";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getTipificacoesService } from "@/service/tipificacao";
import { UsuarioUnidade } from "@/core/usuario";
import { getUsuariosPorUnidade } from "@/service/usuario";
import useUsuario from "@/data/hooks/useUsuario";
import { toast } from "sonner";
import { atualizarEditalService } from "@/service/edital";

interface Props {
    edital: Edital
    atualizarEditais: Dispatch<SetStateAction<boolean>>
    flagEdital: boolean
}

const schemaEdital = z.object({
    nome: z.string().min(5, "O nome do edital é obrigatório"),
    tipificacoes: z.array(z.string().min(1)).min(1, "Selecione pelo menos uma tipificação"),
    responsavel: z.array(z.string().min(1)).min(1, "Selecione pelo menos um responsável para este edital"),
    identificador: z.string().min(1, "O número de identificação do edital é obrigatório"),
    descricao: z.string().min(6, "A descrição do edital é obrigatória"),
    arquivo: z
        .custom<File>((file) => file instanceof File) // valida se é File
        .refine((file) => file.size > 0, "O arquivo é obrigatório"),
})

export default function EditarEdital({ edital, atualizarEditais, flagEdital }: Props) {

    type formData = z.infer<typeof schemaEdital>;
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        reset
    } = useForm<formData>({
        resolver: zodResolver(schemaEdital),
        defaultValues: {
            tipificacoes: [],
            responsavel: [],
        }
    })

    const { usuario } = useUsuario();
    const [tipificacoes, setTipificacoes] = useState<Tipificacao[]>([]);
    const [tipificacoesSelecionadas, setTipificacoesSelecionadas] = useState<Tipificacao[] | []>([]);
    const [responsaveisEdital, setResponsaveisEdital] = useState<UsuarioUnidade[]>([]);
    const [usuariosDaUnidade, setUsuariosDaUnidade] = useState<UsuarioUnidade[] | undefined>([]);
    const [sheetOpen, setSheetOpen] = useState<boolean>(false);

    async function filtrarTipificacoesSelectionadas() {
        const t = edital.typification?.map(tipificacao => tipificacoes.find(tipificacaoAux => tipificacaoAux.id === tipificacao)) as Tipificacao[]
        setTipificacoesSelecionadas(t);
        setValue("tipificacoes", t.map(tipificacao => tipificacao.id));
    }

    async function buscarUsuariosPorUnidade(id: string | undefined) {
        const usuarios = await getUsuariosPorUnidade(id);
        setUsuariosDaUnidade(usuarios);
    }

    function buscarResponsaveisEdital() {
        const re = usuariosDaUnidade?.filter(u => edital.editors?.includes(u.id)) as UsuarioUnidade[];
        setValue("responsavel", re.map(u => u.id));
        setResponsaveisEdital(re);
    }

    async function atualizarEdital(data: formData) {
        const resposta = await atualizarEditalService(edital.id, data);

        if (resposta !== 201) {
            toast.error("Erro ao atualizar edital!");
            return
        }

        toast.success("Edital atualizado com sucesso!");
        atualizarEditais(!flagEdital);
        setSheetOpen(!sheetOpen);
        limparCampos();
    }

    useEffect(() => {
        buscarUsuariosPorUnidade(usuario?.unit_id);
        getTipificacoesService().then(tipificacoes => setTipificacoes(tipificacoes));
    }, [])

    function limparCampos() {
        reset();
        setTipificacoesSelecionadas([]);
        setResponsaveisEdital([]);
    }

    return (
        <div>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                    <Button variant={"outline"} size={"icon"} className="h-6 w-6 p-[14px] border-gray-300 rounded-sm hover:cursor-pointer">
                        <PencilLine />
                    </Button>
                </SheetTrigger>

                <SheetContent
                    onOpenAutoFocus={() => {
                        buscarResponsaveisEdital();
                        filtrarTipificacoesSelectionadas();
                    }}
                    onCloseAutoFocus={limparCampos}
                    side="right"
                    className="w-full px-10 pt-5 overflow-y-auto"
                >
                    <SheetHeader className="pl-0">
                        <SheetTitle className="text-2xl">Edital {edital.name}</SheetTitle>
                        <SheetDescription>Modifique as informações do edital abaixo</SheetDescription>
                    </SheetHeader>

                    <form onSubmit={handleSubmit(atualizarEdital)}>
                        <div className="space-y-6">
                            <div className="flex flex-row gap-3">
                                <div className="flex flex-col gap-3 w-[60%]">
                                    <Label htmlFor="name">Nome do Edital</Label>
                                    <Input
                                        {...register("nome")}
                                        id="name"
                                        placeholder="Insira o nome do edital"
                                        defaultValue={edital.name}
                                    />
                                    {errors.nome && <p className="text-red-500 text-xs italic">{errors.nome.message}</p>}
                                </div>

                                <div className="flex w-full flex-col gap-3">
                                    <Label htmlFor="tipe">Tipificações</Label>
                                    <Controller
                                        name="tipificacoes"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                value=""
                                                onValueChange={(value) => {
                                                    field.onChange([...field.value, value]); // Adiciona o novo valor ao arrayvalue);
                                                    const tipificacaoEncontrada = tipificacoes.find((t) => t.id === value);
                                                    if (tipificacaoEncontrada) {
                                                        setTipificacoesSelecionadas((prev) => [...prev, tipificacaoEncontrada]);
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selcione tipificações" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Tipificações</SelectLabel>
                                                        {
                                                            tipificacoes.filter(t => !field.value.includes(t.id)).map((tipificacao) => (
                                                                <SelectItem
                                                                    key={tipificacao.id}
                                                                    value={tipificacao.id}
                                                                >
                                                                    {tipificacao.name}
                                                                </SelectItem>
                                                            ))
                                                        }
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.tipificacoes && (
                                        <span className="text-xs text-red-500 italic">
                                            {errors.tipificacoes.message}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {
                                tipificacoesSelecionadas.length > 0 && (
                                    <div className="flex flex-col gap-3 w-full">
                                        <Label htmlFor="tipe">Tipificações selecionadas</Label>
                                        <div className="grid grid-cols-3 gap-3 border-gray-200 rounded-md border-1 p-3">
                                            {
                                                tipificacoesSelecionadas.map((t: Tipificacao) => (
                                                    <div key={t.id} className="flex w-fit gap-3 items-center border-gray-200 rounded-sm border-1 pr-3 overflow-hidden">
                                                        <button onClick={() => {
                                                            const novaLista = tipificacoesSelecionadas.filter((tp) => tp.id !== t.id)
                                                            setTipificacoesSelecionadas(novaLista);
                                                            setValue("tipificacoes", novaLista.map((tp) => tp.id));
                                                        }}>
                                                            <div className="flex items-center" title="Remover tipificação">
                                                                <span
                                                                    className="
                                                                            bg-red-200 p-[10px]
                                                                            hover:bg-red-400 hover:cursor-pointer hover:text-white
                                                                            transition-all duration-200 ease-in-out
                                                                        "
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </span>
                                                            </div>
                                                        </button>
                                                        <p className=" w-full text-[11px]">{t.name}</p>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                )
                            }
                            <div className="flex flex-row gap-3 w-full">
                                <div className="flex flex-col gap-3 w-full">
                                    <Label htmlFor="responsavel">Responsável</Label>
                                    <Controller
                                        name="responsavel"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                value=""
                                                defaultValue="Selecione um usuário"
                                                onValueChange={(value) => {
                                                    field.onChange([...field.value, value]); // Adiciona o novo valor ao arrayvalue);
                                                    if (responsaveisEdital.find((u) => u.id === value)) return
                                                    setResponsaveisEdital((anteriores) => [...anteriores, usuariosDaUnidade?.find((u) => u.id === value)!]);
                                                }}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione um usuário" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Usuários</SelectLabel>
                                                        {
                                                            usuariosDaUnidade?.filter(u => !field.value.includes(u.id)).map((u) => (
                                                                <SelectItem
                                                                    key={u.id}
                                                                    value={u.id}
                                                                >
                                                                    {u.username}
                                                                </SelectItem>
                                                            ))
                                                        }
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {
                                        errors.responsavel && (
                                            <span className="text-xs text-red-500 italic">
                                                {errors.responsavel.message}
                                            </span>
                                        )
                                    }
                                </div>
                                <div className="flex flex-col gap-3 w-full">
                                    <Label htmlFor="data">Número do edital</Label>
                                    <Input
                                        defaultValue={edital?.identifier}
                                        {...register("identificador")}
                                        id="data"
                                        placeholder="Informe o número do edital"
                                    />
                                    {
                                        errors.identificador && (
                                            <span className="text-xs text-red-500 italic">
                                                {errors.identificador.message}
                                            </span>
                                        )
                                    }
                                </div>
                            </div>
                            <div>
                                {
                                    responsaveisEdital.length > 0 && (
                                        <div className="flex flex-col gap-3 w-full">
                                            <Label htmlFor="tipe">{responsaveisEdital.length > 1 ? "Responsáveis selecionados" : "Responsável selecionado"}</Label>
                                            <div className="grid grid-cols-3 gap-3 border-gray-200 rounded-md border-1 p-3">
                                                {
                                                    responsaveisEdital.map((responsavel: UsuarioUnidade) => (
                                                        <div key={responsavel?.id} className="flex w-fit gap-3 items-center border-gray-200 rounded-sm border-1 pr-3 overflow-hidden">
                                                            <button onClick={() => {
                                                                const novaLista = responsaveisEdital.filter((u) => u.id !== responsavel?.id)
                                                                setResponsaveisEdital(novaLista);
                                                                setValue("responsavel", [...novaLista.map((u) => u.id)]);
                                                            }}>
                                                                <div className="flex items-center" title="Remover usuário">
                                                                    <span
                                                                        className="
                                                                            bg-red-200 p-[10px]
                                                                            hover:bg-red-400 hover:cursor-pointer hover:text-white
                                                                            transition-all duration-200 ease-in-out
                                                                        "
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </span>
                                                                </div>
                                                            </button>
                                                            <p className=" w-full text-[11px]">{responsavel?.username}</p>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex flex-col gap-3 w-1/2">
                                    <Label htmlFor="descricao">Descrição</Label>
                                    <Textarea
                                        {...register("descricao")}
                                        defaultValue={edital?.description}
                                        id="descricao"
                                        placeholder="Descreva o edital"
                                        className="min-h-[154px]"
                                    />
                                    {
                                        errors.descricao && (
                                            <span className="text-xs text-red-500 italic">
                                                {errors.descricao.message}
                                            </span>
                                        )
                                    }
                                </div>

                                <div className="flex flex-col gap-3 w-1/2">
                                    <Label>Upload do documento</Label>
                                    <div className="h-16">
                                        <Controller
                                            name="arquivo"
                                            control={control}
                                            render={({ field }) => (
                                                <FileUpload
                                                    onChange={(files: File[]) => {
                                                        field.onChange(files[0]);
                                                    }}
                                                />
                                            )}
                                        />

                                        {
                                            errors.arquivo && (
                                                <span className="text-xs text-red-500 italic">
                                                    {errors.arquivo.message}
                                                </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*<SheetFooter className="flex flex-end justify-end max-w-full">
                            <div className="flex flex-row justify-between">
                                <Label className="flex flex-row">Documentos anteriores</Label>
                                <ChevronDown />
                            </div>
                        </SheetFooter>*/}

                        <SheetFooter className="flex absolute z-50 w-fit justify-end bottom-6 right-10">
                            <Button
                                type="submit"
                                variant={"destructive"}
                                className="
                                    bg-vermelho text-white w-fit transition-all -mr-4 ml-auto
                                    hover:cursor-pointer
                                "
                                style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                            >
                                <p>Salvar alterações</p>
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    );
}