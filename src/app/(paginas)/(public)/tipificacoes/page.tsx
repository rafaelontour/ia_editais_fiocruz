'use client'

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Fonte, Tipificacao } from "@/core";
import { getFontesService } from "@/service/fonte";
import { getTipificacoesService, adicionarTipificacaoService, excluirTipificacaoService, atualizarTipificacaoService } from "@/service/tipificacao";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Calendar, ChevronRightIcon, PencilLine, Plus, Trash } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import Masonry from "react-masonry-css";

const schemaTipificacao = z.object({
    nome: z.string().min(1, "O nome da tipificação é obrigatório"),
    fontesSelecionadas: z
    .array(z.string().min(1))
    .min(1, "Selecione pelo menos uma fonte")
})

export default function Tipificacoes() {
    type FormData = z.infer<typeof schemaTipificacao>;
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormData>({
        resolver: zodResolver(schemaTipificacao),
        defaultValues: {
            fontesSelecionadas: []
        }
    });
    
    const [tipificacoes, setTipificacoes] = useState<Tipificacao[]>([]);
    const [fontes, setFontes] = useState<Fonte[]>([]);
    
    const [nomeTipificacao, setNomeTipificacao] = useState<string>("");
    
    const [dialogTipificacao, setDialogTipificacao] = useState(false);
    const [idDialogExcluir, setIdDialogExcluir] = useState<string | null>("");
    const [idDialogEditar, setIdDialogEditar] = useState<string | null>("");
    
    const [fontesSelecionadas, setFontesSelecionadas] = useState<Fonte[]>([]);
    
    const breakpointColumns = {
        default: 3,
        1100: 3,
        700: 2,
        500: 1
    };

    useEffect(() => {
        try {
            getFontes();
            getTipificacoes();
        } catch (erro) {
            console.error("Erro ao buscar tipificacoes ou fontes", erro)
        }
    }, []);
    
    const getTipificacoes = async () => {
        const dados = await getTipificacoesService();
        
        if (dados == null) {
            throw new Error('Erro ao buscar tipificacoes')
        }

        setTipificacoes(dados)
    }

    const getFontes = async () => {
        const dados = await getFontesService();

        if (dados == null) {
            throw new Error('Erro ao buscar fontes')
        }

        setFontes(dados)
    }


    const adicionarTipificacao = async (data: FormData) => {
        const dados = await adicionarTipificacaoService(data.nome, fontesSelecionadas);
        if (dados == null) {
            throw new Error('Erro ao adicionar tipificacao')
        }
        getTipificacoes();
        limparCampos();
        setDialogTipificacao(false);
    }


    const atualizarTipificacao = async (data: FormData) => {
        const tip: Tipificacao = {
            id: idDialogEditar as string,
            name: data.nome,
            source: data.fontesSelecionadas
        }

        console.log(tip);
        
        const resposta = await atualizarTipificacaoService(tip);

        if (resposta !== 200) {
            throw new Error('Erro ao atualizar tipificacao')
        }

        getTipificacoes();
        limparCampos();
        setDialogTipificacao(false)
        
    }

    const excluirTipificacao = async (id: string) => {
        setIdDialogExcluir(id);

        try {
            const resposta = await excluirTipificacaoService(id);

            if (resposta !== 204) {
                throw new Error('Erro ao excluir tipificacao')
            }

            getTipificacoes();
        } catch (erro) {
            console.error(erro)
        }
    }

    const filtrarPraEdicao = (ids: string[]): Fonte[] => {
        return fontes.filter(fonte => ids.includes(fonte.id));
    }

    function limparCampos() {
        reset();
        setNomeTipificacao("");
        setValue("fontesSelecionadas", []);
        setFontesSelecionadas([]);
    }

    return (
        <div>
            <div className="flex flex-col gap-7">
                <div className="flex justify-between w-full items-center bg-white pb-5">
                    <p className="text-2xl font-bold">Gestão de tipificações</p>

                    <Dialog open={dialogTipificacao} onOpenChange={setDialogTipificacao}>
                        <DialogTrigger asChild>
                            <Button
                                style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                                className={`
                                    flex rounded-md gap-2 items-center px-4 py-2
                                    transition duration-100
                                    bg-vermelho hover:bg-vermelho text-white
                                    hover:cursor-pointer
                                `}
                            >
                                <Plus className="" />
                                <p className="text-white">Adicionar</p>
                            </Button>
                        </DialogTrigger>

                        <DialogContent onCloseAutoFocus={limparCampos}>
                            <DialogHeader>
                                <DialogTitle className="text-3xl font-bold">
                                    Criar tipificação
                                </DialogTitle>

                                <DialogDescription className="text-md pb-4">
                                    Adicione todos os dados da tipificação.
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleSubmit(adicionarTipificacao)} className="flex text-lg flex-col gap-4">
                                <p className="flex flex-col gap-2">
                                    <label className="">Nome da tipificação</label>
                                    <input
                                        {...register("nome")}
                                        type="text"
                                        className="border-2 border-gray-300 rounded-md p-2 w-full"
                                        // onChange={(e) => setNomeTipificacao(e.target.value)}
                                    />
                                    {errors.nome && <span className="text-red-500 text-sm italic">{errors.nome.message}</span>}
                                </p>

                                <p className="flex flex-col gap-2">
                                    <label>Fontes</label>
                                    <select
                                        defaultValue=""
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
                                        <option value="" disabled>Selecione uma ou mais fontes</option>
                                        {fontes && fontes.map((fonte, index) => (
                                            <option
                                                key={index}
                                                value={fonte.id}
                                                className="p-2 rounded-sm"
                                            >
                                                {fonte.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.fontesSelecionadas && (
                                        <span className="text-red-500 text-sm italic">{errors.fontesSelecionadas.message}</span>
                                    )}
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

                                <div className="flex justify-end gap-4 mt-4">
                                    <DialogClose
                                        className={`
                                                transition ease-in-out text-white
                                                rounded-md px-3 bg-vermelho
                                                hover:cursor-pointer
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

                </div>
                    <Masonry
                        breakpointCols={breakpointColumns}
                        className="flex gap-5 mb-10"
                    >
                    {tipificacoes && tipificacoes.map((tipificacao, index) => (
                            <div
                                style={{ boxShadow: "0 0 5px rgba(0,0,0,.3)" }}
                                key={index}
                                className="
                                    flex flex-col gap-2 rounded-md p-4 w-full
                                    transition ease-in-out duration-100 mb-5
                                "
                            >
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-xl font-semibold">{tipificacao.name}</h2>
                                    <p className={`bg-verde py-1 px-2 text-white rounded-md border-2 border-gray-300 w-fit text-sm`}>
                                        Lei: {tipificacao.name}
                                    </p>
                                    <p className={`bg-verde py-1 px-2 text-white rounded-md border-2 border-gray-300 w-fit text-sm`}>
                                        Lei Complementar: {tipificacao.name}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center mt-3">
                                    <p className="flex items-center gap-2 text-sm text-gray-400">
                                        <Calendar size={27} />
                                        <span className="flex justify-center flex-col">
                                            <span className="text-[10px] font-semibold mb-[-5px] mt-1">Criada em</span>
                                            <span>{tipificacao.created_at}</span>
                                        </span>
                                    </p>
                                    <div className="flex gap-3">
                                        <Dialog open={idDialogEditar === tipificacao.id} onOpenChange={(open) => setIdDialogEditar(open ? tipificacao.id : null)}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    onClick={() => {
                                                        const fontesDaTaxonomia = filtrarPraEdicao(tipificacao.source)
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
                                                        Atualize os dados da tipificação.
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <form onSubmit={handleSubmit(atualizarTipificacao)} className="flex text-lg flex-col gap-4">
                                                    <p className="flex flex-col gap-2">
                                                        <label className="">Nome da tipificação</label>
                                                        <input
                                                            defaultValue={tipificacao.name}
                                                            {...register("nome")}
                                                            type="text"
                                                            className="border-2 border-gray-300 rounded-md p-2 w-full"
                                                            // onChange={(e) => setNomeTipificacao(e.target.value)}
                                                        />
                                                        {errors.nome && <span className="text-red-500 text-sm italic">{errors.nome.message}</span>}
                                                    </p>

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
                                                        {errors.fontesSelecionadas && (
                                                            <span className="text-red-500 text-sm italic">{errors.fontesSelecionadas.message}</span>
                                                        )}
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
                                                    <div className="flex justify-end gap-4 mt-4">
                                                        <DialogClose
                                                            className={`
                                                                transition ease-in-out text-white
                                                                rounded-md px-3 bg-vermelho
                                                                hover:cursor-pointer
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
                                                            Salvar alterações
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
                    ))}
                    </Masonry>
                
            </div>
        </div>
    )
}