import { Edital } from "@/core"
import { formatarData } from "@/lib/utils"
import ConversaIa from "../ConversaIa"

interface Props {
    edital: Edital | undefined
}

export default function Linha02 ({ edital }: Props) {

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-4">
                <div className="flex flex-col justify-between flex-1 border-2 border-gray-400 border-dotted py-3 px-4 rounded-md">
                    <h3 className="text-lg font-semibold">{(edital?.editors ?? []).length > 1 ? "Responsáveis" : "Responsável"}</h3>
                    {
                        edital?.editors ?
                        <ul className="ml-5" style={{ listStyleType: "disc" }}>
                            {
                                edital.editors.map(editor => (
                                    <li key={editor.id} className="text-sm text-gray-400">{editor.username}</li>
                                ))
                            }
                        </ul>
                        :
                        <p className="text-sm text-white bg-red-400 px-2 pb-0.5 pt-1.5 rounded-sm">Falha ao buscar informação</p>
                    }
                </div>

                <div className="flex flex-col flex-1 justify-between border-2 border-gray-400 border-dotted py-3 px-4 rounded-md">
                    <h3 className="text-lg font-semibold">Data</h3>
                    <p className="text-sm text-gray-400">{formatarData(edital?.created_at)}</p>
                </div>

                <div  className="flex flex-col flex-1 border-2 justify-between border-gray-400 border-dotted py-3 px-4 rounded-md">
                    <h3 className="text-lg font-semibold">Nº</h3>
                    <p className="text-sm text-gray-400">{edital?.identifier}</p>
                </div>
            </div>

            <ConversaIa />

            {/*
                <div className="flex flex-col gap-4 justify-between border-2 border-gray-400 border-dotted py-3 px-4 rounded-md">
                    <h3 className="text-lg font-semibold">Descrição</h3>
                    <p className="text-sm text-gray-400">
                        {edital?.description}
                    </p>
                </div>
            */}
        </div>
    )
}