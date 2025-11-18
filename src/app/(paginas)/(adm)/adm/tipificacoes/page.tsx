"use client"

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Fonte, Tipificacao } from "@/core";
import { getFontesService } from "@/service/fonte";
import { getTipificacoesService, adicionarTipificacaoService, excluirTipificacaoService, atualizarTipificacaoService } from "@/service/tipificacao";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Calendar, Loader2, PencilLine, Plus, Search, Share2, Trash, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import { toast } from "sonner";
import { formatarData, simularAtraso } from "@/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const schemaTipificacao = z.object({
    nome: z.string().min(1, "O nome da tipificação é obrigatório"),
    fontesSelecionadas: z
        .array(z.string().min(0)).min(0, "Selecione pelo menos uma fonte")
})

export default function Tipificacoes() {
    type FormData = z.infer<typeof schemaTipificacao>;
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        reset 
    } = useForm<FormData>({
        resolver: zodResolver(schemaTipificacao),
        defaultValues: {
            fontesSelecionadas: []
        }
    });

    let termoBusca = useRef<string>("");

    const [tipificacoes, setTipificacoes] = useState<Tipificacao[]>([]);
    const [fontes, setFontes] = useState<Fonte[]>([]);

    const [dialogTipificacao, setDialogTipificacao] = useState(false);
    const [idDialogExcluir, setIdDialogExcluir] = useState<string | null>("");
    const [idDialogEditar, setIdDialogEditar] = useState<string | null>("");

    const [fontesSelecionadas, setFontesSelecionadas] = useState<Fonte[]>([]);

    const [tipificacoesFiltradas, setTipificacoesFiltradas] = useState<Tipificacao[]>([]);

    const [carregandoTipificacoes, setCarregandoTipificacoes] = useState<boolean>(true);

    const breakpointColumns = {
        default: 3,
        1100: 3,
        700: 2,
        500: 1
    };

    useEffect(() => {
        async function carregarTudo() {
            await getFontes();
            await getTipificacoes();
            setCarregandoTipificacoes(false);  // ✔ agora faz sentido
        }

        carregarTudo();
    }, []);


    const getTipificacoes = async () => {
        const dados = await getTipificacoesService();

        if (dados == null) {
            toast.error("Erro ao buscar tipificacoes")
        }

        setTipificacoes(dados)
        setTipificacoesFiltradas(dados)
        setCarregandoTipificacoes(false);
    }

    const getFontes = async () => {
        const dados = await getFontesService();

        if (dados == null) {
            toast.error("Erro ao buscar fontes")
            return
        }

        setFontes(dados)
    }


    const adicionarTipificacao = async (data: FormData) => {
        setCarregandoTipificacoes(true);
        const dados = await adicionarTipificacaoService(data.nome, fontesSelecionadas);

        if (dados == null) {
            toast.error("Erro ao adicionar tipificação")
            return
        }

        toast.success("Tipificacao adicionada com sucesso!")

        await getTipificacoes();
        limparCampos();
        setDialogTipificacao(false);
    }


    const atualizarTipificacao = async (data: FormData) => {
        setCarregandoTipificacoes(true);
        const tip: Tipificacao = {
            id: idDialogEditar as string,
            name: data.nome,
            source_ids: data.fontesSelecionadas
        }

        const resposta = await atualizarTipificacaoService(tip);

        if (resposta !== 200) {
            toast.error("Erro ao atualizar tipificação")
            return
        }

        toast.success("Tipificacao atualizada com sucesso!")

        await getTipificacoes();
        limparCampos();
        setIdDialogEditar(null);

    }

    const excluirTipificacao = async (id: string) => {
        setCarregandoTipificacoes(true);
        setIdDialogExcluir(id);

        try {
            const resposta = await excluirTipificacaoService(id);

            if (resposta !== 204) {
                toast.error("Erro ao excluir tipificação!")
                return
            }

            toast.success("Tipificacao excluida com sucesso!");

            await getTipificacoes();
        } catch (erro) {
            toast.error("Erro ao excluir tipificação!")
        }
    }

    const filtrarPraEdicao = (ids: string[] | undefined): Fonte[] => {
        return fontes.filter(fonte => ids?.includes(fonte.id));
    }

    function limparCampos() {
        reset();
        setValue("fontesSelecionadas", []);
        setFontesSelecionadas([]);
    }

    function filtrarTipificacao() {
        if (termoBusca.current.trim() === "") {
            return tipificacoes;
        }

        const tf = tipificacoes.filter(
            tipificacao => tipificacao.name && tipificacao.name.toLowerCase().startsWith(termoBusca.current.toLowerCase())
        )
        return tf
    }

    return (
        <div className="">
            <div className="flex flex-col gap-5 pb-10">
                <div className="flex flex-col gap-2 sticky top-0 z-10 bg-white pb-4 justify-between w-full items-center">
                    <div className="flex items-center justify-between w-full">
                        <p className="text-4xl font-bold">Gestão de tipificações</p>
                        <Dialog open={dialogTipificacao} onOpenChange={setDialogTipificacao}>
                            <DialogTrigger asChild>
                                <Button
                                    variant={"destructive"}
                                    style={{ boxShadow: "0 0 3px rgba(0, 0 ,0,.5)" }}
                                    className={`
                                        flex rounded-md gap-2 items-center px-4 py-2
                                        transition duration-100
                                        bg-vermelho text-white
                                        hover:cursor-pointer
                                    `}
                                >
                                    <Plus size={18} />
                                    <p className="text-white text-sm">Adicionar tipificação</p>
                                </Button>
                            </DialogTrigger>

                            <DialogContent onCloseAutoFocus={limparCampos}>
                                <DialogHeader>
                                    <DialogTitle className="text-3xl font-bold">
                                        Adicionar tipificação
                                    </DialogTitle>
                                    <DialogDescription className="text-md pb-4">
                                        Preencha os campos abaixo para adicionar uma nova tipificação
                                    </DialogDescription>
                                </DialogHeader>
                                
                                <form onSubmit={handleSubmit(adicionarTipificacao)} className="flex text-lg flex-col gap-4">
                                    <p className="flex flex-col gap-2">
                                        <Label htmlFor="nome" className="text-lg">Nome da tipificação</Label>
                                        <Input
                                            {...register("nome")}
                                            type="text"
                                            className="border-2 border-gray-300 rounded-md p-2 w-full"
                                        />
                                        {errors.nome && <span className="text-red-500 text-sm italic">{errors.nome.message}</span>}
                                    </p>
                                    <p className="flex flex-col gap-2">
                                        <Label className="text-lg">
                                            Fontes
                                            <span
                                                style={{ boxShadow: "2px 2px 3px rgba(0, 0, 0, .5)" }}
                                                className="text-xs px-2 py-1 rounded-md bg-yellow-400 italic"
                                            >
                                                opcional
                                            </span>
                                        </Label>

                                        <Controller
                                            name="fontesSelecionadas"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    value=""
                                                    onValueChange={(value) => {
                                                        field.onChange([...field.value, value]);
                                                        const fonteEncontrada = fontes.find(fonte => fonte.id === value);

                                                        console.log("fonte encontrada pra dcolocar na lsita de ja selecionado: ", fonteEncontrada)
                                                        if (fonteEncontrada) {
                                                            setFontesSelecionadas([...fontesSelecionadas, fonteEncontrada]);
                                                        }

                                                        console.log("fontes ja selec8i0onada: ", fontesSelecionadas)
                                                    }}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Selecione uma ou mais fontes" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                        
                                                        <SelectLabel>Fontes</SelectLabel>
                                                        {fontes && fontes.filter(f => !fontesSelecionadas.some(fonte => fonte.id === f.id)).map((fonte, index) =>(
                                                            <SelectItem
                                                                key={index}
                                                                value={fonte.id}
                                                                className="p-2 rounded-sm"
                                                            >
                                                                {fonte.name}
                                                            </SelectItem>
                                                        ))}
                                                        {
                                                            fontes?.length === fontesSelecionadas.length && (
                                                                <SelectItem
                                                                    value="Todos"
                                                                    className="hover:cursor-pointer"
                                                                    disabled
                                                                >
                                                                    Nenhuma fonte para selecionar
                                                                </SelectItem>
                                                            )
                                                        }
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.fontesSelecionadas && (
                                            <span className="text-red-500 text-sm italic">{errors.fontesSelecionadas.message}</span>
                                        )}
                                    </p>
                                    {
                                        fontesSelecionadas.length > 0 && (
                                            <div className="flex flex-col gap-3 w-full">
                                                <Label htmlFor="tipe" className="text-lg">{fontesSelecionadas.length > 1 ? "Fontes selecionadas" : "Fonte selecionada"}</Label>
                                                <div className="grid grid-cols-3 gap-3 border-gray-200 rounded-md border-1 p-3">
                                                    {
                                                        fontesSelecionadas.map((fonte: Fonte) => (
                                                            <div key={fonte.id} className="flex w-fit gap-3 items-center border-gray-200 rounded-sm border-1 pr-3 overflow-hidden">
                                                                <button onClick={() => {
                                                                    const novaLista = fontesSelecionadas.filter((f) => f.id !== fonte.id)
                                                                    setFontesSelecionadas(novaLista);
                                                                    setValue("fontesSelecionadas", [""]);
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
                                                                <p className=" w-full text-sm">{fonte.name}</p>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        )
                                    }
                                    <DialogFooter>
                                        <DialogClose
                                            className={`
                                                    transition ease-in-out text-white
                                                    rounded-md px-3 bg-vermelho
                                                    hover:cursor-pointer text-sm
                                                `}
                                            style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                                        >
                                            Cancelar
                                        </DialogClose>
                                        <Button
                                            type="submit"
                                            className={`
                                                flex bg-verde hover:bg-verde
                                                text-white hover:cursor-pointer
                                                active:scale-100
                                            `}
                                            style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                                        >
                                            Salvar
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="flex w-1/2 relative top-0 mt-2 self-start">
                                            
                        <Search className="absolute mt-1 translate-y-1/2 left-2" size={17} />
                        {
                            termoBusca.current !== "" && (
                                <span
                                    onClick={() => {
                                        setTipificacoesFiltradas(tipificacoes);
                                        termoBusca.current = "";
                                        const tipsFiltradas = filtrarTipificacao();
                                        setTipificacoesFiltradas(tipsFiltradas || []);
                                    }}
                                    className="hover:cursor-pointer"
                                    title="Limpar pesquisa"
                                >
                                    <X className="absolute mt-1 translate-y-1/2 right-2" size={17} />
                                </span>
                            )
                        }
                        
                        <Input
                            type="text"
                            value={termoBusca.current}
                            placeholder="Pesquisar"
                            className="mt-1 block w-full pl-8 pr-3 py-2  rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                            onChange={(e) => {
                                termoBusca.current = e.target.value;
                                const tipsFiltradas = filtrarTipificacao();
                                setTipificacoesFiltradas(tipsFiltradas || []);
                            }}
                        />
                    </div>
                </div>

                

                <Masonry
                    breakpointCols={breakpointColumns}
                    className="flex relative gap-5 mb-10 px-1 h-full"
                >
                    {
                        carregandoTipificacoes ? (
                            <div className="flex justify-center items-center gap-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                                <p className="animate-pulse">Carregando tipificações...</p>
                                <Loader2 className="animate-spin" />
                            </div>
                        ) : (
                            tipificacoesFiltradas && tipificacoesFiltradas.length > 0 ? tipificacoesFiltradas.map((tipificacao, index) => (
                            <div
                                style={{ boxShadow: "0 0 5px rgba(0,0,0,.3)" }}
                                key={index}
                                className="
                                    flex flex-col gap-2 rounded-md p-4 w-full
                                    transition ease-in-out duration-100 mb-5
                                "
                            >
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-2xl font-semibold">{tipificacao.name}</h2>

                                    {/* <p className={`bg-zinc-400 py-1 px-2 text-white rounded-md border-1 border-gray-300 w-fit text-sm`}>
                                        Lei Complementar: {tipificacao.}
                                    </p> */}
                                </div>

                                <div className="flex justify-between items-center mt-3">
                                    <p className="flex items-center gap-2 text-sm text-gray-400">
                                        <Calendar size={18} />
                                        <span className="flex justify-center flex-col">
                                            <span className="text-[10px] font-semibold mb-[-5px] mt-1">Criada em</span>
                                            <span>{formatarData(tipificacao.created_at)}</span>
                                        </span>
                                    </p>

                                    

                                    <div className="flex gap-3">
                                        <Link href={`/adm/tipificacoes/${tipificacao.id}/taxonomias`}>
                                            <Button
                                                className={`
                                                    h-8 w-8 hover:cursor-pointer rounded-sm border border-gray-300
                                                    bg-branco hover:bg-branco
                                                `}
                                                title="Taxonomias desta tipificação"
                                            >
                                                <Share2 color="black" size={20} />
                                            </Button>
                                        </Link>

                                        <Dialog open={idDialogEditar === tipificacao.id} onOpenChange={(open) => setIdDialogEditar(open ? tipificacao.id : null)}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    onClick={() => {
                                                        const idsFontes = tipificacao.sources?.map((f: Fonte) => f.id);
                                                        const fontesDaTaxonomia = filtrarPraEdicao(idsFontes);
                                                        setFontesSelecionadas(fontesDaTaxonomia)
                                                        setValue("fontesSelecionadas", fontesDaTaxonomia.map(f => f.id))
                                                    }}
                                                    title="Editar tipificação"
                                                    className={`
                                                            h-8 w-8 hover:cursor-pointer rounded-sm border border-gray-300
                                                            bg-branco hover:bg-branco
                                                        `}
                                                    size={"icon"}
                                                >
                                                    <PencilLine color="black" />
                                                </Button>
                                            </DialogTrigger>

                                            <DialogContent onCloseAutoFocus={limparCampos}>
                                                <DialogHeader>
                                                    <DialogTitle className="text-3xl font-bold">
                                                        Editar tipificação
                                                    </DialogTitle>

                                                    <DialogDescription className="text-md pb-4">
                                                        Atualize os dados da tipificação selecionada
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <form onSubmit={handleSubmit(atualizarTipificacao)} className="flex text-lg flex-col gap-4">
                                                    <p className="flex flex-col gap-2">
                                                        <Label id="nome_tip" className="text-lg">Nome da tipificação</Label>
                                                        <Input
                                                            id="nome_tip"
                                                            defaultValue={tipificacao.name}
                                                            {...register("nome")}
                                                            type="text"
                                                            className="border-2 border-gray-300 rounded-md p-2 w-full"
                                                        />
                                                        {errors.nome && <span className="text-red-500 text-sm italic">{errors.nome.message}</span>}
                                                    </p>

                                                    <p className="flex flex-col gap-2">
                                                        <Label className="text-lg">
                                                            Fontes
                                                            <span
                                                                style={{ boxShadow: "2px 2px 3px rgba(0, 0, 0, .5)" }}
                                                                className="text-xs px-2 py-1 rounded-md bg-yellow-400 italic"
                                                            >
                                                                opcional
                                                            </span>
                                                        </Label>
                                                        <Controller 
                                                            name="fontesSelecionadas"
                                                            control={control}
                                                            render={({ field }) => (   
                                                                <Select
                                                                    value=""
                                                                    onValueChange={(value) => {
                                                                        field.onChange([...field.value, value]);
                                                                        const fonteEncontrada = fontes.find(fonte => fonte.id === value);

                                                                        if (fonteEncontrada) {
                                                                            setFontesSelecionadas([...fontesSelecionadas, fonteEncontrada]);
                                                                        }
                                                                    }}
                                                                >
                                                                    <SelectTrigger className="w-full">
                                                                        <SelectValue placeholder="Selecione uma ou mais fontes" />
                                                                    </SelectTrigger>

                                                                    <SelectContent>
                                                                        <SelectGroup>
                                                                        
                                                                        <SelectLabel>Fontes</SelectLabel>
                                                                        {fontes && fontes.filter(fonte => !fontesSelecionadas.some(f => f.id === fonte.id)).map((fonte, index) => (
                                                                            <SelectItem
                                                                                key={index}
                                                                                value={fonte.id}
                                                                                className="p-2 rounded-sm"
                                                                            >
                                                                                {fonte.name}
                                                                            </SelectItem>
                                                                        ))}

                                                                        {
                                                                            fontes?.length === fontesSelecionadas.length && (
                                                                                <SelectItem
                                                                                    value="Todos"
                                                                                    className="hover:cursor-pointer"
                                                                                    disabled
                                                                                >
                                                                                    Nenhuma fonte para selecionar
                                                                                </SelectItem>
                                                                            )
                                                                        }
                                                                        </SelectGroup>
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />
                                                        {errors.fontesSelecionadas && (
                                                            <span className="text-red-500 text-sm italic">{errors.fontesSelecionadas.message}</span>
                                                        )}
                                                    </p>

                                                    {
                                                        fontesSelecionadas.length > 0 && (
                                                            <div className="flex flex-col gap-3 w-full">
                                                                <Label className="text-lg">{fontesSelecionadas.length > 1 ? "Fontes selecionadas" : "Fonte selecionada"}</Label>
                                                                <div className="grid grid-cols-3 gap-3 border-gray-200 rounded-md border-1 p-3">
                                                                    {
                                                                        fontesSelecionadas.filter((f) => fontes.find((fnt) => fnt.id === f.id)).map((fnt: Fonte) => (
                                                                            <div key={fnt.id} className="flex w-fit gap-3 items-center border-gray-200 rounded-sm border-1 pr-3 overflow-hidden">
                                                                                <button className="h-full" onClick={() => {
                                                                                    const novaLista = fontesSelecionadas.filter((f) => f.id !== fnt.id)
                                                                                    setFontesSelecionadas(novaLista);
                                                                                    setValue("fontesSelecionadas", novaLista.map((tp) => tp.id));
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
                                                                                <p className="w-full text-sm py-1">{fnt.name}</p>
                                                                            </div>
                                                                        ))
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                    }

                                                    <div className="flex justify-end gap-4 mt-4">
                                                        <DialogClose
                                                            className={`
                                                                    transition ease-in-out text-white
                                                                    rounded-md px-3 bg-vermelho
                                                                    hover:cursor-pointer text-sm
                                                                `}
                                                            style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                                                        >
                                                            Cancelar
                                                        </DialogClose>

                                                        <Button
                                                            type="submit"
                                                            className={`
                                                                    flex bg-verde hover:bg-verde
                                                                    text-white hover:cursor-pointer
                                                                    active:scale-100
                                                                `}
                                                            style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                                                        >
                                                            Salvar
                                                        </Button>
                                                    </div>
                                                </form>
                                            </DialogContent>
                                        </Dialog>

                                        <Dialog open={idDialogExcluir === tipificacao.id} onOpenChange={(open) => setIdDialogExcluir(open ? tipificacao.id : null)}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    title="Excluir tipificação"
                                                    className={`
                                                            h-8 w-8 bg-vermelho hover:bg-vermelho
                                                            hover:cursor-pointer rounded-sm
                                                        `}
                                                    size={"icon"}
                                                >
                                                    <Trash />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Excluir Tipificação</DialogTitle>
                                                    <DialogDescription>
                                                        Tem certeza que deseja excluir a tipificação <strong>{tipificacao.name}</strong>?
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="flex justify-end gap-4 mt-4">
                                                    <DialogClose
                                                        className={`
                                                                transition ease-in-out
                                                                rounded-md px-3
                                                                hover:cursor-pointer
                                                            `}
                                                        style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                                                    >
                                                        Cancelar
                                                    </DialogClose>
                                                    <Button
                                                        className={`
                                                                flex bg-vermelho hover:bg-vermelho
                                                                text-white hover:cursor-pointer
                                                            `}
                                                        style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                                                        onClick={() => excluirTipificacao(tipificacao.id)}
                                                    >
                                                        Excluir
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </div>
                        )) : <p className="absolute left-1/2 top-10 translate-x-[-50%] text-gray-400 text-2xl text-center animate-pulse">Nenhuma tipificação encontrada.</p>
                        )
                    }
                </Masonry>

            </div>
        </div>
    )
}