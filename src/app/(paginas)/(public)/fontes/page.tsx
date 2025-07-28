'use client'

import Masonry from 'react-masonry-css'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Calendar, PencilLine, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/file-upload';
import { adicionarFonteService, excluirFonteService, getFontesService } from '@/service/fonte';
import { Fonte } from '@/core/fonte';

export default function Fontes() {
    const breakpointColumnsObj = {
        default: 4,
        1500: 3,
        1000: 2,
        700: 1
    }

    const [openDialogFontes, setOpenDialogFontes] = useState(false);
    const [fontes, setFontes] = useState<Fonte[]>([])
    const [openDialogIdExcluir, setOpenDialogIdExcluir] = useState<string | null>(null);
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

    const handleAddFonte = async () => {
        try {
            const resposta = await adicionarFonteService(nomeFonte, descricaoFonte);
            
            if (resposta !== 201) {
                throw new Error("Erro ao adicionar fonte")
            }

            setOpenDialogFontes(false);
            fetchData();
        } catch (error) {
            console.error("Erro ao adicionar fonte", error)
        }
    }

    const handleExcluirFonte = async (id: string) => {
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

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                    Fontes
                </h2>

                <Dialog open={openDialogFontes} onOpenChange={setOpenDialogFontes}>
                    <DialogTrigger>
                        <div
                            style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)"}}
                            className={`
                                flex rounded-md gap-2 items-center px-4 py-2
                                transition duration-100
                                bg-vermelho hover:bg-vermelho text-white
                                hover:cursor-pointer hover:scale-105 active:scale-100
                            `}
                        >
                            <Plus className=""/>
                            <p className="text-white">Adicionar</p>
                        </div> 
                    </DialogTrigger>

                    <DialogContent>

                        <DialogHeader>
                            <DialogTitle className="text-3xl font-bold">
                                Adicionar Fonte à base de dados
                            </DialogTitle>

                            <DialogDescription className="text-md pb-4">
                                Adicione os dados da fonte
                            </DialogDescription>

                        </DialogHeader>

                        <form className="flex text-lg flex-col gap-4">
                            <p className="flex flex-col gap-2">
                                <label htmlFor="nomeFonte" className="">Nome da fonte</label>
                                <input
                                    type="text"
                                    id="nomeFonte"
                                    className="
                                        border-2 border-gray-300
                                        rounded-md p-2 w-full
                                    "
                                    onChange={(e) => setNomeFonte(e.target.value)}
                                />
                            </p>

                            <p className="flex flex-col gap-2">
                                <label htmlFor="descricaoFonte" className="">Descrição da fonte</label>
                                <input
                                    type="text"
                                    id="descricaoFonte"
                                    className="
                                        border-2 border-gray-300
                                        rounded-md p-2 w-full
                                    "
                                    onChange={(e) => setDescricaoFonte(e.target.value)}    
                                />
                            </p>

                            <p>
                                Upload do documento (opcional)</p>
                            <FileUpload />

                        </form>


                        <div className="flex justify-end gap-4 mt-4">
                            <DialogClose
                                className={`
                                    transition ease-in-out text-white
                                    rounded-md px-3 bg-vermelho
                                    hover:cursor-pointer
                                    hover:scale-110 active:scale-100
                                `}
                                style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)"}}
                            >
                                Cancelar
                            </DialogClose>
                            
                            <Button
                                className={`
                                    flex bg-verde hover:bg-verde
                                    text-white hover:cursor-pointer
                                    hover:scale-110 active:scale-100
                                `}
                                style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)"}}
                                onClick={() => {
                                    setOpenDialogFontes(false)
                                    handleAddFonte()
                                }}
                            >
                                Salvar
                            </Button>
                        </div>
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
                        style={{ boxShadow: "0 0 5px rgba(0,0,0,.3)"}} 
                        key={index}
                        className="
                            flex flex-col gap-2 rounded-md p-4 mb-4
                            hover:scale-105 transition ease-in-out duration-100
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
                                <span>{fonte.created_at}</span>
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    className={`
                                        h-8 w-8 hover:cursor-pointer hover:scale-110 active:scale-100
                                        bg-branco hover:bg-branco
                                        `}
                                    style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)"}}
                                    size={"icon"}
                                    
                                >
                                    <PencilLine color="black" />
                                </Button>

                                <Dialog open={openDialogIdExcluir === fonte.id} onOpenChange={(open) => setOpenDialogIdExcluir(open ? fonte.id : null)}>
                                    <DialogTrigger asChild>
                                        <Button
                                            className={`
                                                h-8 w-8 bg-vermelho hover:bg-vermelho
                                                hover:cursor-pointer hover:scale-110 active:scale-100
                                            `}
                                            style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)"}}
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
                                                <p>Tem certeza que quer excluir a fonte <strong>{fonte.name}</strong>?</p>
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
                                                    style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)"}}
                                                >
                                                    Cancelar
                                                </DialogClose>
                                                
                                                <Button
                                                    className={`
                                                        flex bg-vermelho hover:bg-vermelho
                                                        text-white hover:cursor-pointer
                                                        hover:scale-110 active:scale-100
                                                    `}
                                                    style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)"}}
                                                    onClick={() => { 
                                                        handleExcluirFonte(fonte.id)
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