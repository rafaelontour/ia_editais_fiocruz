export default function AnaliseTasxonomia () {
    return(
        <div>
            <div className="flex flex-row gap-7 px-3 w-full">
                <div className="flex flex-col gap-2 w-1/3">
                    <h3 className="text-lg font-semibold">Item</h3>
                    <p className=" text-gray-400">
                        Em que parte do texto oedital especifica claramente “os documentos e requisitos necessários
                        para a habilitação dos licitantes” com base no “artigos 62 a 70 da Lei nº 14.133/2021”
                    </p>
                </div>
                <div className="flex flex-col gap-2 w-1/3">
                    <h3 className="text-lg font-semibold">Detalhamento</h3>
                    <p className=" text-gray-400">
                        1. Foi Definido “Declarações e Exigências” indicado que “licitante deve apresentar uma
                        declaração de que atende aos requisitos de habilitação” 2.Foi definido a “Licença de
                        Funcionamento Estadual ou Municipal, emitida pelo Serviço de Vigilância Sanitária”
                        3. Foi definido a “Comprovação de Regularidade”
                    </p>
                </div>
                <div className="flex flex-col gap-2 w-1/3">
                    <h3 className="text-lg font-semibold">Resultado</h3>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xs w-3 h-3" style={{ backgroundColor: "green" }}></div>
                            <p className="text-gray-400">1,2 (0k)</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="rounded-xs w-3 h-3" style={{ backgroundColor: "yellow" }}></div>
                            <p className="text-gray-400">3 (Parcial) : XXXXXX</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}