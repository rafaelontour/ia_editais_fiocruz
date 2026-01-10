import { RefObject } from "react";

interface FormularioRamoProps {
    divRefs: RefObject<Record<string, HTMLFormElement | HTMLSpanElement | HTMLDivElement | HTMLButtonElement | null>>;
    registerRamo: any;
    errorsRamo: any;
}

export default function FormularioRamo({
    registerRamo,
    errorsRamo,
    divRefs
}: FormularioRamoProps) {
    return (
        <form ref={(e) => { divRefs.current["formulario_ramo"] = e }} className="space-y-4">
            <div>
                <label htmlFor="titleRamo" className="block text-sm font-medium text-gray-700">
                    Nome do Ramo
                </label>

                <input
                    {...registerRamo("tituloRamo")}
                    type="text"
                    id="titleRamo"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
                {errorsRamo.tituloRamo && (
                    <p className="text-red-500 text-sm mt-1 italic">
                        {errorsRamo.tituloRamo.message}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="descriptionRamo" className="block text-sm font-medium text-gray-700">
                    Descrição do Ramo
                </label>

                <textarea
                    {...registerRamo("descricaoRamo")}
                    id="descriptionRamo"
                    placeholder="Digite uma descrição para o ramo"
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
                {errorsRamo.descricaoRamo && (
                    <p className="text-red-500 text-sm mt-1 italic">
                        {errorsRamo.descricaoRamo.message}
                    </p>
                )}
            </div>
        </form>
    );
}