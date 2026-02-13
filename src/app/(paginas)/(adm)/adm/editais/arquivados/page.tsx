"use client"

import BarraDePesquisa from "@/components/BarraDePesquisa";
import BotaoVoltar from "@/components/botoes/BotaoVoltar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edital } from "@/core";
import { EditalArquivo } from "@/core/edital/Edital";
import useUsuario from "@/data/hooks/useUsuario";
import { formatarData } from "@/lib/utils";
import { arquivarEditalService, excluirEditalService, getEditaisArquivadosService, getEditalPorIdService } from "@/service/edital";
import { getEditalArquivoService } from "@/service/editalArquivo";
import { IconArchive } from "@tabler/icons-react";
import { Check, Copy, Loader2, Trash, View } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function EditaisArquivados() {

    const urlBase = process.env.NEXT_PUBLIC_URL_BASE
    const [urlCaminhoArquivoEdital, setUrlArquivoEdital] = useState<string>("");

    const { usuario } = useUsuario();
    const [editaisArquivados, setEditaisArquivados] = useState<Edital[]>([]);
    const [editalParaVisualizar, setEditalParaVisualizar] = useState<EditalArquivo | null>(null);
    const [editaisArquivadosFiltrados, setEditaisArquivadosFiltrados] = useState<Edital[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);

    async function getEditaisArquivados() {
        const res = await getEditaisArquivadosService(usuario?.unit_id)

        if (!res) {
            toast.error("Erro ao buscar os editais arquivados!");
            return
        }

        setEditaisArquivados(res.documents);
        setEditaisArquivadosFiltrados(res.documents);
        setCarregando(false);
    }


    useEffect(() => {
        getEditaisArquivados();
    }, [])

    async function getEdital(id: string) {
        const res = await getEditalArquivoService(id);

        if (!res) {
            toast.error("Erro ao buscar o edital!");
            return
        }

        setUrlArquivoEdital(res.releases[0].file_path);
        setEditalParaVisualizar(res);
    }

    async function desarquivarEdital(id: string) {
        const res = await arquivarEditalService(id);

        if (res !== 200) {
            toast.error("Erro ao desarquivar edital!");
            return
        }

        toast.success("Edital desarquivado com sucesso!");
        getEditaisArquivados();
    }

    async function excluirEdital(id: string) {
        const res = await excluirEditalService(id);

        if (res !== 204) {
            toast.error("Erro ao excluir edital!");
            return
        }

        toast.success("Edital excluido com sucesso!");
        getEditaisArquivados();
    }

    function filtrarEditais() {
        setCarregando(true);
        const editaisFiltrados = editaisArquivados.filter(edital => edital.name && edital.name.toLowerCase().includes(termoBusca.current.toLowerCase()));
        setEditaisArquivadosFiltrados(editaisFiltrados);
        setCarregando(false);
    }

    const termoBusca = useRef<string>("");

    function traduzirStatusEdital(status: string | undefined) {
        switch (status) {
            case "PENDING":
                return <p className="flex items-center gap-2 bg-[#99A1AF] px-2 py-1 rounded-sm w-fit">Rascunho <Copy /></p>;
            case "IN_REVIEW":
                return <p className="flex items-center gap-2 bg-[#FF0000] px-2 py-1 rounded-sm w-fit">Em construção</p>
            case "UNDER_CONSTRUCTION":
                return <p className="flex items-center gap-2 bg-[#656149] px-2 py-1 rounded-sm w-fit">Em construção</p>;
            case "COMPLETED":
                return <p className="flex items-center gap-2 bg-[#006400] px-2 py-1 rounded-sm w-fit"><Check />Concluído</p>;
            default:
                return <p></p>; 
        }
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-6">
                <BotaoVoltar />
                <h2 className="text-4xl font-bold">Editais  arquivados</h2>
            </div>

            <BarraDePesquisa className="w-full" refInput={termoBusca} funcFiltrar={filtrarEditais} />

            {
                !carregando ? (
                    editaisArquivadosFiltrados.length > 0 ? (
                        <div className="w-full flex flex-col gap-10 overflow-hidden">

                            <div className="max-h-[600px] overflow-y-auto border rounded-md">
                                <table className="w-full border-separate border-spacing-0">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="sticky bg-gray-100 top-0 z-10 px-4 py-3 text-left font-semibold border-b">
                                                Título
                                            </th>

                                            <th className="sticky bg-gray-100 top-0 z-10 px-4 py-3 text-left font-semibold border-b">
                                                Identificador
                                            </th>

                                            <th className="sticky bg-gray-100 top-0 z-10 px-4 py-3 text-left font-semibold border-b">
                                                Arquivado em
                                            </th>

                                            <th className="sticky bg-gray-100 top-0 z-10 px-4 py-3 text-left font-semibold border-b">
                                                Status
                                            </th>

                                            <th className="sticky bg-gray-100 top-0 z-10 px-4 py-3 text-center font-semibold border-b">
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {editaisArquivadosFiltrados.map((edital) => (
                                            <tr
                                                key={edital.id}
                                                className="hover:bg-gray-50 border-b last:border-b-0"
                                            >
                                                <td className="px-4 py-3">
                                                    {edital.name}
                                                </td>

                                                <td className="px-4 py-3">
                                                    {edital.identifier}
                                                </td>
                                                
                                                <td className="px-4 py-3">
                                                    {formatarData(edital.updated_at)}
                                                </td>


                                                <td className=" text-white">
                                                    <p className="">
                                                        {traduzirStatusEdital(edital.history && edital.history[0].status)}
                                                    </p>
                                                </td>


                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    onClick={() => getEdital(edital.id)}
                                                                    size="icon"
                                                                    variant="outline"
                                                                    className="h-8 w-8 hover:cursor-pointer"
                                                                    title="Visualizar edital"
                                                                >
                                                                    <View />
                                                                </Button>
                                                            </DialogTrigger>

                                                            <DialogContent className="p-10 w-[80%] h-[90%]">
                                                                <DialogTitle className="hidden"></DialogTitle>
                                                                <DialogDescription className="hidden"></DialogDescription>
                                                                <iframe
                                                                    src={urlBase + urlCaminhoArquivoEdital}
                                                                    width="100%"
                                                                    height="100%"
                                                                    style={{ border: "none" }}
                                                                ></iframe>
                                                            </DialogContent>
                                                        </Dialog>

                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    size="icon"
                                                                    variant="outline"
                                                                    className="h-8 w-8 hover:cursor-pointer"
                                                                    title="Desarquivar edital"
                                                                >
                                                                    <IconArchive />
                                                                </Button>
                                                            </DialogTrigger>

                                                            <DialogContent className="rounded-2xl">
                                                                <DialogHeader>
                                                                    <DialogTitle className="text-2xl">Desarquivar edital</DialogTitle>
                                                                </DialogHeader>

                                                                <DialogDescription className="text-md">
                                                                    Tem certeza que deseja desarquivar o edital <span className="font-bold">{edital.name}</span>?
                                                                </DialogDescription>

                                                                <DialogFooter>
                                                                    <DialogClose
                                                                        className="
                                                                            border bg-slate-300 px-3 py-1 rounded-sm hover:cursor-pointer
                                                                        "
                                                                    >
                                                                        Cancelar
                                                                    </DialogClose>

                                                                    <DialogClose asChild>
                                                                        <Button
                                                                            onClick={() => desarquivarEdital(edital.id)}
                                                                            size={"icon"}
                                                                            variant={"destructive"}
                                                                            className="w-fit border-gray-300 hover:cursor-pointer bg-vermelho hover:bg-vermelho transition-all rounded-sm p-3.5"
                                                                        >
                                                                            Desarquivar
                                                                        </Button>
                                                                    </DialogClose>
                                                                
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>

                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    size="icon"
                                                                    className="h-8 w-8 bg-vermelho hover:bg-vermelho hover:cursor-pointer"
                                                                    title="Excluir edital"
                                                                >
                                                                    <Trash color="white" />
                                                                </Button>
                                                            </DialogTrigger>

                                                            <DialogContent className="rounded-2xl">
                                                                <DialogHeader>
                                                                    <DialogTitle className="text-2xl">Excluir edital</DialogTitle>
                                                                </DialogHeader>

                                                                <DialogDescription className="text-md">
                                                                    Tem certeza que deseja excluir o edital <span className="font-bold">{edital.name}</span>?
                                                                </DialogDescription>

                                                                <DialogFooter>
                                                                    <DialogClose
                                                                        className="
                                                                            border bg-slate-300 px-3 py-1 rounded-sm hover:cursor-pointer
                                                                        "
                                                                    >
                                                                        Cancelar
                                                                    </DialogClose>

                                                                    <DialogClose asChild>
                                                                        <Button
                                                                            onClick={() => excluirEdital(edital.id)}
                                                                            size={"icon"}
                                                                            variant={"destructive"}
                                                                            className="w-fit border-gray-300 hover:cursor-pointer bg-vermelho hover:bg-vermelho transition-all rounded-sm p-3.5"
                                                                        >
                                                                            Excluir
                                                                        </Button>
                                                                    </DialogClose>
                                                                
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    ) : (
                        <div className="text-gray-400 text-2xl text-center animate-pulse">Nenhum edital encontrado</div>
                    )
                ) : (
                    <div className="flex justify-center items-center gap-2 text-sm text-gray-400">
                        <span>Carregando editais arquivados...</span>
                        <Loader2 className="animate-spin ml-2" />
                    </div>
                )
            }
        </div>
    )
}