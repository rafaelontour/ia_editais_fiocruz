interface Props {
    responsavel: string | null
    data: string | undefined
    numero: string | undefined
    descricao: string | undefined
}

export default function Linha02 ({ responsavel, data, numero, descricao }: Props) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex flex-row justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Responsável</h3>
                    {
                        responsavel ? <p className="text-sm text-gray-400">{responsavel}</p> : <p className="text-sm text-white bg-red-400 px-2 py-0.5 rounded-sm">Falha ao buscar informação</p>
                    }
                </div>

                <div>
                    <h3 className="text-lg font-semibold">Data</h3>
                    <p className="text-sm text-gray-400">{data}</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Nº</h3>
                    <p className="text-sm text-gray-400">{numero}</p>
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold">Descrição</h3>
                <p className="text-sm text-gray-400">
                    {descricao}
                </p>
            </div>
        </div>
    )
}