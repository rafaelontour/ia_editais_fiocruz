import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Comentario, Edital } from "@/core/edital/Edital";
import useUsuario from "@/data/hooks/useUsuario";
import { formatarData } from "@/lib/utils";
import { excluirComentarioEditalService, fazerComentarioEditalService } from "@/service/comentarioEdital";
import { getEditalPorIdService } from "@/service/edital";
import { IconLoader2 } from "@tabler/icons-react";
import { PencilLine, Plus, Send, Trash, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
    edital: Edital | undefined;
    comentarios: Comentario[] | undefined;
    buscarComentariosEdital: () => void;
}

export default function ComentarioEdital({ edital, comentarios, buscarComentariosEdital }: Props) {
    const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false);
    const [novoComentario, setNovoComentario] = useState<string>("");
    const [carregando, setCarregando] = useState<boolean>(false);
    const [montado, setMontado] = useState<boolean>(false);
    const [dialogComentario, setDialogComentario] = useState<string | null>(null);
    const [abrirDialogAdicionar, setAbrirDialogAdicionar] = useState(false);

    const { usuario } = useUsuario();

    useEffect(() => {
        if (comentarios?.length === 0) {
            setCarregando(false);
        } else {
            setCarregando(true);
        }

        setMontado(true);
    }, [comentarios]);

    const temComentarios = comentarios && comentarios.length > 0;

    async function enviarComentario() {
        if (!novoComentario.trim()) {
            toast.warning("Digite um comentário antes de enviar.");
            return;
        }

        const resposta = await fazerComentarioEditalService(edital?.id, { content: novoComentario });

        if (resposta != 201) {
            toast.error("Erro ao fazer comentário!");
            return;
        }

        toast.success("Comentário enviado com sucesso!");
        setAbrirDialogAdicionar(false);
        setNovoComentario("");
        buscarComentariosEdital();
    }

    async function excluirComentario(id: string | undefined) {
        const resposta = await excluirComentarioEditalService(id);

        if (resposta != 204) {
            toast.error("Erro ao excluir comentário!");
            return;
        }

        toast.success("Comentário excluido com sucesso!");
        buscarComentariosEdital();
    }

    return (
        montado &&
        <div className="flex flex-col gap-10 h-full">
            <div className="bg-white sticky top-0 z-10">
                <div className="flex items-center justify-between rounded-md p-3">
                    <h2 className="text-3xl font-bold">Comentários</h2>

                    {
                        temComentarios && (
                            ((edital?.history?.[0]?.status === "PENDING" || edital?.history?.[0]?.status === "UNDER_CONSTRUCTION") && usuario?.access_level === "ANALYST") ||
                            ((edital?.history?.[0]?.status === "WAITING_FOR_REVIEW" || edital?.history?.[0]?.status === "COMPLETED") && usuario?.access_level === "AUDITOR")||
                            usuario?.access_level === "ADMIN" && (
                                <Dialog open={abrirDialogAdicionar} onOpenChange={setAbrirDialogAdicionar}>
                                    <DialogTrigger asChild>
                                        <Button
                                            type="button"
                                            className="bg-vermelho hover:cursor-pointer"
                                            variant="destructive"
                                            style={{ boxShadow: "3px 3px 4px rgba(0, 0, 0, 0.25)" }}
                                            onClick={() => setMostrarFormulario(true)}
                                        >
                                            <Plus className="mr-2" />
                                            <span>Adicionar comentário</span>
                                        </Button>
                                    </DialogTrigger>

                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Adicionar comentário</DialogTitle>
                                            <DialogDescription>
                                                <p>Digite o comentário abaixo:</p>
                                            </DialogDescription>
                                        </DialogHeader>

                                        <Textarea
                                            placeholder="Escreva um comentário"
                                            className="w-full"
                                            value={novoComentario}
                                            onChange={(e) => setNovoComentario(e.target.value)}
                                        />

                                        <DialogFooter>
                                            <DialogClose>
                                                <Button variant={"outline"} className="hover:cursor-pointer">
                                                    Cancelar
                                                </Button>
                                            </DialogClose>

                                            <Button
                                                type="button"
                                                variant="destructive"
                                                className="bg-vermelho hover:cursor-pointer"
                                                onClick={enviarComentario}
                                            >
                                                <Send size={17} className="mr-2" />
                                                Enviar comentário
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )
                        )
                    }
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-6 overflow-y-auto tela-comentario">
                {!temComentarios ? (

                    carregando ? (
                        <div className="flex flex-col items-center">
                            <p>Carregando comentarios..</p>
                            <IconLoader2 className="animate-spin" />
                        </div>
                    ) : (
                        <div className="flex flex-col justify-between items-center gap-10">
                            {mostrarFormulario ? (
                                <div className="flex flex-col gap-4 w-full px-4">
                                    <Textarea
                                        placeholder="Escreva um comentário"
                                        className="w-full"
                                        value={novoComentario}
                                        onChange={(e) => setNovoComentario(e.target.value)}
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        className="bg-vermelho hover:cursor-pointer"
                                        style={{ boxShadow: "3px 3px 4px rgba(0, 0, 0, 0.25)" }}
                                        onClick={enviarComentario}
                                    >
                                        <Send size={17} className="mr-2" />
                                        Enviar comentário
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <p className="text-lg animate-pulse text-gray-400">
                                        Nenhum comentário ainda para este edital
                                    </p>

                                    {
                                        ((edital?.history?.[0]?.status === "PENDING" || edital?.history?.[0]?.status === "UNDER_CONSTRUCTION") && usuario?.access_level === "ANALYST") ||
                                        ((edital?.history?.[0]?.status === "WAITING_FOR_REVIEW" || edital?.history?.[0]?.status === "COMPLETED") && usuario?.access_level === "AUDITOR") ||
                                        usuario?.access_level === "ADMIN" && (
                                
                                        <Button
                                            type="button"
                                            className="bg-vermelho hover:cursor-pointer"
                                            variant="destructive"
                                            style={{ boxShadow: "3px 3px 4px rgba(0, 0, 0, 0.25)" }}
                                            onClick={() => setMostrarFormulario(true)}
                                        >
                                            <Plus className="mr-2" />
                                            <span>Adicionar comentário</span>
                                        </Button>
                                        )
                                    }
                                </>
                            )}
                        </div>
                    )
                ) : (
                    <div className="flex flex-col gap-6 pr-5">
                        {comentarios.map((item) => (
                            <div key={item.id} className="flex flex-row gap-5 bg-slate-50 rounded-xl p-5 border border-gray-10">
                                <div>
                                    <div className="flex rounded-xl w-14 h-14 bg-gray-300 justify-center items-center">
                                        <User />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 relative w-full">
                                    <div>
                                        <h2 className="text-lg font-bold">{item.author?.username}</h2>
                                        <p className="text-sm font-semibold text-gray-400">
                                            {formatarData(item.created_at)}
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-400 max-h-24 overflow-y-auto">
                                        {item.content}
                                    </p>
                                    {
                                        (usuario?.access_level === "ADMIN" ||
                                            item.author?.id === usuario?.id) && (

                                            <div className="flex items-center gap-2 absolute right-0 top-0">
                                                <Button
                                                    title="Editar comentário"
                                                    variant={"outline"}
                                                    size={"icon"}
                                                    className="h-6 w-6 p-[14px] border-gray-300 rounded-sm hover:cursor-pointer"
                                                >
                                                    <PencilLine />
                                                </Button>

                                                <Dialog
                                                    open={dialogComentario === item.id}
                                                    onOpenChange={(open) => setDialogComentario(open ? item.id! : null)}
                                                >
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            title="Remover comentário"
                                                            size={"icon"}
                                                            className="
                                                                h-6 w-6 border-gray-300 bg-vermelho hover:cursor-pointer
                                                                text-white transition-all rounded-sm p-[14px]
                                                            ">
                                                            <Trash />
                                                        </Button>
                                                    </DialogTrigger>

                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Excluir comentário</DialogTitle>
                                                            <DialogDescription>
                                                                Tem certeza que deseja excluir este comentário?
                                                            </DialogDescription>
                                                        </DialogHeader>

                                                        <DialogFooter>
                                                            <DialogClose asChild>
                                                                <Button variant="outline">Cancelar</Button>
                                                            </DialogClose>

                                                            <Button
                                                                variant="destructive"
                                                                className="hover:cursor-pointer bg-vermelho"
                                                                onClick={async () => {
                                                                    await excluirComentario(item.id);
                                                                    setDialogComentario(null); // fecha só o atual
                                                                }}
                                                            >
                                                                Excluir
                                                            </Button>


                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
