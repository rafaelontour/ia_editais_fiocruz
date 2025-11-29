"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Fonte, Tipificacao } from "@/core";
import { getFontesService } from "@/service/fonte";
import { getTipificacoesService, adicionarTipificacaoService, excluirTipificacaoService, atualizarTipificacaoService } from "@/service/tipificacao";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Calendar, Loader2, PencilLine, Plus, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import { toast } from "sonner";
import { formatarData } from "@/lib/utils";
import Link from "next/link";
import BotaoExcluir from "@/components/BotaoExcluir";
import BotaoCancelar from "@/components/botoes/BotaoCancelar";
import BotaoSalvar from "@/components/botoes/BotaoSalvar";
import Formulario from "./Formulario";
import BarraDePesquisa from "@/components/BarraDePesquisa";
import { useForm } from "react-hook-form";
import { IconHierarchy2 } from "@tabler/icons-react";
import Div from "@/components/Div";

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
            setCarregandoTipificacoes(false);
        }

        carregarTudo();
    }, []);

    useEffect(() => {
        if (idDialogEditar) {
            const tipificacaoParaEditar = tipificacoes.find(t => t.id === idDialogEditar);
            if (tipificacaoParaEditar) {
                setValue("nome", tipificacaoParaEditar.name ?? "");
                setValue("fontesSelecionadas", tipificacaoParaEditar.sources?.map((f: Fonte) => f.id) ?? []);
            }
        }
    }, [idDialogEditar, tipificacoes, setValue]);


    const getTipificacoes = async () => {
        const dados = await getTipificacoesService();

        if (dados === null) {
            toast.error("Erro ao buscar tipificacoes")
            return
        }

        setTipificacoes(dados ?? []);
        setTipificacoesFiltradas(dados ?? []);
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
            setCarregandoTipificacoes(false);
            return
        }

        toast.success("Tipificacao adicionada com sucesso!")

        await getTipificacoes();
        setDialogTipificacao(false);
        limparCampos();
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
            setCarregandoTipificacoes(false);
            return
        }

        toast.success("Tipificacao atualizada com sucesso!")

        await getTipificacoes();
        limparCampos();
        setIdDialogEditar(null);
    }

    const excluirTipificacao = async (id: string) => {
        setCarregandoTipificacoes(true);

        const resposta = await excluirTipificacaoService(id);

        if (resposta !== 204) {
            toast.error("Erro ao excluir tipificação!")
            return
        }

        toast.success("Tipificacao excluida com sucesso!");

        await getTipificacoes();
    }

    const filtrarPraEdicao = (ids: string[] | undefined): Fonte[] => {
        return fontes.filter(fonte => ids?.includes(fonte.id));
    }

    function limparCampos() {
        reset();
        setFontesSelecionadas([]);
    }

    function filtrarTipificacao() {
        if (termoBusca.current.trim() === "") {
            setTipificacoesFiltradas(tipificacoes);
            return
        }

        const tf = tipificacoes.filter(
            tipificacao => tipificacao.name && tipificacao.name.toLowerCase().startsWith(termoBusca.current.toLowerCase())
        )
        
        setTipificacoesFiltradas(tf);
    }

    return (
        <div>
            <div className="flex flex-col gap-5 pb-10">
                <div className="flex flex-col gap-5 sticky top-0 z-10 bg-white justify-between w-full items-center">
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

                                <Formulario
                                    fontes={fontes}
                                    fontesSelecionadas={fontesSelecionadas}
                                    setFontesSelecionadas={setFontesSelecionadas}
                                    control={control}
                                    setValue={setValue}
                                    register={register}
                                    errors={errors}
                                />

                                <DialogFooter>
                                    <DialogClose>
                                        <BotaoCancelar />
                                    </DialogClose>

                                    <BotaoSalvar onClick={handleSubmit(adicionarTipificacao)} />
                                </DialogFooter>
                                
                            </DialogContent>
                        </Dialog>
                    </div>

                    <BarraDePesquisa refInput={termoBusca} funcFiltrar={filtrarTipificacao} />
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
                            <Div key={index}>
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-2xl font-semibold">{tipificacao.name}</h2>
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
                                                <IconHierarchy2 size={20} color="black" />
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

                                                <Formulario
                                                    fontes={fontes}
                                                    fontesSelecionadas={fontesSelecionadas}
                                                    setFontesSelecionadas={setFontesSelecionadas}
                                                    control={control}
                                                    setValue={setValue}
                                                    register={register}
                                                    errors={errors}
                                                />

                                                <DialogFooter>
                                                    <DialogClose>
                                                        <BotaoCancelar />
                                                    </DialogClose>

                                                    <BotaoSalvar onClick={handleSubmit(atualizarTipificacao)} />
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                        <BotaoExcluir funcExcluir={excluirTipificacao} item={tipificacao} tipo="tipificação" />
                                    </div>
                                </div>
                            </Div>
                        )) : <p className="absolute left-1/2 top-10 translate-x-[-50%] text-gray-400 text-2xl text-center animate-pulse">Nenhuma tipificação encontrada.</p>
                        )
                    }
                </Masonry>

            </div>
        </div>
    )
}