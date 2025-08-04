'use client'

import Masonry from 'react-masonry-css'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Calendar, PencilLine, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/file-upload';
import { adicionarFonteService, atualizarFonteService, excluirFonteService, getFontesService } from '@/service/fonte';
import { Fonte } from '@/core/fonte';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { watch } from 'fs';

const schemaFonte = z.object({
    nome: z.string().min(1, "O nome da fonte é obrigatório"),
    descricao: z.string().min(1, "A descrição da fonte é obrigatória")
})

export default function Fontes() {

    type FormData = z.infer<typeof schemaFonte>
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<FormData>({
        resolver: zodResolver(schemaFonte)
    })
    const breakpointColumnsObj = {
        default: 3,
        1500: 3,
        1000: 2,
        700: 1
    }

    const [openDialogFontes, setOpenDialogFontes] = useState(false);
    const [fontes, setFontes] = useState<Fonte[]>([])
    const [openDialogIdExcluir, setOpenDialogIdExcluir] = useState<string | null>(null);
    const [openDialogIdEditar, setOpenDialogIdEditar] = useState<string | null>(null);
    const [nomeFonte, setNomeFonte] = useState<string>("");
    const [descricaoFonte, setDescricaoFonte] = useState<string>("");

    const fetchData = async () => {
        try {
            const fnts = await getFontesService()

            if (!fnts) {
                throw new Error("Erro ao buscar fontes")
            }
            setFontes([...fnts])
        } catch (error) {
            console.error("Erro ao buscar fontes", error)
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        if (openDialogIdEditar) {
            const fonteParaEditar = fontes.find(f => f.id === openDialogIdEditar);
            if (fonteParaEditar) {
                setValue("nome", fonteParaEditar.name);
                setValue("descricao", fonteParaEditar.description);
            }
        }
    }, [openDialogIdEditar, fontes, setValue]);

    const adicionarFonte = async () => {
        try {
            const resposta = await adicionarFonteService(nomeFonte, descricaoFonte);

            if (resposta !== 201) {
                throw new Error("Erro ao adicionar fonte")
            }

            setOpenDialogFontes(false);
            limparCampos();
            fetchData();
        } catch (error) {
            console.error("Erro ao adicionar fonte", error)
        }
    }

    const atualizarFonte = async (dados: { nome: string, descricao: string }) => {
        try {
            const resposta = await atualizarFonteService(openDialogIdEditar as string, dados.nome, dados.descricao);

            if (resposta !== 200) {
                throw new Error("Erro ao atualizar fonte")
            }

            setOpenDialogIdEditar(null);
            setOpenDialogFontes(false)
            fetchData();
        } catch (error) {
            console.error("Erro ao atualizar fonte", error)
        }

    }

    const excluirFonte = async (id: string) => {
        try {
            const resposta = await excluirFonteService(id);

            if (resposta !== 204) {
                throw new Error("Erro ao excluir fonte")
            }

            setOpenDialogIdExcluir(null)
            fetchData();
        } catch (error) {
            console.error("Erro ao excluir fonte", error)
        }
    }

    const limparCampos = () => {
        reset();
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                    Fontes
                </h2>

                <Dialog open={openDialogFontes} onOpenChange={setOpenDialogFontes}>
                    <DialogTrigger>
                        <div
                            style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                            className={`
                                flex rounded-md gap-2 items-center px-4 py-2
                                transition duration-100
                                bg-vermelho hover:bg-vermelho text-white
                                hover:cursor-pointer hover:scale-105 active:scale-100
                            `}
                        >
                            <Plus className="" />
                            <p className="text-white">Adicionar</p>
                        </div>
                    </DialogTrigger>

                    <DialogContent onCloseAutoFocus={limparCampos}>

                        <DialogHeader>
                            <DialogTitle className="text-3xl font-bold">
                                Adicionar Fonte à base de dados
                            </DialogTitle>

                            <DialogDescription className="text-md pb-2">
                                Adicione os dados da fonte
                            </DialogDescription>

                        </DialogHeader>

                        <form onSubmit={handleSubmit(adicionarFonte)} className="flex text-lg flex-col gap-4">
                            <p className="flex flex-col gap-2">
                                <label htmlFor="nomeFonte" className="">Nome da fonte</label>
                                <input
                                    {...register("nome")}
                                    type="text"
                                    id="nomeFonte"
                                    className="
                                        border-2 border-gray-300
                                        rounded-md p-2 w-full
                                    "
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setNomeFonte(e.target.value)
                                        setValue("nome", e.target.value)
                                    }}
                                />
                                {errors.nome && <span className="text-red-500 text-sm italic">{errors.nome.message}</span>}
                            </p>

                            <p className="flex flex-col gap-2">
                                <label htmlFor="descricaoFonte" className="">Descrição da fonte</label>
                                <input
                                    {...register("descricao")}
                                    type="text"
                                    id="descricaoFonte"
                                    className="
                                        border-2 border-gray-300
                                        rounded-md p-2 w-full
                                    "
                                    onChange={(e) => setDescricaoFonte(e.target.value)}
                                />
                                {errors.descricao && <span className="text-red-500 text-sm italic">{errors.descricao.message}</span>}
                            </p>

                            <p>Upload do documento (opcional)</p>

                            <FileUpload />

                            <div className="flex justify-end gap-4 mt-4">
                                <DialogClose
                                    className={`
                                        transition ease-in-out text-white
                                        rounded-md px-3 bg-vermelho
                                        hover:cursor-pointer
                                        hover:scale-110 active:scale-100
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
                                        hover:scale-110 active:scale-100
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
                breakpointCols={breakpointColumnsObj}
                columnClassName="pl-4"
                className={'flex -ml-4 w-auto'}
            >
                {fontes.map((fonte, index) => (
                    <div
                        style={{ boxShadow: "0 0 5px rgba(0,0,0,.3)" }}
                        key={index}
                        className="
                            flex flex-col gap-2 rounded-md p-4 mb-4
                            transition ease-in-out duration-100
                            min-w-[250px]
                        "
                    >
                        <div className="flex flex-col gap-2">
                            <h2 className="text-xl font-semibold">{fonte.name}</h2>
                            <p className={`py-1 w-fit break-words text-sm`}>
                                {fonte.description}
                            </p>
                        </div>

                        <div className="flex justify-between items-center mt-3">
                            <p className="flex items-center gap-2 text-sm text-gray-400">
                                <Calendar size={16} />
                                <span className="flex justify-center flex-col">
                                    <span className="text-[10px] font-semibold mb-[-5px] mt-1">Criada em</span>
                                    <span>{fonte.created_at}</span>
                                </span>
                            </p>
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

                                    <DialogContent onCloseAutoFocus={limparCampos}>

                                        <DialogHeader>
                                            <DialogTitle className="text-3xl font-bold">
                                                Atualizar fonte
                                            </DialogTitle>

                                            <DialogDescription className="text-md pb-4">
                                                Modifique os dados da fonte
                                            </DialogDescription>

                                        </DialogHeader>

                                        <form onSubmit={handleSubmit(atualizarFonte)} className="flex text-lg flex-col gap-4">
                                            <p className="flex flex-col gap-2">
                                                <label htmlFor="nomeFonte" className="">Nome da fonte</label>
                                                <input
                                                    {...register("nome")}
                                                    type="text"
                                                    id="nomeFonte"
                                                    className="
                                                        border-2 border-gray-300
                                                        rounded-md p-2 w-full
                                                    "
                                                    onChange={(e) => setNomeFonte(e.target.value)}
                                                />
                                                {errors.nome && <span className="text-red-500 text-sm italic">{errors.nome.message}</span>}
                                            </p>

                                            <p className="flex flex-col gap-2">
                                                <label htmlFor="descricaoFonte" className="">Descrição da fonte</label>
                                                <input
                                                    {...register("descricao")}
                                                    type="text"
                                                    id="descricaoFonte"
                                                    className="
                                                        border-2 border-gray-300
                                                        rounded-md p-2 w-full
                                                    "
                                                    onChange={(e) => setDescricaoFonte(e.target.value)}
                                                />
                                                {errors.descricao && <span className="text-red-500 text-sm italic">{errors.descricao.message}</span>}
                                            </p>

                                            <p>
                                                Upload do documento (opcional)</p>
                                            <FileUpload />

                                            <div className="flex justify-end gap-4 mt-4">
                                                <DialogClose
                                                    className={`
                                                        transition ease-in-out text-white
                                                        rounded-md px-3 bg-vermelho
                                                        hover:cursor-pointer
                                                        hover:scale-110 active:scale-100
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
                                                        hover:scale-110 active:scale-100
                                                    `}
                                                    style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                                                >
                                                    Salvar alterações
                                                </Button>
                                            </div>
                                        </form>


                                    </DialogContent>
                                </Dialog>

                                <Dialog open={openDialogIdExcluir === fonte.id} onOpenChange={(open) => setOpenDialogIdExcluir(open ? fonte.id : null)}>
                                    <DialogTrigger asChild>
                                        <Button
                                            title="Excluir fonte"
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
                                            <DialogTitle>
                                                Excluir fonte
                                            </DialogTitle>
                                            <DialogDescription>
                                                Tem certeza que deseja excluir a fonte <strong>{fonte.name}</strong>?
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
                                                    excluirFonte(fonte.id)
                                                }}
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
    )
}