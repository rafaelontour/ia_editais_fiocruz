'use client'

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Fonte, Tipificacao } from "@/core";
import { getFontesService } from "@/service/fonte";
import { getTipificacoesService, adicionarTipificacaoService, excluirTipificacaoService } from "@/service/tipificacao";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Calendar, ChevronRightIcon, PencilLine, Plus, Trash } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

export default function Tipificacoes() {

    const [tipificacoes, setTipificacoes] = useState<Tipificacao[]>([]);
    const [fontes, setFontes] = useState<Fonte[]>([]);

    const [nomeTipificacao, setNomeTipificacao] = useState<string>("");
    
    const [dialogTipificacao, setDialogTipificacao] = useState(false);
    const [idDialogExcluir, setIdDialogExcluir] = useState<string | null>("");

    const [fontesSelecionadas, setFontesSelecionadas] = useState<Fonte[]>([]);

    
    const getTipificacoes = async () => {
        const dados = await getTipificacoesService();

        if (dados == null) {
            throw new Error('Erro ao buscar tipificacoes')
        }

        setTipificacoes(dados)
    }

    const getFontess = async () => {
        const dados = await getFontesService();

        if (dados == null) {
            throw new Error('Erro ao buscar fontes')
        }
        
        setFontes(dados)
    }

    useEffect(() => {
        try {
            getFontess();
            getTipificacoes();
        } catch(erro) {
            console.error("Erro ao buscar tipificacoes ou fontes", erro)
        }
    }, []);

    const handleAdicionarTipificacao = async () => {
        const dados = await adicionarTipificacaoService(nomeTipificacao, fontesSelecionadas);
        if (dados == null) {
            throw new Error('Erro ao adicionar tipificacao')
        }
        getTipificacoes();
        limparCampos();
    }

    const excluirTipificacao = async (id: string) => {
        setIdDialogExcluir(id);

        try {
            const resposta = await excluirTipificacaoService(id);

            if (resposta !== 204) {
                throw new Error('Erro ao excluir tipificacao')
            }

            getTipificacoes();
        } catch(erro) {
            console.error(erro)
        }
    }

    function limparCampos() {
        setNomeTipificacao("");
        setFontesSelecionadas([]);
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
                        <DialogTrigger asChild>
                            <Button
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

                                <form className="flex text-lg flex-col gap-4">
                                    <p className="flex flex-col gap-2">
                                        <label className="">Nome da tipificação</label>
                                        <input 
                                            type="text"
                                            className="border-2 border-gray-300 rounded-md p-2 w-full" 
                                            onChange={(e) => setNomeTipificacao(e.target.value)}
                                        />
                                    </p>
                                    <p className="flex flex-col gap-2">
                                        <label>Fontes</label>
                                        <select 
                                            defaultValue={"Selecione uma fonte"}
                                            className="border-2 border-gray-300 rounded-md p-2"
                                            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                                setFontesSelecionadas([...fontesSelecionadas, fontes.find(fonte => fonte.id === e.target.value)!])
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
                                    </p>

                                    { 
                                        fontesSelecionadas.length > 0 && (
                                            <div className="flex flex-col gap-2">
                                                <p>Fontes selecionadas: </p>
                                                <div className="grid grid-cols-3 gap-2 border-2 border-gray-300 rounded-md p-2">
                                                    { fontesSelecionadas.map((fonte, index) => (
                                                        <span key={index} className="flex gap-2 items-center w-fit">
                                                            <Checkbox
                                                                className="cursor-pointer"
                                                                checked
                                                                onClick={() => {
                                                                    setFontesSelecionadas((fonteAnterior) => fonteAnterior.filter(fonte => fonte.id !== fonteAnterior[index].id))
                                                                    console.log("fontes selecionadas", fontesSelecionadas)
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
                                            setDialogTipificacao(false)
                                            handleAdicionarTipificacao();
                                        }}
                                    >
                                        Salvar
                                    </Button>
                                </div>
                        </DialogContent>

                    </Dialog>
                </div>
                
                <div
                    className="
                        grid [grid-template-columns:1fr] xl:[grid-template-columns:1fr_1fr_1fr]
                        lg:[grid-template-columns:1fr_1fr] md:[grid-template-columns:1fr] gap-5
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