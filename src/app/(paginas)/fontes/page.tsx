'use client'

import Masonry from 'react-masonry-css'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Fontes() {

    const [open, setOpen] = useState(false);

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                    Fontes
                </h2>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger>
                        <div
                            style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)"}}
                            className={`
                                flex rounded-md gap-2 items-center px-4 py-2
                                transition duration-100
                                bg-verde hover:bg-verde text-white
                                hover:cursor-pointer hover:scale-110 active:scale-100
                            `}
                        >
                            <Plus className=""/>
                            <p className="text-white">Adicionar</p>
                        </div> 
                    </DialogTrigger>

                    <DialogContent>

                        <DialogHeader>
                            <DialogTitle>
                                Adicionar Fonte
                            </DialogTitle>

                            <DialogDescription>
                                Descrição
                            </DialogDescription>

                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>

            <Masonry
                breakpointCols={3} 
                className="bg-blue-400" 
                columnClassName="my-masonry-grid_column"
            >
                <div className="bg-red-100 w-[300px] h-auto">
                    teste
                </div><div className="bg-red-100 w-[300px] h-auto">
                    teste
                </div>
                <div className="bg-red-100 w-[300px] h-auto">
                    teste
                </div>
                <div className="bg-red-100 w-[300px] h-auto">
                    teste
                </div>
                <div className="bg-red-100 w-[300px] h-auto">
                    teste
                </div>
                <div className="bg-red-100 w-[300px] h-auto">
                    teste
                </div>
                <div className="bg-red-100 w-[300px] h-auto">
                    teste
                </div>
                <div className="bg-red-100 w-[300px] h-auto">
                    teste
                </div>
                <div className="bg-red-100 w-[300px] h-auto">
                    teste
                </div>
                <div className="bg-red-100 w-[300px] h-auto">
                    teste
                </div>
                <div className="bg-red-100 w-[300px] h-auto">
                    teste
                </div>
                <div className="bg-red-100 w-[300px] h-auto">
                    teste
                </div>
                <div className="bg-red-100 w-[300px] h-auto">
                    teste
                </div>
                <div className="bg-red-100 w-[300px] h-auto">
                    teste
                </div><div className="bg-red-100 w-[300px] h-auto">
                    teste
                </div>
                <div className="bg-red-100 w-[300px] h-auto">
                    teste
                </div>
                <div className="bg-red-100 w-[300px] h-auto">
                    teste
                </div>
                <div className="bg-red-100 w-[300px] h-auto">
                    teste
                </div>
                <div className="bg-red-100 w-[300px] h-auto">
                    teste
                </div>
                <div className="bg-red-100 w-[300px] h-auto">
                    teste
                </div>
                <div className="bg-red-100 w-[300px] h-auto">
                    teste
                </div>
                <div className="bg-red-100 w-[300px] h-auto">
                    teste
                </div>
            </Masonry>
        </div>
    )
}