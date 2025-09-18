"use client";

import EditarEdital from "@/components/editais/EditarEdital";
import EditarRamo from "@/components/ramos/EditarRamo";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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

import { Label } from "@/components/ui/label";
import { Fonte, Tipificacao } from "@/core";
import { Ramo } from "@/core/ramo";
import { Taxonomia } from "@/core/taxonomia";
import { getFontesService } from "@/service/fonte";
import { adicionarRamoService, atualizarRamoService, buscarRamosDaTaxonomiaService, excluirRamoService } from "@/service/ramo";
import { adicionarTaxonomiaService, atualizarTaxonomiaService, excluirTaxonomiaService, getTaxonomiasService } from "@/service/taxonomia";
import { getTipificacoesService } from "@/service/tipificacao";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, PencilLine, Plus, Trash } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const schemaTaxonomia = z.object({
    id_tipificacao: z.array(z.string().min(1)),
    titulo: z.string().min(1, "O título da taxonomia é obrigatório!"),
    descricao: z.string().min(6, "A descrição da taxonomia é obrigatória!"),
    fontesSelecionadas: z.array(z.string().min(1)).min(1, "Selecione pelo menos uma fonte"),
})

const schemaRamo = z.object({
    tituloRamo: z.string().min(1, "O título do ramo é obrigatório!"),
    descricaoRamo: z.string().min(6, "A descrição do ramo é obrigatória!"),
})


