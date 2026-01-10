"use client";

import BarraDePesquisa from "@/components/BarraDePesquisa";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";

import type { Fonte, Tipificacao } from "@/core";
import type { Ramo } from "@/core/ramo";
import type { Taxonomia } from "@/core/taxonomia";
import { formatarData } from "@/lib/utils";
import { getFontesService } from "@/service/fonte";
import { adicionarRamoService, atualizarRamoService, buscarRamosDaTaxonomiaService, excluirRamoService } from "@/service/ramo";
import { adicionarTaxonomiaService, atualizarTaxonomiaService, excluirTaxonomiaService } from "@/service/taxonomia";
import { getTipificacaoPorIdService, getTipificacoesService } from "@/service/tipificacao";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpDown, Calendar, Loader2, PencilLine, Plus, Trash, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { _undefined } from "zod/v4/core";
import Formulario from "./FormularioTaxonomia";
import BotaoCancelar from "@/components/botoes/BotaoCancelar";
import BotaoSalvar from "@/components/botoes/BotaoSalvar";
import BotaoExcluir from "@/components/botoes/BotaoExcluir";
import FormularioRamo from "./FormularioRamo";
import BotaoAdicionar from "@/components/botoes/BotaoAdicionar";
import BotaoVoltar from "@/components/botoes/BotaoVoltar";
import useUsuario from "@/data/hooks/useUsuario";
import { IconDownload } from "@tabler/icons-react";

const schemaTaxonomia = z.object({
    id_tipificacao: z.string().min(1),
    titulo: z.string().min(1, "O título da taxonomia é obrigatório!"),
    descricao: z.string().min(6, "A descrição da taxonomia é obrigatória!"),
    fontesSelecionadas: z.array(z.string().min(1)).min(1, "Selecione pelo menos uma fonte"),
})

const schemaRamo = z.object({
    tituloRamo: z.string().min(1, "O título do ramo é obrigatório!"),
    descricaoRamo: z.string().min(6, "A descrição do ramo é obrigatória!"),
})

