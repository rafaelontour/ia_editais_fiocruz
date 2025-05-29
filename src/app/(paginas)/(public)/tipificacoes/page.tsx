'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Tipificacao } from "@/core";
import { DialogTitle } from "@radix-ui/react-dialog";
import { get } from "http";
import { Calendar, ChevronRightIcon, PencilLine, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";

export default function  Tipificacoes() {

    const [tipificacoes, setTipificacoes] = useState<Tipificacao[]>([]);
    
    const [dialogTipificacao, setDialogTipificacao] = useState(false);
    const [idDialogExcluir, setIdDialogExcluir] = useState<number | null>(null);

    
    const getTipificacoes = async () => {
        const dados = await fetch('http://localhost:3000/api/tipificacoes')

        if (!dados.ok) {
            throw new Error('Erro ao buscar tipificacoes')
        }

        const tipificacoes = await dados.json()
        setTipificacoes(tipificacoes)
    } 
    useEffect(() => {
        try {
            getTipificacoes();
        } catch(erro) {
            console.error("Erro ao buscar tipificacoes", erro)
        }
    }, []);

    const excluirTipificacao = (id: number) => {

        setIdDialogExcluir(id);

        const fetchData = async () => {
            try {
                const resposta = await fetch(`http://localhost:3000/api/tipificacoes?id=${id}`, { method: 'DELETE' });
                console.log(resposta);
                if (!resposta.ok) {
                    throw new Error('Erro ao excluir tipificacao')
                }
                const r = await resposta.json();

                await getTipificacoes();
            } catch(erro) {
                console.error(erro)
            }
        }

        fetchData();
    }

    return(
        <div>
            <div className="flex flex-col gap-7">
                <div className="flex justify-between w-full items-center">
                    <div className="flex gap-6">
                        <Button variant={"outline"} size={"icon"}>
                            <ChevronRightIcon />
                        </Button>
                        <h2 className="text-2xl font-bold">Gestão de tipificações</h2>
                    </div>

                    <Dialog open={dialogTipificacao} onOpenChange={setDialogTipificacao}>
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
                                    Criar tipificação
                                </DialogTitle>
                                
                                <DialogDescription className="text-md pb-4">
                                    Adicione todos os dados da tipificação.
                                </DialogDescription>
                            </DialogHeader>

                                <form className="flex text-lg flex-col gap-4">
                                    <p className="flex flex-col gap-2">
                                        <label className="">Nome da tipificação</label>
                                        <input type="text" className="border-2 border-gray-300 rounded-md p-2 w-full" />
                                    </p>
                                    <p className="flex flex-col gap-2">
                                        <label>Fontes</label>
                                        <select className="border-2 border-gray-300 rounded-md p-2">
                                            <option>Fonte 1</option>
                                            <option>Fonte 2</option>
                                            <option>Fonte 3</option>
                                            <option>Fonte 4</option>
                                            <option>Fonte 5</option>
                                        </select>
                                    </p>
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
                                        onClick={() => setDialogTipificacao(false)}
                                    >
                                        Salvar
                                    </Button>
                                </div>
                        </DialogContent>

                    </Dialog>
                </div>
                
                <div
                    className="
                        grid [grid-template-columns:1fr] xl:[grid-template-columns:1fr_1fr_1fr_1fr]
                        lg:[grid-template-columns:1fr_1fr_1fr] md:[grid-template-columns:1fr_1fr] gap-7
                    "
                >
                    {tipificacoes && tipificacoes.map((tipificacao, index) => (
                        <div
                            style={{ boxShadow: "0 0 5px rgba(0,0,0,.3)"}} 
                            key={index}
                            className="
                                flex flex-col gap-2 rounded-md p-4
                                hover:scale-105 transition ease-in-out duration-100
                            "
                        >
                            <div className="flex flex-col gap-2">
                                <h2 className="text-xl font-semibold">{tipificacao.nome}</h2>
                                <p className={`bg-verde py-1 px-2 text-white rounded-md border-2 border-gray-300 w-fit text-sm`}>
                                Lei: {tipificacao.lei}
                                </p>
                                <p className={`bg-verde py-1 px-2 text-white rounded-md border-2 border-gray-300 w-fit text-sm`}>
                                Lei Complementar: {tipificacao.lei_complementar}
                                </p>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                                <p className="flex items-center gap-2 text-sm text-gray-400">
                                    <Calendar size={16} />
                                    <span>{tipificacao.data}</span>
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

                                    <Dialog open={idDialogExcluir === tipificacao.id} onOpenChange={(open) => setIdDialogExcluir(open ? tipificacao.id : null)}>
                                        <DialogTrigger>
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
                                                <DialogTitle>Excluir Tipificação</DialogTitle>
                                                <DialogDescription>
                                                    Tem certeza que deseja excluir essa tipificação?
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="flex justify-end gap-4 mt-4">
                                                <DialogClose
                                                    className={`
                                                        transition ease-in-out
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
                </div>
            </div>
        </div>
    )
}