'use client'

import Masonry from 'react-masonry-css'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Loader2, PencilLine } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from '@/components/ui/button';
import { adicionarFonteService, atualizarFonteService, excluirFonteService, getFontesService } from '@/service/fonte';
import type { Fonte } from '@/core/fonte';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Calendario from '@/components/Calendario';
import BarraDePesquisa from '@/components/BarraDePesquisa';
import Botao from '@/components/BotaoAdicionar';
import BotaoExcluir from '@/components/BotaoExcluir';
import BotaoCancelar from '@/components/botoes/BotaoCancelar';
import BotaoSalvar from '@/components/botoes/BotaoSalvar';
import Formulario from './Formulario';
import Div from '@/components/Div';

const schemaFonte = z.object({
    nome: z.string().min(1, "O nome da fonte é obrigatório"),
    descricao: z.string().min(1, "A descrição da fonte é obrigatória")
})

export default function Fontes() {

    type FormDataFonte = z.infer<typeof schemaFonte>
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<FormDataFonte>({
        resolver: zodResolver(schemaFonte),
        defaultValues: {
            nome: "",
            descricao: ""
        }
    })

    const breakpointColumnsObj = {
        default: 3,
        1500: 3,
        1000: 2,
        700: 1
    }

    const [openDialogFontes, setOpenDialogFontes] = useState(false);
    const [fontes, setFontes] = useState<Fonte[]>([])
    const [openDialogIdEditar, setOpenDialogIdEditar] = useState<string | null>(null);
    const [fontesFiltradas, setFontesFiltradas] = useState<Fonte[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);

    const termoBusca = useRef<string>("");

    const fetchData = async () => {
        const fnts = await getFontesService();

        if (!fnts) {
            toast.error("Erro ao buscar fontes")
            setCarregando(false);
            return
        }

        setFontes([...fnts])
        setFontesFiltradas([...fnts]);

        setCarregando(false);
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        if (openDialogIdEditar) {
            const fonteParaEditar = fontes.find(f => f.id === openDialogIdEditar);
            if (fonteParaEditar) {
                setValue("nome", fonteParaEditar.name);
                setValue("descricao", fonteParaEditar.description ?? "");
            }
        }
    }, [openDialogIdEditar, fontes, setValue]);

    const adicionarFonte = async (formData: FormDataFonte) => {
        setCarregando(true);
        
        const resposta = await adicionarFonteService(formData.nome, formData.descricao);

        if (resposta !== 201) {
            toast.error("Erro ao adicionar fonte!")
            setCarregando(false);
            return
        }

        toast.success("Fonte adicionada com sucesso!");

        setOpenDialogFontes(false);
        reset();
        fetchData();
    }

    const atualizarFonte = async (formData: FormDataFonte) => {
        
        const resposta = await atualizarFonteService(openDialogIdEditar as string, formData.nome, formData.descricao);

        if (resposta !== 200) {
            toast.error("Erro ao atualizar fonte")
            return
        }

        setCarregando(true);
        toast.success("Fonte atualizada com sucesso!");

        setOpenDialogIdEditar(null);
        setOpenDialogFontes(false)
        reset();
        fetchData();
    }

    const excluirFonte = async (id: string) => {
        setCarregando(true);
    
        const resposta = await excluirFonteService(id);

        if (resposta !== 204) {
            toast.error("Erro ao excluir fonte!")
            setCarregando(false);
            return
        }

        toast.success("Fonte excluida com sucesso!");

        fetchData();
    }

    function filtrarFontes() {
        if (termoBusca.current.trim() === "") {
            setFontesFiltradas(fontes);
            return;
        }

        const ff = fontes.filter(
            f => f.name && f.name.toLowerCase().startsWith(termoBusca.current.toLowerCase())
        )
    
        setFontesFiltradas(ff);
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-5 sticky top-0 z-10 bg-white justify-between w-full items-center">
                <div className="flex w-full justify-between relative">
                    <div className="w-full flex justify-between items-center">
                        <h2 className="text-4xl font-bold">
                            Fontes
                        </h2>
                        
                        <Dialog open={openDialogFontes} onOpenChange={setOpenDialogFontes}>
                            <DialogTrigger asChild>
                                <Botao texto="Adicionar fonte" />
                            </DialogTrigger>
                            <DialogContent onCloseAutoFocus={() => reset()}>
                                <DialogHeader>
                                    <DialogTitle className="text-3xl font-bold">
                                        Adicionar fonte à base de dados
                                    </DialogTitle>
                                    <DialogDescription className="text-md pb-2">
                                        Preencha os campos abaixo para adicionar uma nova fonte
                                    </DialogDescription>
                                </DialogHeader>
                                <Formulario
                                    register={register}
                                    errors={errors}
                                />
                                <DialogFooter>
                                    <DialogClose>
                                        <BotaoCancelar />
                                    </DialogClose>
                                     <BotaoSalvar onClick={handleSubmit(adicionarFonte)} />
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                                        </div>
                    </div>

                <BarraDePesquisa className='w-full' refInput={termoBusca} funcFiltrar={filtrarFontes} />
            </div>

            {
                carregando ? (
                    <div className="flex justify-center items-center gap-2 text-sm text-gray-400">
                        <span>Carregando fontes...</span>
                        <Loader2 className="animate-spin ml-2" />
                    </div>
                ) : fontesFiltradas.length > 0 ? (
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        columnClassName="pl-4"
                        className={'flex -ml-4 px-1 w-auto relative'}
                    >
                        {
                            fontesFiltradas.map((fonte, index) => (
                                <Div key={index}>
                                    <div className="flex flex-col gap-2">
                                        <h2 className="text-2xl font-semibold">{fonte.name}</h2>
                                        <p className={`py-1 w-fit break-words text-md`}>
                                            {fonte.description}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center mt-3">
                                        <Calendario data={fonte.created_at} />
                                        <div className="flex gap-3">
                                            <Dialog open={openDialogIdEditar === fonte.id} onOpenChange={(open) => setOpenDialogIdEditar(open ? fonte.id : null)}>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        title="Editar fonte"
                                                        className={`
                                                            h-8 w-8 hover:cursor-pointer border border-gray-300 rounded-sm
                                                            bg-branco hover:bg-branco
                                                        `}
                                                        size={"icon"}
                                                    >
                                                        <PencilLine color="black" />
                                                    </Button>
                                                </DialogTrigger>

                                                <DialogContent onCloseAutoFocus={() => reset()}>

                                                    <DialogHeader>
                                                        <DialogTitle className="text-3xl font-bold">
                                                            Atualizar fonte
                                                        </DialogTitle>

                                                        <DialogDescription className="text-md pb-4">
                                                            Atualize os dados da fonte selecionada
                                                        </DialogDescription>

                                                    </DialogHeader>

                                                    <Formulario
                                                        register={register}
                                                        errors={errors}
                                                    />

                                                    <DialogFooter>
                                                        <DialogClose>
                                                            <BotaoCancelar />
                                                        </DialogClose>

                                                        <BotaoSalvar onClick={handleSubmit(atualizarFonte)} />
                                                    </DialogFooter>

                                                </DialogContent>
                                            </Dialog>

                                            <BotaoExcluir tipo="fonte" item={fonte} funcExcluir={excluirFonte} />

                                        </div>
                                    </div>
                                </Div>
                            ))
                        }
                    </Masonry>
                ) : (
                    <p
                        className="
                            text-gray-400
                            text-2xl text-center animate-pulse
                        "
                    >
                        Nenhuma fonte encontrada.
                    </p>
                )
            }
        </div>
    )
}