export default function Taxonomias({ id }: { id: string }) {

    type FormData = z.infer<typeof schemaTaxonomia>;
    const { register, handleSubmit, control, formState: { errors }, setValue, reset } = useForm<FormData>({
        resolver: zodResolver(schemaTaxonomia),
        defaultValues: {
            fontesSelecionadas: [],
        }
    })

    type FormDataRamo = z.infer<typeof schemaRamo>;
    const {
        register: registerRamo,
        handleSubmit: handleSubmitRamo,
        formState: { errors: errorsRamo },
        setValue: setValueRamo,
        reset: resetRamo
    } = useForm<FormDataRamo>({
        resolver: zodResolver(schemaRamo)
    })

    const [carregandoTax, setCarregandoTax] = useState<boolean>(false);

    const { usuario } = useUsuario();

    const [idSelecionado, setIdSelecionado] = useState<string | undefined>("");
    const idTaxonomiaSelecionada = useRef<string | undefined>(undefined);
    const [taxonomiaSelecionada, setTaxonomiaSelecionada] = useState<Taxonomia | undefined>(undefined);
    const [tax, setTax] = useState<any[]>([]);

    const [fontesSelecionadas, setFontesSelecionadas] = useState<Fonte[] | undefined>([]);
    const [fontes, setFontes] = useState<Fonte[]>([]);

    const [tipificacoes, setTipificacoes] = useState<Tipificacao[]>([]);
    const [openTaxonomia, setOpenTaxonomia] = useState<boolean>(false);
    const [openTaxonomiaId, setOpenTaxonomiaId] = useState<string | null | undefined>(null);
    const [openDialogRamo, setOpenDialogRamo] = useState<boolean>(false);
    const [openDialogIdRamoExcluir, setOpenDialogIdRamoExcluir] = useState<string | null | undefined>(null);
    const [openDialogIdRamoEditar, setOpenDialogIdRamoEditar] = useState<string | null | undefined>(null);

    const [ramosDaTaxonomia, setRamosDaTaxonomia] = useState<Ramo[]>([]);
    const [ramosOriginais, setRamosOriginais] = useState<Ramo[]>([]);
    const [ramoSelecionado, setRamoSelecionado] = useState<Ramo | null | undefined>(null);

    const divRefs = useRef<Record<string, HTMLFormElement | HTMLSpanElement | HTMLDivElement | HTMLButtonElement | null>>({});
    const [taxFiltradas, setTaxFiltradas] = useState<any[]>([]);

    const termoBusca = useRef<string>("");

    async function getFontes() {
        const fnts = await getFontesService()
        setFontes(fnts || []);
    }

    async function getTipificacoes() {
        const tips = await getTipificacoesService()
        setTipificacoes(tips || []);
        setCarregandoTax(false);
    }

    async function getTipificacaoPorId() {
        setCarregandoTax(true);
        const tip = await getTipificacaoPorIdService(id);
        const taxsDaTip = tip?.taxonomies || [];
        setTax(taxsDaTip || []);
        setCarregandoTax(false);
    }

    useEffect(() => {
        getTipificacoes();
        setValue("id_tipificacao", id);
        getFontes();
        getTipificacaoPorId();
    }, []);

    useEffect(() => {
        filtrarTaxonomiasPorNome();
    }, [tax]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => { // Função para verificar clique fora de uma taxonomia para atualizar os ramos e melhorar usabilidade
            const target = e.target as Node;

            const clicouDentroDeAlguma = Object.values(divRefs.current).some((ref) =>
                ref?.contains(target)
            );

            if (!clicouDentroDeAlguma) {
                if (flagHook.current === true) return;
                idTaxonomiaSelecionada.current = undefined;
                setTaxonomiaSelecionada(undefined);
                setRamoSelecionado(null);
                setIdSelecionado("");
                return
            }

        };

        document.addEventListener("mouseup", handleClick);
        return () => document.removeEventListener("mouseup", handleClick);
    }, [openDialogRamo, openDialogIdRamoExcluir, openDialogIdRamoEditar, openTaxonomia]);

    const adicionarRamo = async (dados: FormDataRamo) => {
        const ramo: Ramo = {
            taxonomy_id: idTaxonomiaSelecionada.current,
            title: dados.tituloRamo,
            description: dados.descricaoRamo
        };

        const resposta = await adicionarRamoService(ramo);

        if (resposta !== 201) {
            toast.error("Erro ao adicionar ramo");
            return
        }

        toast.success("Ramo adicionado com sucesso!");

        setOpenDialogRamo(false);
        resetRamo();
        const ramos = await buscarRamosDaTaxonomiaService(idTaxonomiaSelecionada.current);
        setRamosOriginais(ramos || []);
        setRamosDaTaxonomia(ramos || []);
    }

    const excluirTaxonomia = async (taxonomiaId: string | undefined) => {
        setCarregandoTax(true);

        const resposta = await excluirTaxonomiaService(taxonomiaId);

        if (resposta !== 204) {
            toast.error("Erro ao excluir taxonomia");
        }

        toast.success("Taxonomia excluida com sucesso!");
        setIdSelecionado("");
        idTaxonomiaSelecionada.current = undefined;
        setTaxonomiaSelecionada(undefined);
        setRamosOriginais([]);

        await getTipificacaoPorId();
    };

    const atualizarRamoDaTaxonomia = async (data: FormDataRamo) => {

        const dado: Ramo = {
            id: ramoSelecionado?.id,
            taxonomy_id: idTaxonomiaSelecionada.current,
            title: data.tituloRamo,
            description: data.descricaoRamo
        }

        const resposta = await atualizarRamoService(dado);

        if (resposta !== 200) {
            toast.error("Erro ao atualizar ramo");
            return
        }

        atualizarTaxonomiaDepoisDeAdicionarRamo(idTaxonomiaSelecionada.current)

        resetRamo()
        toast.success("Ramo atualizado com sucesso!");
        setOpenDialogIdRamoEditar(null);
    }

    const excluirRamo = async (idRamo: string | undefined) => {

        await excluirRamoService(idRamo);

        const ramos = await buscarRamosDaTaxonomiaService(idTaxonomiaSelecionada.current);

        if (!ramos) {
            toast.error("Erro ao excluir ramo");
            return
        }
        setRamosOriginais(ramos || []);
        setRamosDaTaxonomia(ramos || []);

        toast.success("Ramo excluido com sucesso!");
    };

    async function atualizarTaxonomiaDepoisDeAdicionarRamo(idTaxonomia: string | undefined) {
        const ramos = await buscarRamosDaTaxonomiaService(idTaxonomia);
        setRamosOriginais(ramos || []);
        setRamosDaTaxonomia(ramos || []);
    }

    const adicionarTaxonomia = async (dados: FormData) => {

        setCarregandoTax(true);

        const novaTaxonomia: Taxonomia = {
            typification_id: id,
            title: dados.titulo,
            description: dados.descricao,
            source_ids: dados.fontesSelecionadas
        }

        const resposta = await adicionarTaxonomiaService(novaTaxonomia);

        if (resposta !== 201) {
            toast.error("Erro ao adicionar taxonomia");
            return
        }

        toast.success("Taxonomia adicionada com sucesso!");
        await getTipificacaoPorId();

        setOpenTaxonomia(false);
        reset()
        setFontesSelecionadas([]);
    }

    const atualizarTaxonomia = async (data: FormData) => {
        setCarregandoTax(true);

        const novaTaxonomia: Taxonomia = {
            id: idTaxonomiaSelecionada.current,
            typification_id: id,
            title: data.titulo,
            source_ids: data.fontesSelecionadas,
            description: data.descricao,
        }

        const resposta = await atualizarTaxonomiaService(novaTaxonomia);

        if (resposta !== 200) {
            toast.error("Erro ao atualizar taxonomia!");
            setCarregandoTax(false);
            return
        }

        toast.success("Taxonomia atualizada com sucesso!");

        reset();
        setOpenTaxonomiaId(null);
        await getTipificacaoPorId();
    }

    const buscarRamos = async (idTaxonomia: string | undefined) => {
        const ramos = await buscarRamosDaTaxonomiaService(idTaxonomia);
        setRamosOriginais(ramos || []);
        setRamosDaTaxonomia(ramos || []);
    }

    const filtrarTaxonomiasPorNome = () => {
        // Se for uma busca vazia, retorna todas as taxonomias
        if ((termoBusca.current?.trim() === "" || termoBusca.current === undefined)) {
            setTaxFiltradas(tax);
        }

        // Caso contrário, filtra as taxonomias com base no nome fornecido
        const resultadoFiltrado = tax.filter(taxonomia => taxonomia.title?.toLowerCase().startsWith(termoBusca.current.toLowerCase()));
        setTaxFiltradas(resultadoFiltrado);
    }

    const flagHook = useRef<boolean>(false);
    const refIdAux = useRef<string | undefined>(undefined);
    const [ordenarRamos, setOrdenarRamos] = useState<boolean>(false);

    function baixarTipificacao() {
        const url = process.env.NEXT_PUBLIC_URL_BASE;

        if (!url) {
            toast.error("Endereço do servidor não encontrado para baixar o arquivo!");
            return    
        }

        const enderecoDonwload = `${url}/typification/export/pdf?typification_id=${id}`;
        window.location.href = enderecoDonwload;
    }

    return (
        <div className="flex flex-col flex-1 h-full overflow-hidden">
            <div
                className="
                    flex items-center gap-2 bg-white
                    justify-between 
                "
            >
                <div className="flex flex-col gap-2 mb-1">
                    <div className="flex items-center gap-4">
                        <BotaoVoltar />
                        <div className="font-semibold text-4xl">

                            {
                                usuario?.access_level === "ADMIN" ? (
                                    <h3>Gestão de taxonomia e ramos</h3>
                                ) : (
                                    <h3>Taxonomia e ramos</h3>
                                )
                            }

                        </div>
                    </div>

                    <p className="max-w-[500px] truncate py-2 flex items-center gap-2">
                        <span className="italic">para a tipificação:</span>

                        {
                            !tipificacoes.find(t => t.id === id) ? (
                                <span><Loader2 className="animate-spin" /></span>
                            ) : (
                                <span title={tipificacoes.find(t => t.id === id)?.name} className="bg-vermelho text-white rounded-md px-3 py-1 inline-flex max-w-[450px] overflow-hidden text-ellipsis whitespace-nowrap">
                                    <strong className="truncate">
                                        {tipificacoes.find(t => t.id === id)?.name}
                                    </strong>
                                </span>
                            )
                        }

                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => baixarTipificacao()}
                        variant={"destructive"}
                        style={{ boxShadow: "0 0 3px rgba(0, 0 ,0,.5)" }}
                        className={`
                            flex rounded-md gap-2 items-center px-4 py-2
                            transition duration-100
                            bg-vermelho text-white
                            hover:cursor-pointer
                        `}
                        title="Download de um PDF contendo todas tipificações com suas respectivas taxonomias e ramos"
                    >
                        <span>Baixar tipificação</span>
                        <IconDownload size={18} />
                    </Button>

                    {
                        usuario?.access_level === "ADMIN" && (
                            <Dialog open={openTaxonomia} onOpenChange={setOpenTaxonomia}>
                                <DialogTrigger onClick={() => { setValue("id_tipificacao", id); flagHook.current = true }} asChild>
                                    <Button
                                        variant={"destructive"}
                                        className=" flex items-center gap-2 bg-vermelho cursor-pointer hover:shadow-md text-white py-2 px-4 rounded-sm"
                                        style={{ boxShadow: "0 0 3px rgba(0, 0 ,0,.5)" }}
                                    >
                                        <Plus color="white" size={18} />
                                        <p className="text-sm">Adicionar taxonomia</p>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent ref={(e) => { divRefs.current["adicionar_tax"] = e }} onCloseAutoFocus={() => { reset(); setFontesSelecionadas([]); flagHook.current = false; }}>
                                    <DialogHeader>
                                        <DialogTitle>Adicionar taxonomia</DialogTitle>
                                        <DialogDescription>
                                            Preencha os campos abaixo para adicionar uma nova taxonomia
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Formulario
                                        register={register}
                                        errors={errors}
                                        control={control}
                                        setValue={setValue}
                                        idTipificacao={id}
                                        fontes={fontes}
                                        fontesSelecionadas={fontesSelecionadas}
                                        setFontesSelecionadas={setFontesSelecionadas}
                                        tipificacoes={tipificacoes}
                                        divRefs={divRefs}
                                    />
                                    <DialogFooter>
                                        <DialogClose>
                                            <BotaoCancelar />
                                        </DialogClose>
                                        <BotaoSalvar onClick={handleSubmit(adicionarTaxonomia)} />
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )
                    }
                </div>

            </div>

            <div className="flex gap-3 max-h-full overflow-y-auto">
                <div className="flex flex-col w-1/2">
                    <div className="bg-white top-0 items-center gap-5 w-full px-0.5 pt-1 pb-1">
                        { tax.length !== 0 && <BarraDePesquisa className="w-[95.5%]" refInput={termoBusca} funcFiltrar={filtrarTaxonomiasPorNome} /> }
                    </div>

                    {
                        carregandoTax ? (
                            <div className="flex flex-col gap-2 items-center justify-center h-full">
                                <p className="animate-pulse">Carregando taxonomias...</p>
                                <Loader2 className="animate-spin" />
                            </div>
                        ) : (
                            <div className="overflow-y-auto h-full">
                                {
                                    taxFiltradas && taxFiltradas.length > 0 ? taxFiltradas.map((item, index) => (
                                        <Card
                                            ref={(e) => { divRefs.current["divtax_" + index] = e }}
                                            key={index}
                                            data-cy="item-taxonomia"
                                            className={`
                                        hover:cursor-pointer m-4 ml-0 
                                        ${idSelecionado && idSelecionado === index.toString() ? "bg-orange-100" : "hover:bg-gray-200"}
                                    `}
                                            onMouseDown={() => {
                                                setIdSelecionado(index.toString())
                                            }}
                                            onClick={() => {
                                                idTaxonomiaSelecionada.current = item.id;
                                                setTaxonomiaSelecionada(item);
                                                setIdSelecionado(index.toString())
                                                buscarRamos(item.id)
                                            }}
                                        >
                                            <CardHeader>
                                                <CardTitle className="text-2xl">{item.title}</CardTitle>
                                            </CardHeader>

                                            <CardContent>
                                                <p className="text-md">{item.description}</p>
                                            </CardContent>

                                            <CardFooter className="flex justify-between">
                                                <div ref={(e) => { divRefs.current["divtax_" + index] = e }} className="flex items-center gap-2">
                                                    <Calendar size={18} />
                                                    <span className="flex justify-center flex-col text-gray-400">
                                                        <span className="text-[10px] font-semibold mb-[-5px] mt-1">Criada em</span>
                                                        <span>{formatarData(item.created_at)}</span>
                                                    </span>
                                                </div>

                                                {
                                                    usuario?.access_level === "ADMIN" && (
                                                        <div className="flex gap-2">
                                                            <Dialog open={openTaxonomiaId === item.id} onOpenChange={(open) => setOpenTaxonomiaId(open ? item.id : null)}>
                                                                <DialogTrigger asChild>
                                                                    <button
                                                                        onClick={() => {
                                                                            flagHook.current = true
                                                                            refIdAux.current = item.id
                                                                            const fontesDaTaxonomia = item.sources
                                                                            setFontesSelecionadas(fontesDaTaxonomia)
                                                                            setValue("fontesSelecionadas", (fontesDaTaxonomia ?? []).map((f: any) => f.id))
                                                                            idTaxonomiaSelecionada.current = item.id
                                                                            setTaxonomiaSelecionada(item)
                                                                            setValue("id_tipificacao", refIdAux.current as string)
                                                                            setValue("titulo", item.title!)
                                                                            setValue("descricao", item.description!)
                                                                        }}
                                                                        title="Editar taxonomia"
                                                                        className="flex items-center justify-center h-8 w-8 bg-white rounded-sm border border-gray-300 hover:cursor-pointer"
                                                                    >
                                                                        <PencilLine className="h-4 w-4" strokeWidth={1.5} />
                                                                    </button>
                                                                </DialogTrigger>

                                                                <DialogContent
                                                                    ref={(e) => { divRefs.current["editartax_" + index] = e }}
                                                                    onCloseAutoFocus={() => { reset(); setFontesSelecionadas([]); flagHook.current = false; }}
                                                                >
                                                                    <DialogHeader>
                                                                        <DialogTitle>Editar taxonomia</DialogTitle>
                                                                        <DialogDescription>
                                                                            Atualize os dados da taxonomia selecionada
                                                                        </DialogDescription>
                                                                    </DialogHeader>

                                                                    <Formulario
                                                                        register={register}
                                                                        errors={errors}
                                                                        control={control}
                                                                        setValue={setValue}
                                                                        idTipificacao={id}
                                                                        fontes={fontes}
                                                                        fontesSelecionadas={fontesSelecionadas}
                                                                        setFontesSelecionadas={setFontesSelecionadas}
                                                                        tipificacoes={tipificacoes}
                                                                        divRefs={divRefs}
                                                                    />

                                                                    <DialogFooter>
                                                                        <DialogClose>
                                                                            <BotaoCancelar />
                                                                        </DialogClose>

                                                                        <BotaoSalvar onClick={handleSubmit(atualizarTaxonomia)} />
                                                                    </DialogFooter>

                                                                </DialogContent>
                                                            </Dialog>

                                                            <BotaoExcluir
                                                                item={item}
                                                                tipo="taxonomia"
                                                                funcExcluir={excluirTaxonomia}
                                                            />
                                                        </div>
                                                    )
                                                }


                                            </CardFooter>
                                        </Card>
                                    )) : (
                                        <p className="mx-auto mt-8 text-center text-lg animate-pulse w-fit">Nenhuma taxonomia correspondente para esta tipificação</p>
                                    )
                                }
                            </div>
                        )
                    }
                </div>

                <div className="w-1/2 mx-auto overflow-hidden scrollbar-hide">
                    <Card ref={(e) => { divRefs.current["card_ramos"] = e }} className="flex flex-col mx-auto h-full ml-1">
                        <CardHeader>
                            <CardTitle className="flex flex-row justify-between items-center sticky top-0">
                                <h1 className="text-2xl">Ramos</h1>

                                {
                                    usuario?.access_level === "ADMIN" && (
                                        <Dialog open={openDialogRamo} onOpenChange={() => setOpenDialogRamo(!openDialogRamo)}>
                                            <DialogTrigger onClick={() => { flagHook.current = true }} asChild>
                                                {
                                                    taxonomiaSelecionada &&
                                                    <div>
                                                        <BotaoAdicionar divRefs={divRefs} texto="Adicionar ramo" />
                                                    </div>
                                                }

                                            </DialogTrigger>

                                            <DialogContent
                                                ref={(e) => { divRefs.current["dialog_ramo_"] = e }}
                                                onCloseAutoFocus={() => { resetRamo(); flagHook.current = false; }}
                                            >
                                                <DialogHeader>
                                                    <DialogTitle>Adicionar Ramo</DialogTitle>
                                                    <DialogDescription>
                                                        Preencha os campos abaixo para adicionar um novo ramo.
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <FormularioRamo
                                                    divRefs={divRefs}
                                                    registerRamo={registerRamo}
                                                    errorsRamo={errorsRamo}
                                                />

                                                <DialogFooter>
                                                    <DialogClose>
                                                        <BotaoCancelar />
                                                    </DialogClose>

                                                    <BotaoSalvar onClick={handleSubmitRamo(adicionarRamo)} />
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )
                                }

                            </CardTitle>

                        </CardHeader>

                        <CardContent className="flex flex-col h-[calc(100%-70px)]">
                            {taxonomiaSelecionada ? (
                                ramosDaTaxonomia.length > 0 ? (
                                    <div className="flex flex-col h-full border rounded " ref={(e) => { divRefs.current["tabela_ramos_wrapper"] = e; }}>

                                        {/* Tabela só com o cabeçalho */}
                                        <table className="w-full table-fixed border-collapse">
                                            <thead className="bg-gray-100 sticky top-0 z-10 border-b">
                                                <tr>
                                                    <th className="p-2 font-semibold w-1/3">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <span>Título</span>
                                                            <span
                                                                title="Ordenar ramos por nome"
                                                                className="cursor-pointer hover:bg-zinc-200 rounded-md p-2"
                                                                onClick={() => {
                                                                    if (ordenarRamos) setRamosDaTaxonomia(ramosOriginais);
                                                                    if (!ordenarRamos) {
                                                                        const ramosOrdenados = [...ramosDaTaxonomia].sort((a, b) =>
                                                                            a.title.localeCompare(b.title)
                                                                        );
                                                                        setRamosDaTaxonomia(ramosOrdenados);
                                                                    }
                                                                    setOrdenarRamos(!ordenarRamos);
                                                                }}
                                                            >
                                                                <ArrowUpDown size={15} />
                                                            </span>
                                                        </div>
                                                    </th>
                                                    <th className="p-2 font-semibold text-left w-1/2">Descrição</th>

                                                    {usuario?.access_level === "ADMIN" && (
                                                        <th className="p-2 font-semibold text-center w-1/6">Ações</th>
                                                    )}

                                                </tr>
                                            </thead>
                                        </table>

                                        {/* Tabela só com o corpo e scroll */}
                                        <div className="h-auto overflow-y-auto">
                                            <table className="w-full table-fixed border-collapse">
                                                <tbody>
                                                    {ramosDaTaxonomia.map((ramo) => (
                                                        <tr key={ramo.id} className="border-b hover:bg-gray-50">
                                                            <td className="p-2 align-top w-1/3">{ramo.title}</td>

                                                            <td className="p-2 align-top w-1/2">
                                                                <div className="pr-2">
                                                                    {ramo.description}
                                                                </div>
                                                            </td>

                                                            {
                                                                usuario?.access_level === "ADMIN" && (
                                                                    <td className="p-2 w-1/6">
                                                                        <div className="flex justify-center items-center gap-2">
                                                                            <Dialog
                                                                                open={openDialogIdRamoEditar === ramo.id}
                                                                                onOpenChange={(open) => { setOpenDialogIdRamoEditar(open ? ramo.id : null) }}
                                                                            >
                                                                                <DialogTrigger asChild>
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            setValueRamo("tituloRamo", ramo.title || "");
                                                                                            setValueRamo("descricaoRamo", ramo.description || "");
                                                                                            setRamoSelecionado(ramo);
                                                                                            flagHook.current = true;
                                                                                        }}
                                                                                        title="Editar ramo"
                                                                                        className="flex items-center justify-center h-8 w-8 bg-white rounded-sm border border-gray-300 hover:cursor-pointer"
                                                                                    >
                                                                                        <PencilLine className="h-4 w-4" strokeWidth={1.5} />
                                                                                    </button>
                                                                                </DialogTrigger>
                                                                                <DialogContent
                                                                                    ref={(e) => { divRefs.current["dialog_ramo_" + ramo.id] = e }}
                                                                                    onCloseAutoFocus={() => { flagHook.current = false; resetRamo() }}
                                                                                >
                                                                                    <DialogHeader>
                                                                                        <DialogTitle>Editar ramo</DialogTitle>
                                                                                        <DialogDescription>Atualize os dados do ramo selecionado</DialogDescription>
                                                                                    </DialogHeader>
                                                                                    <FormularioRamo
                                                                                        divRefs={divRefs}
                                                                                        registerRamo={registerRamo}
                                                                                        errorsRamo={errorsRamo}
                                                                                    />
                                                                                    <DialogFooter>
                                                                                        <DialogClose>
                                                                                            <BotaoCancelar />
                                                                                        </DialogClose>
                                                                                        <BotaoSalvar onClick={handleSubmitRamo(atualizarRamoDaTaxonomia)} />
                                                                                    </DialogFooter>
                                                                                </DialogContent>
                                                                            </Dialog>

                                                                            <BotaoExcluir
                                                                                flagHook={flagHook}
                                                                                divRefs={divRefs}
                                                                                onClick={() => flagHook.current = true}
                                                                                item={ramo}
                                                                                tipo="ramo"
                                                                                funcExcluir={excluirRamo}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                )
                                                            }

                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>


                                ) : (
                                    <p className="ml-3 animate-pulse">
                                        Nenhum ramo disponível para a taxonomia selecionada.
                                    </p>
                                )
                            ) : (
                                taxFiltradas.length === 0 ? (
                                    <p className="ml-3 animate-pulse">Nenhum ramo disponível. Não há taxonomia cadastrada.</p>
                                ) : (
                                    <p className="ml-3 animate-pulse">Selecione uma taxonomia.</p>
                                )
                            )}

                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}