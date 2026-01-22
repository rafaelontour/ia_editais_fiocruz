"use client";

import { Info, PencilLine, X } from "lucide-react";
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
import { adicionarEditalService, atualizarEditalService } from "@/service/edital";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { enviarArquivoService, getEditalArquivoService } from "@/service/editalArquivo";
import { EditalArquivo } from "@/core/edital/Edital";
import { IconFile } from "@tabler/icons-react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog";

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
        .instanceof(File)
        .refine((file) => file.type === "application/pdf", {
            message: "O arquivo deve ser um PDF",
        })
        .optional() // permite que não seja enviado
        .nullable() // também aceita null, se vier do form assim
        .refine((file) => {
        // Se não existir arquivo, ok
        if (!file) return true
        // Se existir, tem que ser PDF
            return file.type === "application/pdf"
        }),
})

export default function EditarEdital({ edital, atualizarEditais, flagEdital }: Props) {

    const [cliqueEditar, setCliqueEditar] = useState<boolean>(false);
    const [urlCaminhoArquivoEdital, setUrlArquivoEdital] = useState<string>("");

    async function buscarCaminhoEdital() {
        const arquivo: EditalArquivo = await getEditalArquivoService(edital.id!);
        setUrlArquivoEdital(arquivo.releases[0].file_path);
    }

    useEffect(() => {
        buscarCaminhoEdital();
    }, [cliqueEditar]);

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

    const urlBase = process.env.NEXT_PUBLIC_URL_BASE
    const { usuario } = useUsuario();
    const [tipificacoes, setTipificacoes] = useState<Tipificacao[]>([]);
    const [tipificacoesSelecionadas, setTipificacoesSelecionadas] = useState<Tipificacao[] | []>([]);
    const [responsaveisEdital, setResponsaveisEdital] = useState<UsuarioUnidade[]>([]);
    const [usuariosDaUnidade, setUsuariosDaUnidade] = useState<UsuarioUnidade[] | undefined>([]);
    const [sheetOpen, setSheetOpen] = useState<boolean>(false);

    async function filtrarTipificacoesSelectionadas() {
        const t = edital.typifications?.map(tipificacao => tipificacoes.find(tip => tip.id === tipificacao.id)) as Tipificacao[]
        setTipificacoesSelecionadas(t);
        setValue("tipificacoes", t.map(tipificacao => tipificacao.id));
    }

    async function buscarUsuariosPorUnidade(id: string | undefined) {
        const usuarios = await getUsuariosPorUnidade(id);
        setUsuariosDaUnidade(usuarios);
    }

    function buscarResponsaveisEdital() {
        const re = (usuariosDaUnidade ?? []).filter((u) =>
            (edital.editors ?? []).some((e) => e.id === u.id)
        );
        setValue("responsavel", re.map((u) => u.id!));
        setResponsaveisEdital(re);
    }

    async function atualizarEdital(data: formData) {

        const dados = {
            id: edital.id,
            name: data.nome,
            identifier: data.identificador,
            description: data.descricao,
            typification_ids: data.tipificacoes,
            editors_ids: responsaveisEdital.map(usuario => usuario.id)
        }

        const r = await atualizarEditalService(dados);


        if (r !== 200) {
            toast.error("Erro ao atualizar os dados do edital!", { description: "O arquivo não foi atualizado, pois ocorreu um erro ao atualizar as informações do edital!!" });
            return
        }

        const resposta = await enviarArquivoService(edital.id, data.arquivo);

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
        getTipificacoesService().then(tipificacoes => setTipificacoes(tipificacoes ?? []));
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
                    <Button variant={"outline"} size={"icon"} className="h-6 w-6 p-3.5 border-gray-300 rounded-sm hover:cursor-pointer">
                        <PencilLine />
                    </Button>
                </SheetTrigger>

                <SheetContent
                    onOpenAutoFocus={() => {
                        buscarResponsaveisEdital();
                        setCliqueEditar(!cliqueEditar);
                        filtrarTipificacoesSelectionadas();
                    }}
                    onCloseAutoFocus={limparCampos}
                    side="right"
                    className="w-full px-10 pt-5 overflow-y-auto"
                >
                    <SheetHeader className="pl-0">
                        <SheetTitle className="text-4xl">Edital {edital.name}</SheetTitle>
                        <SheetDescription className="text-xl">Modifique as informações do edital abaixo</SheetDescription>
                    </SheetHeader>

                    <form onSubmit={handleSubmit(atualizarEdital)}>
                        <div className="space-y-6">
                            <div className="flex gap-3">
                                <div className="flex flex-col gap-3 w-1/2">
                                    <Label htmlFor="name" className="text-lg">Nome do edital</Label>
                                    <Input
                                        {...register("nome")}
                                        id="name"
                                        placeholder="Insira o nome do edital"
                                        defaultValue={edital.name}
                                    />

                                    {errors.nome && <p className="text-red-500 text-xs italic">{errors.nome.message}</p>}
                                </div>

                                <div className="flex w-1/2 flex-col gap-3">
                                    <Label htmlFor="tipe" className="text-lg">Tipificações</Label>
                                    <Controller
                                        name="tipificacoes"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                value=""
                                                onValueChange={(value) => {
                                                    field.onChange([...(field.value ?? []), value]); // Adiciona o novo valor ao arrayvalue);
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
                                                            tipificacoes.filter(t => !field.value?.includes(t.id)).map((tipificacao) => (
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
                                        <Label htmlFor="tipe" className="text-lg">Tipificações selecionadas</Label>
                                        <div className="grid grid-cols-3 gap-3 border-gray-200 rounded-md border p-3">
                                            {
                                                tipificacoesSelecionadas.map((t: Tipificacao) => (
                                                    <div key={t.id} className="flex w-fit gap-3 items-center border-gray-200 rounded-sm border pr-3 overflow-hidden">
                                                        <button className="h-full" onClick={() => {
                                                            const novaLista = tipificacoesSelecionadas.filter((tp) => tp.id !== t.id)
                                                            setTipificacoesSelecionadas(novaLista);
                                                            setValue("tipificacoes", novaLista.map((tp) => tp.id));
                                                        }}>
                                                            <div className="flex items-center h-full" title="Remover tipificação">
                                                                <span
                                                                    className="
                                                                            bg-red-200 p-3.5 h-full flex items-center
                                                                            hover:bg-red-400 hover:cursor-pointer hover:text-white
                                                                            transition-all duration-200 ease-in-out
                                                                        "
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </span>
                                                            </div>
                                                        </button>
                                                        <p className=" w-full text-sm">{t.name}</p>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                )
                            }

                            <div className="flex flex-row gap-3 w-full">
                                <div className="flex flex-col gap-3 w-full">
                                    <Label htmlFor="responsavel" className="text-lg">Responsável</Label>
                                    <Controller
                                        name="responsavel"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                value=""
                                                defaultValue="Selecione um usuário"
                                                onValueChange={(value) => {
                                                    field.onChange([...(field.value ?? []), value]); // Adiciona o novo valor ao arrayvalue);
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
                                                            usuariosDaUnidade?.filter(u => field.value?.includes(u.id!)).map((u) => (
                                                                <SelectItem
                                                                    key={u.id}
                                                                    value={u.id!}
                                                                >
                                                                    {u.username}
                                                                </SelectItem>
                                                            ))
                                                        }

                                                        {
                                                            usuariosDaUnidade?.length === responsaveisEdital.length && (
                                                                <SelectItem
                                                                    value="Todos"
                                                                    className="hover:cursor-pointer"
                                                                    disabled
                                                                >
                                                                    Todos usuários já foram selecionados
                                                                </SelectItem>
                                                            )
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
                                    <Label htmlFor="data" className="text-lg">Número do edital</Label>
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
                                            <Label htmlFor="tipe" className="text-lg">{responsaveisEdital.length > 1 ? "Responsáveis selecionados" : "Responsável selecionado"}</Label>
                                            <div className="grid grid-cols-3 gap-3 border-gray-200 rounded-md border p-3">
                                                {
                                                    responsaveisEdital.map((responsavel: UsuarioUnidade) => (
                                                        <div key={responsavel?.id} className="flex w-fit gap-3 items-center border-gray-200 rounded-sm border pr-3 overflow-hidden">
                                                            <button onClick={() => {
                                                                const novaLista = responsaveisEdital.filter((u) => u.id !== responsavel?.id)
                                                                setResponsaveisEdital(novaLista);
                                                                setValue("responsavel", [...novaLista.map((u) => u.id!)]);
                                                            }}>
                                                                <div className="flex items-center" title="Remover usuário">
                                                                    <span
                                                                        className="
                                                                            bg-red-200 p-2.5
                                                                            hover:bg-red-400 hover:cursor-pointer hover:text-white
                                                                            transition-all duration-200 ease-in-out
                                                                        "
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </span>
                                                                </div>
                                                            </button>
                                                            <p className=" w-full text-sm">{responsavel?.username}</p>
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
                                    <Label htmlFor="descricao" className="text-lg">Descrição</Label>
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
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <Label className="text-lg">Upload do documento</Label>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Info size={16} />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Para visualizar o documento deste edital, clique no botão ao lado. <br />Para substituir o documento, clique abaixo e faça o upload do no novo arquivo.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>


                                        <Dialog>
                                            <DialogHeader>
                                                <DialogTrigger>
                                                    <div
                                                        title="Ver documento"
                                                        className="
                                                            flex items-center bg-red-500
                                                            px-2 rounded-md
                                                        "
                                                        style={{ boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.3)" }}
                                                    >
                                                        <IconFile color="white" size={16} />
                                                        <span className="text-xs text-white p-1 hover:underline hover:cursor-pointer">Visualizar edital</span>
                                                    </div>
                                                </DialogTrigger>

                                                <DialogContent className="p-10 w-[80%] h-[90%]">
                                                    <iframe
                                                        src={urlBase + urlCaminhoArquivoEdital}
                                                        width="100%"
                                                        height="100%"
                                                        style={{ border: "none" }}
                                                    ></iframe>
                                                </DialogContent>
                                            </DialogHeader>
                                        </Dialog>
                                    </div>

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
                                            )
                                        }
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

                        <SheetFooter className="flex w-full sticky z-50 justify-end bottom-2 right-10">
                            <Button
                                type="submit"
                                variant={"destructive"}
                                className="
                                    bg-vermelho text-white w-fit transition-all -mr-4 ml-auto
                                    hover:cursor-pointer
                                "
                                style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                            >
                                <p>Salvar</p>
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    );
}