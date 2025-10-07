import { Edital } from "@/core"
import { formatarData } from "@/lib/utils"
import { EditalArquivo } from "@/core/edital/Edital"

interface Props {
    edital: Edital | undefined
    editalArquivo: EditalArquivo | undefined
}

export default function Linha02 ({ edital, editalArquivo }: Props) {

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-4">
                <div className="flex flex-col justify-between flex-1 border-2 border-black border-dotted py-3 px-4 rounded-md">
                    <h3 className="text-xl font-semibold">{(edital?.editors ?? []).length > 1 ? "Responsáveis" : "Responsável"}</h3>
                    {
                        edital?.editors ?
                        <ul className="ml-5" style={{ listStyleType: "disc" }}>
                            {
                                edital.editors.map(editor => (
                                    <li key={editor.id} className="text-lg text-black">{editor.username}</li>
                                ))
                            }
                        </ul>
                        :
                        <p className="text-sm text-white bg-red-400 px-2 pb-0.5 pt-1.5 rounded-sm">Falha ao buscar informação</p>
                    }
                </div>

                <div className="flex flex-col flex-1 justify-between border-2 border-black border-dotted py-3 px-4 rounded-md">
                    <h3 className="text-2xl font-semibold">Data</h3>
                    <p className="text-lg text-black">{formatarData(edital?.created_at)}</p>
                </div>

                <div  className="flex flex-col flex-1 border-2 justify-between border-black border-dotted py-3 px-4 rounded-md">
                    <h3 className="text-xl font-semibold">Nº</h3>
                    <p className="text-lg text-black">{edital?.identifier}</p>
                </div>
            </div>

            
        </div>
    )
}