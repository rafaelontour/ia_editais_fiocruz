"use client";

import { Upload, X } from "lucide-react";
import { Button } from "../ui/button";
import { FileUpload } from "../ui/file-upload";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Textarea } from "../ui/textarea";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Unidade } from "@/core/unidade";
import { toast } from "sonner";
import { getTodasUnidades } from "@/service/unidade";
import { Tipificacao } from "@/core";
import { getTipificacoesService } from "@/service/tipificacao";
import { zodResolver } from "@hookform/resolvers/zod";
import { UsuarioUnidade } from "@/core/usuario";
import { getUsuariosPorUnidade } from "@/service/usuario";
import { adicionarEditalService } from "@/service/edital";
import { enviarArquivoService } from "@/service/editalArquivo";
import useUsuario from "@/data/hooks/useUsuario";

const schemaEdital = z.object({
    nome: z.string().min(5, "O nome do edital é obrigatório"),
    tipificacoes: z.array(z.string().min(1)).min(1, "Selecione pelo menos uma tipificação"),
    responsavel: z.string().min(1, "Selecione o responsável por este edital"),
    identificador: z.string().min(1, "O número de identificação do edital é obrigatório"),
    descricao: z.string().min(6, "A descrição do edital é obrigatória"),
    arquivo: z
    .instanceof(File, { message: "O arquivo é obrigatório" })
    .refine((file) => file.size > 0, { message: "O arquivo é obrigatório" })
    .refine((file) => file.type === "application/pdf", {
      message: "O arquivo deve ser um PDF",
    }),
})

interface Props {
    atualizarEditais: Dispatch<SetStateAction<boolean>>
    flagEdital: boolean
}

