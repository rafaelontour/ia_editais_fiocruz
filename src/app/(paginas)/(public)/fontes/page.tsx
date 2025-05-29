'use client'

import Masonry from 'react-masonry-css'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Calendar, PencilLine, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/file-upload';
import { getFontes } from '@/service/fonte';
import { Fontes } from '@/core/fonte';

export default function Fontess() {
    const breakpointColumnsObj = {
        default: 4,
        1500: 3,
        1000: 2,
        700: 1
    }

    const [openDialogFontes, setOpenDialogFontes] = useState(false);
    const [fontes, setFontes] = useState<Fontes[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setFontes(await getFontes())
            } catch (error) {
                console.error("Erro ao buscar fontes", error)
            }
        }
    
        fetchData();
    }, [])

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
                                <input type="text" id="nomeFonte" className="border-2 border-gray-300 rounded-md p-2 w-full" />
                            </p>

                            <p className="flex flex-col gap-2">
                                <label htmlFor="descricaoFonte" className="">Descrição da fonte</label>
                                <input type="text" id="descricaoFonte" className="border-2 border-gray-300 rounded-md p-2 w-full" />
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
                                onClick={() => setOpenDialogFontes(false)}
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
                            <h2 className="text-xl font-semibold">{fonte.nome}</h2>
                            <p className={`bg-verde py-1 px-2 text-white rounded-md border-2 border-gray-300 w-fit text-sm`}>
                            {fonte.nome}
                            </p>
                            <p className={`bg-verde py-1 px-2 text-white rounded-md border-2 border-gray-300 break-words text-sm`}>
                            {fonte.descricao}
                            </p>
                        </div>
                        
                        <div className="flex justify-between items-center mt-3">
                            <p className="flex items-center gap-2 text-sm text-gray-400">
                                <Calendar size={16} />
                                <span>{fonte.data}</span>
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
                            </div>
                        </div>
                    </div>
                ))}
            </Masonry>
        </div>
    )
}