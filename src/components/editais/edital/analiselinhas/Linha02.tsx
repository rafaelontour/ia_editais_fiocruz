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
                    <p className="text-sm text-gray-400">{responsavel}</p>
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