export default function AdicionarEdital({ atualizarEditais, flagEdital } : Props) {

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
            responsavel: "",
        }
    })

    const [openSheet, setOpenSheet] = useState<boolean>(false);
    const [unidades, setUnidades] = useState<Unidade[]>([]);
    const [usuarios, setUsuarios] = useState<UsuarioUnidade[] | undefined>([]);
    const [tipificacoes, setTipificacoes] = useState<Tipificacao[]>([]);
    const [tipificacoesSelecionadas, setTipificacoesSelecionadas] = useState<Tipificacao[] | []>([]);
    const [responsaveisEdital, setResponsaveisEdital] = useState<UsuarioUnidade[]>([]);
    const { usuario } = useUsuario();

    async function buscarUnidades() {
        const unidades = await getTodasUnidades();
        setUnidades(unidades);
    }
    
    async function buscarTipificacoes() {
        const tipificacoes = await getTipificacoesService();
        setTipificacoes(tipificacoes);
    }
    
    async function buscarUsuariosPorUnidade() {
        const usuarios = await getUsuariosPorUnidade(usuario?.unit_id);
        setUsuarios(usuarios);
    }

    async function enviarEdital(data: formData) {

        const dados = {
            name: data.nome,
            identifier: data.identificador,
            description: data.descricao,
            typification_ids: data.tipificacoes,
            editors_ids: responsaveisEdital.map(usuario => usuario.id)
        }
        
        const [resposta, idEdital] = (await adicionarEditalService(dados)) ?? [];

        if (resposta !== 201) {
            toast.error("Erro ao enviar edital!");
            return
        }

        atualizarEditais(!flagEdital);
        toast.success("Edital enviado com sucesso!");
        limparDados();
        setOpenSheet(false);

        const respostaArquivo = await enviarArquivoService(idEdital, data.arquivo);

        if (respostaArquivo !== 201) {
            toast.error("Erro ao enviar arquivo!");
            return
        }

        toast.success("Arquivo enviado com sucesso!");
    }

    useEffect(() => {
        try {
            buscarUnidades();
            buscarTipificacoes();
        } catch(e: any) {
            toast.error("Erro", e.message);
        }
    }, [])

    function limparDados() {
        reset();
        setTipificacoesSelecionadas([]);
        setResponsaveisEdital([]);
    }


    return(
        <div>
            <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                <SheetTrigger asChild>
                    <Button
                        onClick={buscarUsuariosPorUnidade}
                        variant={"destructive"}
                        className="
                            bg-vermelho text-white
                            hover:cursor-pointer px-4
                        "
                        style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                    >
                        <Upload size={18} color="white" />
                        <p className="text-white text-[16px]">Enviar novo edital</p>
                    </Button> 
                </SheetTrigger>
                
                <SheetContent onCloseAutoFocus={limparDados} side="right" className="w-full px-10 pt-5 overflow-y-auto">
                    <SheetHeader className="pl-0">
                        <SheetTitle className="text-4xl">Adicionar edital</SheetTitle>
                        <SheetDescription className="text-xl">Preencha as informações abaixo</SheetDescription>
                    </SheetHeader>
                
                    <form onSubmit={handleSubmit(enviarEdital)}>
                        <div className="space-y-6">
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-3">
                                    <div className="flex flex-col gap-3 w-1/2">
                                        <Label htmlFor="name" className="text-lg">Nome do edital</Label>
                                        <Input
                                            {...register("nome")}
                                            id="name"
                                        />
                                        {errors.nome && (
                                            <span className="text-xs text-red-500 italic">
                                                {errors.nome.message}
                                            </span>
                                        )}
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
                                                        field.onChange([...field.value, value]); // Adiciona o novo valor ao arrayvalue);
                                                        const tipificacaoEncontrada = tipificacoes.find((t) => t.id === value);

                                                        if (tipificacaoEncontrada) {
                                                            setTipificacoesSelecionadas((prev) => [...prev, tipificacaoEncontrada]);
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Selecione tipificações" />
                                                    </SelectTrigger>
                                                    
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Tipificações</SelectLabel>
                                                            {
                                                                tipificacoes
                                                                .filter(t => !tipificacoesSelecionadas.some(tipificacao => tipificacao.id === t.id))
                                                                .map((tipificacao) => (
                                                                    <SelectItem
                                                                        key={tipificacao.id}
                                                                        value={tipificacao.id}
                                                                    >
                                                                        {tipificacao.name}
                                                                    </SelectItem>
                                                                ))
                                                            }

                                                            {
                                                                tipificacoes?.length === tipificacoesSelecionadas.length && (
                                                                    <SelectItem
                                                                        value="Todos"
                                                                        className="hover:cursor-pointer"
                                                                        disabled
                                                                    >
                                                                        Todas tipificações já foram selecionadas
                                                                    </SelectItem>
                                                                )
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
                                            <div className="grid grid-cols-3 gap-3 border-gray-200 rounded-md border-1 p-3">
                                                {
                                                    tipificacoesSelecionadas.filter((t) => tipificacoes.find((tp) => tp.id === t.id)).map((t: Tipificacao) => (
                                                        <div key={t.id} className="flex w-fit gap-3 items-center border-gray-200 rounded-sm border-1 pr-3 overflow-hidden">
                                                            <button className="h-full" onClick={() => {
                                                                const novaLista = tipificacoesSelecionadas.filter((tp) => tp.id !== t.id)
                                                                setTipificacoesSelecionadas(novaLista);
                                                                setValue("tipificacoes", novaLista.map((tp) => tp.id));
                                                            }}>
                                                                <div className="flex items-center h-full" title="Remover tipificação">
                                                                    <span
                                                                        className="
                                                                            bg-red-200 p-[10px] h-full flex items-center
                                                                            hover:bg-red-400 hover:cursor-pointer hover:text-white
                                                                            transition-all duration-200 ease-in-out
                                                                        "
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </span>
                                                                </div>
                                                            </button>
                                                            <p className="w-full text-sm py-1">{t.name}</p>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                                
                            </div>

                            <div className="flex flex-row gap-3 w-full">
                                <div className="flex flex-col gap-3 w-1/2">
                                    <Label htmlFor="responsavel" className="text-lg">Responsável</Label>
                                    <Controller
                                        name="responsavel"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                value=""
                                                defaultValue="Selecione um usuário"
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                    if (responsaveisEdital.find((u) => u.id === value)) return
                                                    setResponsaveisEdital((anteriores) => [...anteriores, usuarios?.find((u) => u.id === value)!]);
                                                }}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione um usuário" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Usuários</SelectLabel>
                                                        {
                                                            usuarios
                                                                ?.filter(u => !responsaveisEdital.some(r => r.id === u.id))
                                                                .map(usuario => (
                                                                    <SelectItem
                                                                        key={usuario.id}
                                                                        value={usuario.id}
                                                                        className="hover:cursor-pointer"
                                                                    >
                                                                        {usuario.username}
                                                                    </SelectItem>
                                                                ))
                                                        }
                                                        
                                                        {
                                                            usuarios?.length === responsaveisEdital.length && (
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

                                <div className="flex flex-col gap-3 w-1/2">
                                    <Label htmlFor="date" className="text-lg">Número do edital</Label>
                                    <Input
                                        {...register("identificador")}
                                        id="date"
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
                                            <div className="grid grid-cols-3 gap-3 border-gray-200 rounded-md border-1 p-3">
                                                {
                                                    responsaveisEdital.map((usuario: UsuarioUnidade) => (
                                                        <div key={usuario.id} className="flex w-fit gap-3 items-center border-gray-200 rounded-sm border-1 pr-3 overflow-hidden">
                                                            <button onClick={() => {
                                                                const novaLista = responsaveisEdital.filter((u) => u.id !== usuario.id)
                                                                setResponsaveisEdital(novaLista);
                                                                setValue("responsavel", "");
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
                                                            <p className=" w-full text-sm">{usuario.username}</p>
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
                                        id="descricao"
                                        className="resize-y min-h-[154px]"
                                        placeholder="Insira a descrição"
                                    />
                                    {
                                        errors.descricao && (
                                            <span className="text-xs text-red-500 italic">
                                                {errors.descricao.message}
                                            </span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3 w-1/2">
                                    <Label className="text-lg">Upload do documento</Label>
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

                        <SheetFooter className="absolute z-50 w-fit self-end bottom-2 right-6">
                            <Button
                                type="submit"
                                variant={"destructive"}
                                className="
                                    bg-vermelho text-white w-fit transition-all -mr-4 ml-auto
                                    hover:cursor-pointer
                                "
                                style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                            >
                                <Upload/>
                                <p>Salvar edital</p>
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    );
}