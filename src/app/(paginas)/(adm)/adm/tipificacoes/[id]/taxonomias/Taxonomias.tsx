"use client";

import BarraDePesquisa from "@/components/BarraDePesquisa";
import EditarRamo from "@/components/ramos/EditarRamo";
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
import { adicionarRamoService, buscarRamosDaTaxonomiaService, excluirRamoService } from "@/service/ramo";
import { adicionarTaxonomiaService, atualizarTaxonomiaService, excluirTaxonomiaService } from "@/service/taxonomia";
import { getTipificacaoPorIdService, getTipificacoesService } from "@/service/tipificacao";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpDown, Calendar, Loader2, PencilLine, Plus, Trash, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { _undefined } from "zod/v4/core";
import Formulario from "./Formulario";
import BotaoCancelar from "@/components/botoes/BotaoCancelar";
import BotaoSalvar from "@/components/botoes/BotaoSalvar";
import BotaoExcluir from "@/components/botoes/BotaoExcluir";

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
    const { register: registerRamo, handleSubmit: handleSubmitRamo, formState: { errors: errorsRamo }, reset: resetRamo } = useForm<FormDataRamo>({
        resolver: zodResolver(schemaRamo)
    })

    const [carregandoTax, setCarregandoTax] = useState<boolean>(false);

    const [idSelecionado, setIdSelecionado] = useState<string | undefined>("");
    const [taxonomiaSelecionada, setTaxonomiaSelecionada] = useState<Taxonomia | null | undefined>(null);
    const [descricaoRamo, setDescricaoRamo] = useState<string>("");
    const [tituloRamo, setTituloRamo] = useState<string>("");
    const [tax, setTax] = useState<any[]>([]);

    const [fontesSelecionadas, setFontesSelecionadas] = useState<Fonte[] | undefined>([]);
    const [fontes, setFontes] = useState<Fonte[]>([]);

    const [tipificacoes, setTipificacoes] = useState<Tipificacao[]>([]);
    const [idTipificacao, setIdTipificacao] = useState<string>("");

    
    const [openTaxonomia, setOpenTaxonomia] = useState<boolean>(false);
    const [openTaxonomiaId, setOpenTaxonomiaId] = useState<string | null | undefined>(null);
    const [openDialogRamo, setOpenDialogRamo] = useState<boolean>(false);
    const [openDialogIdRamoExcluir, setOpenDialogIdRamoExcluir] = useState<string | null | undefined>(null);

    const [ramosDaTaxonomia, setRamosDaTaxonomia] = useState<Ramo[]>([]);
    const [ramosOriginais, setRamosOriginais] = useState<Ramo[]>([]);
    const [ramoSelecionado, setRamoSelecionado] = useState<Ramo | null | undefined>(null);

    const divRefs = useRef<Record<string, HTMLDivElement | HTMLButtonElement | null>>({});
    const [taxFiltradas, setTaxFiltradas] = useState<any[]>([]);

    let termoBusca = useRef<string>("");


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
        setIdTipificacao(id);
        getTipificacoes();
        setValue("id_tipificacao", id);
        getFontes();
        getTipificacaoPorId();
    }, []);

    useEffect(() => {
        const termo = termoBusca.current || "";

        console.log("TERMO BUSCA NO USEEFFECT DE TAXONOMIAS:", termo);

        filtrarTaxonomiasPorNome();
    }, [tax]);
    

    useEffect(() => {
        if (openTaxonomiaId) {
            const fonteParaEditar = fontes.find(f => f.id === openTaxonomiaId);
            if (fonteParaEditar) {
                setValue("titulo", fonteParaEditar.name);
                setValue("descricao", fonteParaEditar.description || "");
            }
        }
    }, [openTaxonomiaId, fontes, setValue]);

    // Função para verificar clique fora de uma taxonomia para atualizar os ramos e melhorar usabilidade
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as Node;

            const clicouDentroDeAlguma = Object.values(divRefs.current).some((ref) =>
                ref?.contains(target)
            );

            // console.log("clicouDentroDeAlguma: ", clicouDentroDeAlguma);
            // console.log("VALOR DE FLAGHOOK:", flagHook.current);
            // console.log("VALOR DE openIdDialogRamoExcluir:", openDialogIdRamoExcluir);

            if ((!clicouDentroDeAlguma && !openDialogRamo)) {
                if (flagHook.current === true) return
                setTaxonomiaSelecionada(null);
                setIdSelecionado("");
                return
            }

            if ((!clicouDentroDeAlguma && openDialogIdRamoExcluir === null)) {
                if (flagHook.current === true) return
                setTaxonomiaSelecionada(null);
                setIdSelecionado("");
                return
            }
        };


        document.addEventListener("mouseup", handleClick);
        return () => document.removeEventListener("mouseup", handleClick);
    }, [openDialogRamo, openDialogIdRamoExcluir]);


    const adicionarRamo = async () => {
        const ramo: Ramo = {
            taxonomy_id: taxonomiaSelecionada?.id,
            title: tituloRamo,
            description: descricaoRamo,
        };

        const resposta = await adicionarRamoService(ramo);

        if (resposta !== 201) {
            toast.error("Erro ao adicionar ramo");
            return
        }

        toast.success("Ramo adicionado com sucesso!");

        setOpenDialogRamo(false);
        limparCamposRamo();
        const ramos = await buscarRamosDaTaxonomiaService(taxonomiaSelecionada?.id);
        setRamosOriginais(ramos || []);
        setRamosDaTaxonomia(ramos || []);
    }

    const excluirTaxonomia = async (taxonomiaId: string | undefined) => {
        setCarregandoTax(true);
        try {
            const resposta = await excluirTaxonomiaService(taxonomiaId);

            if (resposta !== 204) {
                toast.error("Erro ao excluir taxonomia");
            }

            toast.success("Taxonomia excluida com sucesso!");
            setIdSelecionado("");
            setTaxonomiaSelecionada(null);
            setRamosOriginais([]);

            await getTipificacaoPorId();

        } catch (error) {
            toast.error('Erro ao excluir taxonomia!');
        }
    };

    const excluirRamo = async (idRamo: string | undefined, idTaxonomia: string | undefined) => {
        try {
            await excluirRamoService(idRamo);

            const ramos = await buscarRamosDaTaxonomiaService(idTaxonomia);
            setRamosOriginais(ramos || []);
            setRamosDaTaxonomia(ramos || []);

            toast.success("Ramo excluido com sucesso!");


        } catch (error) {
            toast.error('Erro ao excluir ramo!');
        }
    };

    async function atualizarTaxonomiaDepoisDeAdicionarRamo(idTaxonomia: string | undefined) {
        const ramos = await buscarRamosDaTaxonomiaService(idTaxonomia);
        setRamosOriginais(ramos || []);
        setRamosDaTaxonomia(ramos || []);
    }

    const adicionarTaxonomia = async (dados: FormData) => {

        setCarregandoTax(true);
        
        const novaTaxonomia: Taxonomia = {
            typification_id: idTipificacao ? idTipificacao : id,
            title: dados.titulo,
            description: dados.descricao,
            source_ids: dados.fontesSelecionadas
        }
        console.log("Dados do form de taxonomia:", novaTaxonomia);

        const resposta = await adicionarTaxonomiaService(novaTaxonomia);

        if (resposta !== 201) {
            toast.error("Erro ao adicionar taxonomia");
            return
        }

        toast.success("Taxonomia adicionada com sucesso!");
        await getTipificacaoPorId();
        
        setOpenTaxonomia(false);
        limparCamposTaxonomia();
    }

    const atualizarTaxonomia = async (data: FormData) => {
        setCarregandoTax(true);

        const novaTaxonomia: Taxonomia = {
            id: taxonomiaSelecionada?.id,
            typification_id: idTipificacao ? idTipificacao : id,
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

        limparCamposTaxonomia();
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

    function limparCamposTaxonomia() {
        setIdTipificacao("");
        reset({
            fontesSelecionadas: [],
            titulo: "",
            descricao: ""
        })
    }

    function limparCamposRamo() {
        setDescricaoRamo("");
        setRamoSelecionado(null);
        flagHook.current = false;
        resetRamo()
    }

    let flagHook = useRef<boolean>(false);
    let refIdAux = useRef<string | undefined>(undefined);
    const [ordenarRamos, setOrdenarRamos] = useState<boolean>(false);

    return (
        <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-2 justify-between overflow-hidden">
                <div className="flex flex-col gap-2 mb-1">
                    <p className="font-semibold text-4xl">Gestão de taxonomia e ramos</p>
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

                <Dialog open={openTaxonomia} onOpenChange={setOpenTaxonomia}>
                    <DialogTrigger onClick={() => setValue("id_tipificacao", id)} asChild>
                        <Button
                            variant={"destructive"}
                            className=" flex items-center gap-2 bg-vermelho cursor-pointer hover:shadow-md text-white py-2 px-4 rounded-sm"
                            style={{ boxShadow: "0 0 3px rgba(0, 0 ,0,.5)" }}
                        >
                            <Plus color="white" size={18} />
                            <p className="text-sm">Adicionar taxonomia</p>
                        </Button>
                    </DialogTrigger>

                    <DialogContent onCloseAutoFocus={limparCamposTaxonomia}>
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
                            <DialogClose asChild>
                                <BotaoCancelar />
                            </DialogClose>

                            <BotaoSalvar onClick={handleSubmit(adicionarTaxonomia)} />
                            
                        </DialogFooter>

                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex h-[70vh] gap-3 relative pb-10">
                <div className="flex flex-col w-1/2 overflow-y-auto">                     
                    <div className="flex sticky bg-white top-0 items-center gap-5 w-full px-0.5 pt-1 pb-4">
                        <BarraDePesquisa refInput={termoBusca} funcFiltrar={filtrarTaxonomiasPorNome} />
                    </div>

                    {
                        carregandoTax ? (
                            <div className="flex flex-col gap-2 items-center justify-center h-full">
                                <p className="animate-pulse">Carregando taxonomias...</p>
                                <Loader2 className="animate-spin" />
                            </div>
                        ) : (
                            taxFiltradas && taxFiltradas.length > 0 ? taxFiltradas.map((item, index) => (
                                <Card
                                    ref={(e) => { divRefs.current["divtax_" + index] = e }}
                                    key={index}
                                    className={`
                                        hover:cursor-pointer m-4 ml-0 
                                        ${idSelecionado && idSelecionado === index.toString() ? "bg-orange-100" : "hover:bg-gray-200"}
                                    `}
                                    onMouseDown={() => {
                                        setIdSelecionado(index.toString())
                                    }}
                                    onClick={() => {
                                        setTaxonomiaSelecionada(item)
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

                                        <div className="flex gap-2">
                                            <Dialog open={openTaxonomiaId === item.id} onOpenChange={(open) => setOpenTaxonomiaId(open ? item.id : null)}>
                                                <DialogTrigger asChild>
                                                    <button
                                                        onClick={() => {
                                                            refIdAux.current = item.id
                                                            const fontesDaTaxonomia = item.sources 
                                                            setFontesSelecionadas(fontesDaTaxonomia)
                                                            setIdTipificacao(item.tip_assoc_id as string)
                                                            setValue("fontesSelecionadas", (fontesDaTaxonomia ?? []).map((f: any) => f.id))
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
                                                    onCloseAutoFocus={limparCamposTaxonomia}
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
                                                        <DialogClose asChild>
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
                                    </CardFooter>
                                </Card>
                            )) : (
                                <p className="mx-auto mt-8 text-center text-lg animate-pulse w-fit">Nenhuma taxonomia correspondente para esta tipificação</p>
                            )
                        )
                    }
                </div>

                <div className="w-1/2 relative overflow-y-auto px-1">
                    <Card ref={(e) => { divRefs.current["card_ramos"] = e }} className="mx-4 mt-4">
                        <CardHeader>
                            <CardTitle className="flex flex-row justify-between items-center">
                                <h1 className="text-2xl">Ramos</h1>
                                <Dialog open={openDialogRamo} onOpenChange={setOpenDialogRamo}>
                                    <DialogTrigger asChild>
                                        {
                                            taxonomiaSelecionada &&
                                            <div ref={(e) => { divRefs.current["botao"] = e }}>
                                                <Button
                                                    variant={"destructive"}
                                                    className=" flex items-center gap-2 bg-vermelho cursor-pointer hover:shadow-md text-white py-2 px-4 rounded-sm"
                                                    style={{ boxShadow: "0 0 3px rgba(0, 0 ,0,.5)" }}
                                                >
                                                    <Plus size={18} />
                                                    <p className="text-sm">Adicionar ramo</p>
                                                </Button>
                                            </div>
                                        }

                                    </DialogTrigger>

                                    <DialogContent ref={(e) => { divRefs.current["dialog_ramo_"] = e }} onCloseAutoFocus={limparCamposRamo}>
                                        <DialogHeader>
                                            <DialogTitle>Adicionar Ramo</DialogTitle>
                                            <DialogDescription>
                                                Preencha os campos abaixo para adicionar um novo ramo.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <form onSubmit={handleSubmitRamo(adicionarRamo)} className="space-y-4">

                                            <div>
                                                <label htmlFor="titleRamo" className="block text-sm font-medium text-gray-700">
                                                    Nome do Ramo
                                                </label>

                                                <input
                                                    {...registerRamo("tituloRamo")}
                                                    type="text"
                                                    id="titleRamo"
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                                />
                                                {errorsRamo.tituloRamo && (<p className="text-red-500 text-sm mt-1 italic">{errorsRamo.tituloRamo.message}</p>)}
                                            </div>

                                            <div>
                                                <label htmlFor="descriptionRamo" className="block text-sm font-medium text-gray-700">
                                                    Descrição do Ramo
                                                </label>

                                                <textarea
                                                    {...registerRamo("descricaoRamo")}
                                                    onChange={(e) => setDescricaoRamo(e.target.value)}
                                                    id="descriptionRamo"
                                                    placeholder="Digite uma descrição para o ramo"
                                                    rows={4}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                                />
                                                {errorsRamo.descricaoRamo && (<p className="text-red-500 text-sm mt-1 italic">{errorsRamo.descricaoRamo.message}</p>)}
                                            </div>

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
                            </CardTitle>

                        </CardHeader>

                        <CardContent className="">
                            {taxonomiaSelecionada ? (
                                ramosDaTaxonomia.length > 0 ? (
                                    <table
                                        ref={(e) => {
                                            divRefs.current["tabela_ramos"] = e;
                                        }}
                                        className="w-full border-collapse text-left"
                                    >
                                        <thead className="bg-gray-100 border-b">
                                            <tr>
                                                <th className="flex items-center justify-between gap-2 p-2 font-semibold">
                                                    <span>Título</span>
                                                    <span
                                                        title="Ordenar ramos por nome"
                                                        className="cursor-pointer hover:bg-zinc-200 rounded-md p-2"
                                                        onClick={() => {
                                                            if (ordenarRamos) {
                                                                setRamosDaTaxonomia(ramosOriginais)
                                                            }

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
                                                </th>
                                                <th className="p-2 font-semibold">Descrição</th>
                                                <th className="p-2 font-semibold text-center">Ações</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {ramosDaTaxonomia.map((ramo, index) => (
                                                <tr key={ramo.id} className="border-b hover:bg-gray-50">
                                                    <td className="p-2">{ramo.title}</td>
                                                    <td className="p-2 max-h-96 overflow-y-auto">{ramo.description}</td>
                                                    <td className="p-2">
                                                        <div className="flex justify-center items-center gap-2">
                                                            {/* Botão editar */}
                                                            <EditarRamo
                                                                flagHook={flagHook}
                                                                divRefs={divRefs}
                                                                atualizarRamos={atualizarTaxonomiaDepoisDeAdicionarRamo}
                                                                idTaxonomia={taxonomiaSelecionada.id}
                                                                ramo={ramo}
                                                            />

                                                            {/* Botão excluir */}
                                                            <Dialog
                                                                open={openDialogIdRamoExcluir === ramo.id}
                                                                onOpenChange={(open) =>
                                                                    setOpenDialogIdRamoExcluir(open ? ramo.id : null)
                                                                }
                                                            >
                                                                <DialogTrigger
                                                                    onClick={() => {
                                                                        flagHook.current = true;
                                                                    }}
                                                                    asChild
                                                                >
                                                                    <button
                                                                        title="Excluir ramo"
                                                                        className="flex items-center justify-center h-8 w-8 bg-red-700 hover:cursor-pointer text-white rounded-sm border border-gray-300 hover:bg-red-600 transition"
                                                                    >
                                                                        <Trash className="h-4 w-4" strokeWidth={1.5} />
                                                                    </button>
                                                                </DialogTrigger>

                                                                <DialogContent
                                                                    ref={(e) => {
                                                                        divRefs.current["excluir_" + index] = e;
                                                                    }}
                                                                    onCloseAutoFocus={() => {
                                                                        flagHook.current = false;
                                                                    }}
                                                                >
                                                                    <DialogHeader>
                                                                        <DialogTitle>Excluir ramo</DialogTitle>
                                                                        <DialogDescription>
                                                                            Tem certeza que deseja excluir o ramo{" "}
                                                                            <strong>{ramo.title}</strong>?
                                                                        </DialogDescription>
                                                                    </DialogHeader>

                                                                    <div className="flex justify-end gap-4 mt-4">
                                                                        <DialogClose
                                                                            className="transition ease-in-out text-black rounded-md px-3 hover:bg-gray-200 cursor-pointer"
                                                                            style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                                                                        >
                                                                            Cancelar
                                                                        </DialogClose>

                                                                        <Button
                                                                            className="flex bg-vermelho hover:bg-vermelho text-white hover:cursor-pointer"
                                                                            style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                                                                            onClick={() => {
                                                                                excluirRamo(ramo.id, taxonomiaSelecionada.id);
                                                                            }}
                                                                        >
                                                                            Excluir
                                                                        </Button>
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="ml-3 animate-pulse">
                                        Nenhum ramo disponível para a taxonomia selecionada.
                                    </p>
                                )
                            ) : (
                                <p className="ml-3 animate-pulse">Selecione uma taxonomia.</p>
                            )}

                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );

}