export default function Taxonomias() {
    type FormData = z.infer<typeof schemaTaxonomia>;
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormData>({
        resolver: zodResolver(schemaTaxonomia),
        defaultValues: {
            fontesSelecionadas: []
        }
    })

    type FormDataRamo = z.infer<typeof schemaRamo>;
    const { register: registerRamo, handleSubmit: handleSubmitRamo, formState: { errors: errorsRamo }, reset: resetRamo } = useForm<FormDataRamo>({
        resolver: zodResolver(schemaRamo)
    })

    const [idSelecionado, setIdSelecionado] = useState<string | undefined>("");
    const [taxonomiaSelecionada, setTaxonomiaSelecionada] = useState<Taxonomia | null | undefined>(null);
    const [tituloTaxonomia, setTituloTaxonomia] = useState<string>("");
    const [descricaoTaxonomia, setDescricaoTaxonomia] = useState<string>("");
    const [descricaoRamo, setDescricaoRamo] = useState<string>("");
    const [tituloRamo, setTituloRamo] = useState<string>("");
    const [tax, setTax] = useState<Taxonomia[]>([]);

    const [fontesSelecionadas, setFontesSelecionadas] = useState<Fonte[]>([]);
    const [fontes, setFontes] = useState<Fonte[]>([]);
    const [tipificacoes, setTipificacoes] = useState<Tipificacao[]>([]);
    const [idTipificacao, setIdTipificacao] = useState<string>("");

    const [openTaxonomia, setOpenTaxonomia] = useState<boolean>(false);
    const [openTaxonomiaId, setOpenTaxonomiaId] = useState<string | null | undefined>(null);
    const [openDialogRamo, setOpenDialogRamo] = useState<boolean>(false);
    const [openDialogIdRamo, setOpenDialogIdRamo] = useState<string | null | undefined>(null);
    const [openDialogIdRamoExcluir, setOpenDialogIdRamoExcluir] = useState<string | null | undefined>(null);

    const [ramosDaTaxonomia, setRamosDaTaxonomia] = useState<Ramo[]>([]);
    const [ramoSelecionado, setRamoSelecionado] = useState<Ramo | null | undefined>(null);

    const divRefs = useRef<Record<string, HTMLDivElement | HTMLButtonElement | null>>({});

    async function getTaxonomias() {
        const taxs = await getTaxonomiasService()
        setTax(taxs || []);
    }

    async function getFontes() {
        const fnts = await getFontesService()
        setFontes(fnts || []);
    }

    async function getTipificacoes() {
        const tips = await getTipificacoesService()
        setTipificacoes(tips || []);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getTaxonomias();
                await getFontes();
                await getTipificacoes();
            } catch (error) {
                console.error("Erro ao buscar taxonomias:", error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (openTaxonomiaId) {
            const fonteParaEditar = fontes.find(f => f.id === openTaxonomiaId);
            if (fonteParaEditar) {
                setValue("titulo", fonteParaEditar.name);
                setValue("descricao", fonteParaEditar.description);
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

            console.log("clicouDentroDeAlguma: ", clicouDentroDeAlguma);
            console.log("VALOR DE FLAGHOOK:", flagHook.current);

            if (!clicouDentroDeAlguma && !openDialogRamo) {
                if (flagHook.current === true) return
                setTaxonomiaSelecionada(null);
                setIdSelecionado("");

            }
        };

        document.addEventListener("mouseup", handleClick);
        return () => document.removeEventListener("mouseup", handleClick);
    }, [openDialogRamo]);


    const adicionarRamo = async () => {
        const ramo: Ramo = {
            taxonomy_id: taxonomiaSelecionada?.id,
            title: tituloRamo,
            description: descricaoRamo,
        };

        const resposta = await adicionarRamoService(ramo);

        if (resposta !== 201) {
            toast.error("Erro ao adicionar ramo");
        }

        setOpenDialogRamo(false);
        limparCamposRamo();
        const ramos = await buscarRamosDaTaxonomiaService(taxonomiaSelecionada?.id);
        setRamosDaTaxonomia(ramos || []);
    }

    const excluirTaxonomia = async (taxonomiaId: string | undefined) => {
        try {
            const resposta = await excluirTaxonomiaService(taxonomiaId);

            if (resposta !== 204) {
                toast.error("Erro ao excluir taxonomia");
            }

            setIdSelecionado("");
            setTaxonomiaSelecionada(null);
            setRamosDaTaxonomia([]);

            const taxs = await getTaxonomiasService()
            setTax(taxs || []);
        } catch (error) {
            toast.error('Erro ao excluir taxonomia!');
        }
    };

    const excluirRamo = async (idRamo: string | undefined, idTaxonomia: string | undefined) => {
        try {
            await excluirRamoService(idRamo);

            const ramos = await buscarRamosDaTaxonomiaService(idTaxonomia);
            setRamosDaTaxonomia(ramos || []);

        } catch (error) {
            toast.error('Erro ao excluir ramo!');
        }
    };

    async function atualizarTaxonomiaDepoisDeAdicionarRamo(idTaxonomia: string | undefined) {
        const ramos = await buscarRamosDaTaxonomiaService(idTaxonomia);
        setRamosDaTaxonomia(ramos || []);
    }

    const adicionarTaxonomia = async () => {
        try {
            const novaTaxonomia: Taxonomia = {
                typification_id: idTipificacao,
                title: tituloTaxonomia,
                description: descricaoTaxonomia,
                source: fontesSelecionadas.map(fonte => fonte.id),
            }

            console.log(novaTaxonomia)

            const resposta = await adicionarTaxonomiaService(novaTaxonomia);

            if (resposta !== 201) {
                throw new Error("Erro ao adicionar taxonomia");
            }

            const taxs = await getTaxonomiasService();
            setTax(taxs || []);
        } catch (e) {
            toast.error('Erro ao adicionar taxonomia: ' + e);
        }
        setOpenTaxonomia(false);
        limparCampos();
    }

    const atualizarTaxonomia = async (data: FormData) => {
        try {
            const novaTaxonomia: Taxonomia = {
                id: taxonomiaSelecionada?.id,
                typification_id: taxonomiaSelecionada?.typification_id,
                title: data.titulo,
                description: data.descricao,
                source: fontesSelecionadas.map(fonte => fonte.id),
            }

            const resposta = await atualizarTaxonomiaService(novaTaxonomia);


            if (resposta !== 200) {
                throw new Error("Erro ao atualizar taxonomia");
            }

            const taxs = await getTaxonomiasService();
            setTax(taxs || []);
        } catch (error) {
            console.error('Erro ao atualizar taxonomia:', error);
        }

        limparCampos();
        setOpenTaxonomiaId(null);
    }

    const buscarRamos = async (idTaxonomia: string | undefined) => {
        const ramos = await buscarRamosDaTaxonomiaService(idTaxonomia);
        setRamosDaTaxonomia(ramos || []);
    }

    const atualizarRamoDaTaxonomia = async (data: FormDataRamo) => {
        try {
            const dado: Ramo = {
                id: ramoSelecionado?.id,
                taxonomy_id: taxonomiaSelecionada?.id,
                title: data.tituloRamo,
                description: data.descricaoRamo
            }

            const resposta = await atualizarRamoService(dado);

            if (resposta !== 200) {
                throw new Error("Erro ao atualizar ramo");
            }

            const ramos = await buscarRamosDaTaxonomiaService(taxonomiaSelecionada?.id);
            setRamosDaTaxonomia(ramos || []);
            setOpenDialogIdRamo(null);
        } catch (e) {
            toast.error('Erro ao atualizar ramo');
        }
    }

    function limparCampos() {
        setTituloTaxonomia("");
        setDescricaoTaxonomia("");
        setFontesSelecionadas([]);
        setIdTipificacao("");
        reset()
    }

    function limparCamposRamo() {
        setTituloRamo("");
        setDescricaoRamo("");
        setRamoSelecionado(null);
        flagHook.current = false;
        resetRamo()
    }

    const filtrarPraEdicao = (ids: string[]): Fonte[] => {
        return fontes.filter(fonte => ids.includes(fonte.id));
    }

    let flagHook = useRef<boolean>(false);

    return (
        <div className="flex flex-col flex-1 h-full relalive">
            <div className="flex items-center gap-2 mb-4 justify-between">
                <p className="font-semibold text-2xl">Gestão de taxonomia e ramos</p>

                <Dialog open={openTaxonomia} onOpenChange={setOpenTaxonomia}>
                    <DialogTrigger asChild >
                        <Button
                            variant={"destructive"}
                            className=" flex items-center gap-2 bg-vermelho cursor-pointer hover:shadow-md text-white py-2 px-4 rounded-sm"
                            style={{ boxShadow: "0 0 3px rgba(0, 0 ,0,.5)" }}
                        >
                            <Plus size={18} />
                            <p className="text-sm">Adicionar taxonomia</p>
                        </Button>
                    </DialogTrigger>

                    <DialogContent onCloseAutoFocus={limparCampos}>
                        <DialogHeader>
                            <DialogTitle>Adicionar taxonomia</DialogTitle>
                            <DialogDescription>
                                Preencha os campos abaixo para adicionar uma nova taxonomia.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit(adicionarTaxonomia)} className="space-y-4">
                            <div className="flex p-3 gap-2 bg-gray-300 rounded-sm items-center">
                                <label className="block text-md text-gray-700">
                                    Tipificação:
                                </label>

                                <select
                                    className="bg-white p-2 w-full rounded-md"
                                    defaultValue={"Selecione uma tipificação"}
                                    onChange={(e) => {
                                        setIdTipificacao(e.target.value)
                                        setValue("id_tipificacao", [e.target.value])
                                    }}
                                >
                                    <option disabled>Selecione uma tipificação</option>
                                    {
                                        tipificacoes && tipificacoes.map((item, index) => (
                                            <option key={index} value={item.id}>{item.name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            {errors.id_tipificacao && <p className="text-red-500 text-xs italic mt-1">Selecionar uma tipificação é obrigatório!</p>}

                            <div>
                                <label htmlFor="titleRamo" className="block text-sm font-medium text-gray-700">
                                    Título
                                </label>

                                <input
                                    {...register("titulo", { required: true })}
                                    onChange={(e) => setTituloTaxonomia(e.target.value)}
                                    type="text"
                                    id="titleTaxonomia"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                />
                                {errors.titulo && <p className="text-red-500 text-xs italic mt-1">{errors.titulo.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="descriptionRamo" className="block text-sm font-medium text-gray-700">
                                    Descrição da Taxonomia
                                </label>

                                <textarea
                                    {...register("descricao", { required: true })}
                                    onChange={(e) => setDescricaoTaxonomia(e.target.value)}
                                    id="descriptionTaxonomia"
                                    placeholder="Digite uma descrição para a taxonomia"
                                    rows={4}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                />
                                {errors.descricao && <p className="text-red-500 text-xs italic mt-1">{errors.descricao.message}</p>}
                            </div>

                            <p className="flex flex-col gap-2">
                                <label>Fontes</label>
                                <select
                                    defaultValue={"Selecione uma fonte"}
                                    className="border-2 border-gray-300 rounded-md p-2"
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                        setFontesSelecionadas([...fontesSelecionadas, fontes.find(fonte => fonte.id === e.target.value)!])
                                        const novaFonteId = e.target.value;
                                        const fonteJaSelecionada = watch("fontesSelecionadas").includes(novaFonteId);

                                        if (!fonteJaSelecionada) {
                                            const novasFontes = [...watch("fontesSelecionadas"), novaFonteId];
                                            setValue("fontesSelecionadas", novasFontes);
                                            setFontesSelecionadas([...fontesSelecionadas, fontes.find(f => f.id === novaFonteId)!]);
                                        }
                                    }}
                                >
                                    <option disabled>Selecione uma fonte</option>
                                    {fontes && fontes.map((fonte, index) => (
                                        <option
                                            key={index}
                                            value={fonte.id}
                                        >
                                            {fonte.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.fontesSelecionadas && <p className="text-red-500 text-xs italic">{errors.fontesSelecionadas.message}</p>}
                            </p>

                            {
                                fontesSelecionadas.length > 0 && (
                                    <div className="flex flex-col gap-2">
                                        <p>Fontes selecionadas: </p>
                                        <div className="grid grid-cols-3 gap-2 border-2 border-gray-300 rounded-md p-2">
                                            {fontesSelecionadas.map((fonte, index) => (
                                                <span key={index} className="flex gap-2 items-center w-fit">
                                                    <Checkbox
                                                        className="cursor-pointer"
                                                        checked
                                                        onClick={() => {
                                                            const novaLista = fontesSelecionadas.filter(f => f.id !== fonte.id);
                                                            setFontesSelecionadas(novaLista);
                                                            setValue("fontesSelecionadas", novaLista.map(f => f.id)); // atualiza também o react-hook-form
                                                        }}
                                                        id="fonte"
                                                        key={index}
                                                    />
                                                    <Label className="cursor-pointer" htmlFor={"fonte"} key={fonte.id}>{fonte.name}</Label>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )
                            }

                            <DialogFooter>
                                <DialogClose className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 hover:cursor-pointer rounded-md">
                                    Cancelar
                                </DialogClose>

                                <button
                                    className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md"
                                    type="submit"
                                >
                                    Adicionar
                                </button>
                            </DialogFooter>
                        </form>

                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex h-[69vh] gap-3 relative">
                <div className="flex h-[calc(100%-20px)] flex-col w-1/2 overflow-y-scroll">
                    {tax.map((item, index) => (
                        <Card
                            ref={(e) => { divRefs.current["divtax_" + index] = e }}
                            key={index}
                            className={`
                hover:cursor-pointer m-4 ml-0
                ${idSelecionado && idSelecionado === index.toString() ? "bg-orange-100" : "hover:bg-gray-200"}
              `}
                            onMouseDown={() => {
                                // setTaxonomiaSelecionada(item)
                                setIdSelecionado(index.toString())
                            }}
                            onClick={() => {
                                if (idSelecionado === taxonomiaSelecionada?.id) {
                                    console.log("click no mewsmo")
                                }
                                setTaxonomiaSelecionada(item)
                                setIdSelecionado(index.toString())
                                buscarRamos(item.id)
                            }}
                        // onMouseUp={() => setTaxonomiaSelecionada(item)}
                        >
                            <CardHeader>
                                <CardTitle>{item.title}</CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p>{item.description}</p>
                            </CardContent>

                            <CardFooter className="flex justify-between">
                                <div ref={(e) => { divRefs.current["divtax_" + index] = e }} className="flex items-center gap-2">
                                    <Calendar size={27} />
                                    <span className="flex justify-center flex-col text-gray-400">
                                        <span className="text-[10px] font-semibold mb-[-5px] mt-1">Criada em</span>
                                        <span>{item.created_at}</span>
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <Dialog open={openTaxonomiaId === item.id} onOpenChange={(open) => setOpenTaxonomiaId(open ? item.id : null)}>
                                        <DialogTrigger asChild>
                                            <button
                                                onClick={() => {
                                                    const fontesDaTaxonomia = filtrarPraEdicao(item.source)
                                                    setFontesSelecionadas(fontesDaTaxonomia)
                                                    setValue("fontesSelecionadas", fontesDaTaxonomia.map(f => f.id))
                                                    setTaxonomiaSelecionada(item)
                                                    setValue("id_tipificacao", [item.typification_id as string])
                                                    setValue("titulo", item.title)
                                                    setValue("descricao", item.description)
                                                }}
                                                title="Editar taxonomia"
                                                className="flex items-center justify-center h-8 w-8 bg-white rounded-sm border border-gray-300 hover:cursor-pointer"
                                            >
                                                <PencilLine className="h-4 w-4" strokeWidth={1.5} />
                                            </button>
                                        </DialogTrigger>

                                        <DialogContent
                                            ref={(e) => { divRefs.current["editartax_" + index] = e }}
                                            onCloseAutoFocus={limparCampos}
                                        >
                                            <DialogHeader>
                                                <DialogTitle>Editar taxonomia</DialogTitle>
                                                <DialogDescription>
                                                    Atualize os dados da taxonomia selecionada
                                                </DialogDescription>
                                            </DialogHeader>

                                            <form onSubmit={handleSubmit(atualizarTaxonomia)} className="space-y-4">
                                                <div className="flex p-3 gap-2 bg-gray-300 rounded-sm items-center">
                                                    <label className="block text-md text-gray-700">
                                                        Tipificação:
                                                    </label>

                                                    <select
                                                        className="bg-white p-2 w-full rounded-md"
                                                        defaultValue={taxonomiaSelecionada?.typification_id}
                                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                                            setTaxonomiaSelecionada(item);
                                                            setValue("id_tipificacao", [e.target.value]);
                                                        }}
                                                    >
                                                        <option disabled>Selecione uma tipificação</option>
                                                        {
                                                            tipificacoes && tipificacoes.map((item, i) => (
                                                                <option key={i} value={item.id}>{item.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                                {errors.id_tipificacao && <span className="text-red-500 text-sm italic">{errors.id_tipificacao.message}</span>}

                                                <div>
                                                    <label htmlFor="titleRamo" className="block text-sm font-medium text-gray-700">
                                                        Título
                                                    </label>

                                                    <input
                                                        {...register("titulo")}
                                                        defaultValue={taxonomiaSelecionada?.title}
                                                        onChange={(e) => setTituloTaxonomia(e.target.value)}
                                                        type="text"
                                                        id="titleTaxonomia"
                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                                    />
                                                    {errors.titulo && <span className="text-red-500 text-sm italic">{errors.titulo.message}</span>}
                                                </div>

                                                <div>
                                                    <label htmlFor="descriptionRamo" className="block text-sm font-medium text-gray-700">
                                                        Descrição da Taxonomia
                                                    </label>

                                                    <textarea
                                                        {...register("descricao")}
                                                        defaultValue={taxonomiaSelecionada?.description}
                                                        onChange={(e) => setDescricaoTaxonomia(e.target.value)}
                                                        id="descriptionTaxonomia"
                                                        placeholder="Digite uma descrição para a taxonomia"
                                                        rows={4}
                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                                    />
                                                    {errors.descricao && <span className="text-red-500 text-sm italic">{errors.descricao.message}</span>}
                                                </div>

                                                <p className="flex flex-col gap-2">
                                                    <label>Fontes</label>
                                                    <select
                                                        defaultValue={"Selecione uma fonte"}
                                                        className="border-2 border-gray-300 rounded-md p-2"
                                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                                            setFontesSelecionadas([...fontesSelecionadas, fontes.find(fonte => fonte.id === e.target.value)!])
                                                            const novaFonteId = e.target.value;
                                                            const fonteJaSelecionada = watch("fontesSelecionadas").includes(novaFonteId);

                                                            if (!fonteJaSelecionada) {
                                                                const novasFontes = [...watch("fontesSelecionadas"), novaFonteId];
                                                                setValue("fontesSelecionadas", novasFontes);
                                                                setFontesSelecionadas([...fontesSelecionadas, fontes.find(f => f.id === novaFonteId)!]);
                                                            }
                                                        }}
                                                    >
                                                        <option disabled>Selecione uma fonte</option>
                                                        {fontes && fontes.map((fonte, index) => (
                                                            <option
                                                                key={index}
                                                                value={fonte.id}
                                                            >
                                                                {fonte.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.fontesSelecionadas && <span className="text-red-500 text-sm italic">{errors.fontesSelecionadas.message}</span>}
                                                </p>

                                                {
                                                    fontesSelecionadas.length > 0 && (
                                                        <div className="flex flex-col gap-2">
                                                            <p>Fontes selecionadas: </p>
                                                            <div className="grid grid-cols-3 gap-2 border-2 border-gray-300 rounded-md p-2">
                                                                {fontesSelecionadas.map((fonte, index) => (
                                                                    <span key={index} className="flex gap-2 items-center w-fit">
                                                                        <Checkbox
                                                                            className="cursor-pointer"
                                                                            checked
                                                                            onClick={() => {
                                                                                const novaLista = fontesSelecionadas.filter(f => f.id !== fonte.id);
                                                                                setFontesSelecionadas(novaLista);
                                                                                setValue("fontesSelecionadas", novaLista.map(f => f.id)); // atualiza também o react-hook-form
                                                                            }}
                                                                            id="fonte"
                                                                            key={index}
                                                                        />
                                                                        <Label className="cursor-pointer" htmlFor={"fonte"} key={fonte.id}>{fonte.name}</Label>
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )
                                                }

                                                <DialogFooter>
                                                    <DialogClose className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 hover:cursor-pointer rounded-md">
                                                        Cancelar
                                                    </DialogClose>

                                                    <button
                                                        className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 hover:cursor-pointer rounded-md"
                                                        type="submit"
                                                    >
                                                        Salvar alterações
                                                    </button>
                                                </DialogFooter>
                                            </form>

                                        </DialogContent>
                                    </Dialog>

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button
                                                title="Excluir taxonomia"
                                                className="flex items-center justify-center h-8 w-8 bg-red-700 text-white rounded-sm border border-gray-300 hover:cursor-pointer"
                                            >
                                                <Trash className="h-4 w-4" strokeWidth={1.5} />
                                            </button>
                                        </DialogTrigger>

                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Excluir taxonomia
                                                </DialogTitle>

                                                <DialogDescription>
                                                    Tem certeza que deseja excluir a taxonomia <strong>{item.title}</strong>?
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="flex justify-end gap-4 mt-4">
                                                <DialogClose
                                                    className={`
                            transition ease-in-out text-black
                            rounded-md px-3
                            hover:cursor-pointer
                            hover:scale-110 active:scale-100
                          `}
                                                    style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                                                >
                                                    Cancelar
                                                </DialogClose>

                                                <Button
                                                    className={`
                            flex bg-vermelho hover:bg-vermelho
                            text-white hover:cursor-pointer
                            hover:scale-110 active:scale-100
                          `}
                                                    style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                                                    onClick={() => {
                                                        excluirTaxonomia(item.id)
                                                    }}
                                                >
                                                    Excluir
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="w-1/2 h-[69vh] relative overflow-y-auto">
                    <Card ref={(e) => { divRefs.current["card_ramos"] = e }} className="m-4 overflow-y-auto">
                        <CardHeader>
                            <CardTitle className="flex flex-row justify-between items-center">
                                <h1 className="text-2xl">Ramos</h1>
                                <Dialog open={openDialogRamo} onOpenChange={setOpenDialogRamo}>
                                    <DialogTrigger asChild>
                                        {
                                            taxonomiaSelecionada &&
                                            <div ref={(e) => { divRefs.current["botao"] = e }}>
                                                <button
                                                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 cursor-pointer hover:shadow-md text-white font-semibold py-2 px-4 rounded-sm"
                                                >
                                                    <Plus className="h-5 w-5 " strokeWidth={1.5} />
                                                    Adicionar ramo
                                                </button>
                                            </div>
                                        }

                                    </DialogTrigger>

                                    <DialogContent ref={(e) => { divRefs.current["dialog_ramo_"] = e }} onCloseAutoFocus={limparCampos}>
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
                                                    onChange={(e) => setTituloRamo(e.target.value)}
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
                                                <DialogClose className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 hover:cursor-pointer rounded-md">
                                                    Cancelar
                                                </DialogClose>

                                                <button
                                                    className="px-4 py-2 text-sm hover:cursor-pointer font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md"
                                                >
                                                    Adicionar
                                                </button>
                                            </DialogFooter>
                                        </form>


                                    </DialogContent>
                                </Dialog>
                            </CardTitle>

                        </CardHeader>

                        <CardContent>
                            {taxonomiaSelecionada ? (
                                ramosDaTaxonomia.length > 0 ? (
                                    <ul>
                                        {ramosDaTaxonomia.map((ramo, index) => (
                                            <div ref={(e) => { divRefs.current["ramo_" + index] = e }} key={ramo.id} className="flex flex-col gap-2">
                                                <li className="flex  justify-between items-center mb-2">
                                                    <span>{ramo.title}</span>

                                                    <div className="flex flex-row gap-2">
                                                        <EditarRamo flagHook={flagHook} divRefs={divRefs} atualizarRamos={atualizarTaxonomiaDepoisDeAdicionarRamo} idTaxonomia={taxonomiaSelecionada.id} ramo={ramo} />
                                                        {
                                                            /*
                                                            
                                                            <Dialog open={openDialogIdRamo === ramo.id} onOpenChange={(open) => { setOpenDialogIdRamo(open ? ramo.id : null) }}>
                                                              <DialogTrigger asChild>
                                                                <button
                                                                  onClick={() => {
                                                                    flagHook.current = true
                                                                    setRamoSelecionado(ramo)
                                                                  }}
                                                                  title="Editar ramo"
                                                                  className="flex items-center justify-center h-8 w-8 bg-white rounded-sm border border-gray-300 hover:cursor-pointer"
                                                                >
                                                                  <PencilLine className="h-4 w-4" strokeWidth={1.5} />
                                                                </button>
                                                              </DialogTrigger>
                                
                                                              <DialogContent
                                                                ref={(e) => { divRefs.current["dialog_ramo_" + ramo.id] = e }}
                                                                onCloseAutoFocus={limparCamposRamo}
                                                                onOpenAutoFocus={() => alert(JSON.stringify(ramoSelecionado))}
                                                              >
                                                                <DialogHeader>
                                                                  <DialogTitle>Editar ramo</DialogTitle>
                                                                  <DialogDescription>
                                                                    Atualize os dados do ramo selecionado
                                                                  </DialogDescription>
                                                                </DialogHeader>
                                
                                                                <form onSubmit={handleSubmitRamo(atualizarRamoDaTaxonomia)} className="space-y-4">
                                                                  <div>
                                                                    <label htmlFor="titleRamo" className="block text-sm font-medium text-gray-700">
                                                                      Título
                                                                    </label>
                                
                                                                    <input
                                                                      {...registerRamo("tituloRamo")}
                                                                      defaultValue={ramoSelecionado ?.title || "asfasdfsadf"}
                                                                      onChange={(e) => setTituloRamo(e.target.value)}
                                                                      type="text"
                                                                      id="titleTaxonomia"
                                                                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                                                    />
                                                                    {errorsRamo.tituloRamo && <span className="text-red-500 text-sm italic">{errorsRamo.tituloRamo.message}</span>}
                                                                  </div>
                                
                                                                  <div>
                                                                    <label htmlFor="descriptionRamo" className="block text-sm font-medium text-gray-700">
                                                                      Descrição do ramo
                                                                    </label>
                                
                                                                    <textarea
                                                                      {...registerRamo("descricaoRamo")}
                                                                      defaultValue={ramoSelecionado?.description}
                                                                      onChange={(e) => setDescricaoRamo(e.target.value)}
                                                                      id="descriptionTaxonomia"
                                                                      placeholder="Digite uma descrição para a taxonomia"
                                                                      rows={4}
                                                                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                                                    />
                                                                    {errorsRamo.descricaoRamo && <span className="text-red-500 text-sm italic">{errorsRamo.descricaoRamo.message}</span>}
                                                                  </div>
                                
                                                                  <DialogFooter>
                                                                    <DialogClose className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 hover:cursor-pointer rounded-md">
                                                                      Cancelar
                                                                    </DialogClose>
                                
                                                                    <button
                                                                      className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 hover:cursor-pointer rounded-md"
                                                                      type="submit"
                                                                    >
                                                                      Salvar alterações
                                                                    </button>
                                                                  </DialogFooter>
                                                                </form>
                                
                                                              </DialogContent>
                                                            </Dialog>
                                                            */
                                                        }

                                                        <Dialog open={openDialogIdRamoExcluir === ramo.id} onOpenChange={(open) => { setOpenDialogIdRamoExcluir(open ? ramo.id : null) }}>
                                                            <DialogTrigger asChild>
                                                                <button
                                                                    title="Excluir ramo"
                                                                    className="flex items-center justify-center h-8 w-8 bg-red-700 text-white rounded-sm border border-gray-300 hover:cursor-pointer"
                                                                >
                                                                    <Trash className="h-4 w-4" strokeWidth={1.5} />
                                                                </button>
                                                            </DialogTrigger>

                                                            <DialogContent ref={(e) => { divRefs.current["excluir_" + index] = e }}>

                                                                <DialogHeader>
                                                                    <DialogTitle>
                                                                        Excluir ramo
                                                                    </DialogTitle>

                                                                    <DialogDescription>
                                                                        Tem certeza que deseja excluir o ramo <strong>{ramo.title}</strong>?
                                                                    </DialogDescription>
                                                                </DialogHeader>

                                                                <div className="flex justify-end gap-4 mt-4">
                                                                    <DialogClose
                                                                        className={`
                                      transition ease-in-out text-black
                                      rounded-md px-3
                                      hover:cursor-pointer
                                      hover:scale-110 active:scale-100
                                    `}
                                                                        style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                                                                    >
                                                                        Cancelar
                                                                    </DialogClose>

                                                                    <Button
                                                                        className={`
                                      flex bg-vermelho hover:bg-vermelho
                                      text-white hover:cursor-pointer
                                      hover:scale-110 active:scale-100
                                    `}
                                                                        style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                                                                        onClick={() => {
                                                                            excluirRamo(ramo?.id, taxonomiaSelecionada?.id);
                                                                        }}
                                                                    >
                                                                        Excluir
                                                                    </Button>
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                </li>

                                                {
                                                    index !== ramosDaTaxonomia.length - 1 &&
                                                    <hr className="border-gray-300 mb-4" />
                                                }

                                            </div>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="ml-3 animate-pulse">Nenhum ramo disponível para a taxonomia selecionada.</p>
                                )
                            ) : (
                                <p className="ml-3 animate-pulse">Selecione uma taxonomia.</p>
                            )

                            }
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );

}