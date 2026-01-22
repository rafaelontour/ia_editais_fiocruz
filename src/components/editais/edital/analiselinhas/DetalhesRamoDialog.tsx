import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Branch } from "@/core/tipificacao/Tipificacao"
import { formatarData } from "@/lib/utils" // Assumindo que você tem essa função no utils, conforme visto anteriormente
import { enviarMensagemDocumentoService, listarMensagensDocumentoService, DocumentMessage } from "@/service/mensagem"
import { Eye, Loader2, MessageSquare, Send, User } from "lucide-react"
import { useEffect, useState } from "react"

interface Props {
    ramo: Branch
    docId: string
}

export function DetalhesRamoDialog({ ramo, docId }: Props) {
    const [mensagem, setMensagem] = useState("")
    const [historicoMensagens, setHistoricoMensagens] = useState<DocumentMessage[]>([])

    const [enviando, setEnviando] = useState(false)
    const [carregando, setCarregando] = useState(false)
    const [aberto, setAberto] = useState(false)

    // Função para carregar mensagens filtradas por este RAMO
    const carregarMensagens = async () => {
        if (!docId || !ramo.id) return

        setCarregando(true)
        const resultado = await listarMensagensDocumentoService(docId, {
            mention_id: ramo.id,     // Filtra mensagens que mencionam este ID
            mention_type: 'BRANCH',  // Garante que é um Ramo
            limit: 50                // Limite inicial razoável
        })

        if (resultado && resultado.messages) {
            setHistoricoMensagens(resultado.messages)
        }
        setCarregando(false)
    }

    // Carrega ao abrir o modal
    useEffect(() => {
        if (aberto) {
            carregarMensagens()
        }
    }, [aberto, docId, ramo.id])

    async function handleEnviarMensagem() {
        if (!mensagem.trim()) return
        if (!docId) {
            alert("Erro: ID do documento não encontrado.")
            return
        }

        setEnviando(true)
        try {
            // Envia a mensagem com a MENÇÃO ao ramo atual
            const resultado = await enviarMensagemDocumentoService(docId, {
                content: mensagem,
                mentions: [
                    {
                        id: ramo.id,
                        type: 'BRANCH',
                        label: ramo.title || "Ramo sem título"
                    }
                ]
            })

            if (resultado) {
                setMensagem("")
                await carregarMensagens() // Recarrega a lista para mostrar a nova mensagem
            } else {
                alert("Erro ao enviar mensagem.")
            }
        } finally {
            setEnviando(false)
        }
    }

    return (
        <Dialog open={aberto} onOpenChange={setAberto}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Ver Detalhes
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg flex flex-col max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="text-xl pr-4 truncate" title={ramo.title}>
                        {ramo.title}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-2 flex-1 overflow-hidden">

                    {/* Área de Feedback da IA (Estático) */}
                    <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 text-sm shrink-0">
                        <p className="font-semibold mb-1 text-yellow-800 flex items-center gap-2">
                            <span className="text-xs bg-yellow-200 px-1 rounded">IA</span> Feedback da Avaliação:
                        </p>
                        <p className="text-gray-700 max-h-24 overflow-y-auto">
                            {ramo.evaluation?.feedback || "Sem feedback disponível."}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mt-2">
                        <MessageSquare className="w-4 h-4" />
                        Comentários sobre este item
                    </div>

                    {/* Lista de Mensagens (Scrollável) */}
                    <ScrollArea className="flex-1 bg-gray-50 rounded-md border p-4 h-[300px]">
                        {carregando ? (
                            <div className="flex justify-center items-center h-full">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            </div>
                        ) : historicoMensagens.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm italic gap-2">
                                <MessageSquare className="h-8 w-8 opacity-20" />
                                Nenhum comentário encontrado para este ramo.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {historicoMensagens.map((msg) => (
                                    <div key={msg.id} className="flex flex-col gap-1 bg-white p-3 rounded-lg border shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-gray-900">
                                                <div className="bg-gray-200 p-1 rounded-full">
                                                    <User className="w-3 h-3" />
                                                </div>
                                                {msg.author?.name || msg.author?.email || "Usuário"}
                                            </div>
                                            <span className="text-[10px] text-gray-400">
                                                {formatarData(msg.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                                            {msg.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>

                    {/* Input de Nova Mensagem */}
                    <div className="flex flex-col gap-2 shrink-0 pt-2">
                        <Textarea
                            placeholder="Escreva uma observação..."
                            value={mensagem}
                            onChange={(e) => setMensagem(e.target.value)}
                            className="resize-none min-h-[80px]"
                        />
                        <div className="flex justify-end">
                            <Button
                                onClick={handleEnviarMensagem}
                                disabled={enviando || !mensagem.trim()}
                                size="sm"
                                className="gap-2"
                            >
                                {enviando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                {enviando ? "Enviando..." : "Enviar"}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}