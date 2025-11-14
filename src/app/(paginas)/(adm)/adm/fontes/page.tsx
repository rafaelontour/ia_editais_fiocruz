'use client'

import Masonry from 'react-masonry-css'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Calendar, PencilLine, Plus, Search, Trash, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/file-upload';
import { adicionarFonteService, atualizarFonteService, excluirFonteService, getFontesService } from '@/service/fonte';
import { Fonte } from '@/core/fonte';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { watch } from 'fs';
import { formatarData } from '@/lib/utils';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

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
    
    const termoBusca = useRef<string>("");

    const [fontesFiltradas, setFontesFiltradas] = useState<Fonte[]>([]);


    const fetchData = async () => {
        try {
            const fnts = await getFontesService()

            if (!fnts) {
                toast.error("Erro ao buscar fontes")
                return
            }

            setFontes([...fnts])
            setFontesFiltradas([...fnts])
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
                setValue("descricao", fonteParaEditar.description ?? "");
            }
        }
    }, [openDialogIdEditar, fontes, setValue]);

    const adicionarFonte = async () => {
        try {
            const resposta = await adicionarFonteService(nomeFonte, descricaoFonte);

            if (resposta !== 201) {
                toast.error("Erro ao adicionar fonte!")
                return
            }

            toast.success("Fonte adicionada com sucesso!");

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
                toast.error("Erro ao atualizar fonte")
                return
            }

            toast.success("Fonte atualizada com sucesso!");

            setOpenDialogIdEditar(null);
            setOpenDialogFontes(false)
            fetchData();
        } catch (error) {
            toast.error("Erro ao atualizar fonte!")
        }

    }

    const excluirFonte = async (id: string) => {
        try {
            const resposta = await excluirFonteService(id);

            if (resposta !== 204) {
                toast.error("Erro ao excluir fonte!")
                return
            }

            toast.success("Fonte excluida com sucesso!");

            setOpenDialogIdExcluir(null)
            fetchData();
        } catch (error) {
            console.error("Erro ao excluir fonte", error)
        }
    }


    function filtrarFontes() {
        console.log("termoBusca.current: ", termoBusca.current);
        if (termoBusca.current.trim() === "") {
            return fontes;
        }

        const ff = fontes.filter(
            f => f.name && f.name.toLowerCase().startsWith(termoBusca.current.toLowerCase())
        )
        return ff
    }

    const limparCampos = () => {
        reset();
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <h2 className="text-4xl font-bold">
                    Fontes
                </h2>

                <Dialog open={openDialogFontes} onOpenChange={setOpenDialogFontes}>
                    <DialogTrigger asChild>
                        <Button
                        variant={"destructive"}
                            style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                            className={`
                                flex rounded-md gap-2 items-center px-4 py-2
                                bg-vermelho  text-white
                                hover:cursor-pointer
                            `}
                        >
                            <Plus size={18}/>
                            <p className="text-white text-sm">Adicionar fonte</p>
                        </Button>
                    </DialogTrigger>

                    <DialogContent onCloseAutoFocus={limparCampos}>

                        <DialogHeader>
                            <DialogTitle className="text-3xl font-bold">
                                Adicionar fonte à base de dados
                            </DialogTitle>

                            <DialogDescription className="text-md pb-2">
                                Preencha os campos abaixo para adicionar uma nova fonte
                            </DialogDescription>

                        </DialogHeader>

                        <form onSubmit={handleSubmit(adicionarFonte)} className="flex text-lg flex-col gap-4">
                            <p className="flex flex-col gap-2">
                                <Label htmlFor="nomeFonte" className="text-lg">Nome da fonte</Label>
                                <Input
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
                                <Label htmlFor="descricaoFonte" className="text-lg">Descrição da fonte</Label>
                                <Input
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

                            <Label className="text-lg">
                                Upload de documento
                                <span
                                    style={{ boxShadow: "2px 2px 3px rgba(0, 0, 0, .5)" }}
                                    className="text-xs px-2 py-1 rounded-md bg-yellow-400 italic"
                                >
                                    opcional
                                </span>
                            </Label>

                            <FileUpload />

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

            <div className="flex w-1/2 relative">
                                                        
                <Search className="absolute mt-1 translate-y-1/2 left-2" size={17} />

                { 
                    termoBusca.current !== "" && (
                        <span
                            onClick={() => {
                                setFontesFiltradas(fontes);
                                termoBusca.current = "";
                                const fFiltradas = filtrarFontes();
                                setFontesFiltradas(fFiltradas || []); 
                            }}
                            className="hover:cursor-pointer"
                            title="Limpar pesquisa"
                        >
                            <X className="absolute mt-1 translate-y-1/2 right-2" size={17} />
                        </span>
                    )
                }
                    
                <input
                    type="text"
                    value={termoBusca.current}
                    placeholder="Pesquisar"
                    className="mt-1 block w-full pl-8 pr-3 py-2  rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                    onChange={(e) => { 
                        termoBusca.current = e.target.value;
                        const fFiltradas = filtrarFontes();
                        setFontesFiltradas(fFiltradas || []);
                    }}
                />
            </div>

            <Masonry
                breakpointCols={breakpointColumnsObj}
                columnClassName="pl-4"
                className={'flex -ml-4 w-auto relative'}
            >
                {fontesFiltradas.length > 0 ? fontesFiltradas.map((fonte, index) => (
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
                            <h2 className="text-2xl font-semibold">{fonte.name}</h2>
                            <p className={`py-1 w-fit break-words text-md`}>
                                {fonte.description}
                            </p>
                        </div>

                        <div className="flex justify-between items-center mt-3">
                            <p className="flex items-center gap-2 text-sm text-gray-400">
                                <Calendar size={18} />
                                <span className="flex justify-center flex-col">
                                    <span className="text-[10px] font-semibold mb-[-5px] mt-1">Criada em</span>
                                    <span>{formatarData(fonte.created_at)}</span>
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
                                                Atualize os dados da fonte selecionada
                                            </DialogDescription>

                                        </DialogHeader>

                                        <form onSubmit={handleSubmit(atualizarFonte)} className="flex text-lg flex-col gap-4">
                                            <p className="flex flex-col gap-2">
                                                <Label htmlFor="nomeFonte" className="text-lg">Nome da fonte</Label>
                                                <Input
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
                                                <Label htmlFor="descricaoFonte" className="text-lg">Descrição da fonte</Label>
                                                <Input
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

                                            <Label className="text-lg">
                                                Fontes
                                                <span
                                                    style={{ boxShadow: "2px 2px 3px rgba(0, 0, 0, .5)" }}
                                                    className="text-xs px-2 py-1 rounded-md bg-yellow-400 italic"
                                                >
                                                    opcional
                                                </span>
                                            </Label>
                                            <FileUpload />

                                            <div className="flex justify-end gap-2 mt-4">
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
                                                    `}
                                                    style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                                                >
                                                    Salvar
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
                )) : <p className="absolute left-1/2 top-10 translate-x-[-50%] text-gray-400 text-2xl text-center animate-pulse">Nenhuma fonte cadastrada.</p>}
            </Masonry>
        </div>
    )
}