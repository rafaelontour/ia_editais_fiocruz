import { Label } from "@/components/ui/label";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Fonte, Tipificacao } from "@/core";
import { X } from "lucide-react";
import { RefObject } from "react";
import { Controller } from "react-hook-form";

interface FormularioTaxProps {
    divRefs: RefObject<Record<string, HTMLDivElement | HTMLButtonElement | null>>;
    register: any;
    errors: any;
    control: any;
    setValue: any;
    idTipificacao: string;
    fontes: Fonte[];
    fontesSelecionadas: Fonte[] | undefined;
    tipificacoes: Tipificacao[]
    setFontesSelecionadas: (fontes: any[]) => void;

}

export default function Formulario({
    register,
    errors,
    control,
    setValue,
    idTipificacao,
    fontes,
    fontesSelecionadas,
    tipificacoes,
    setFontesSelecionadas,
    divRefs
}: FormularioTaxProps) {
    return (
        <form className="space-y-4">
            <div className="flex p-3 gap-2 bg-gray-300 rounded-sm items-center">
                <Label className="block text-md text-gray-700">
                    Tipificação:
                </Label>

                <Select
                    disabled
                    defaultValue={idTipificacao}
                >
                    <SelectTrigger className="max-w-[400px] bg-white">
                        <SelectValue className="w-full" placeholder="Selecione uma tipificação" />
                    </SelectTrigger>

                    <SelectContent className="bg-white">

                        {
                            tipificacoes && tipificacoes.map((item, index) => (
                                <SelectItem title={item.name} key={index} value={item.id}>{item.name}</SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
            </div>
            {errors.id_tipificacao && <p className="text-red-500 text-xs italic mt-1">Selecionar uma tipificação é obrigatório!</p>}

            <div>
                <label htmlFor="titleRamo" className="block text-sm font-medium text-gray-700">
                    Título
                </label>

                <input
                    {...register("titulo", { required: true })}
                    type="text"
                    id="titleTaxonomia"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
                {errors.titulo && <p className="text-red-500 text-xs italic mt-1">{errors.titulo.message}</p>}
            </div>

            <div
                ref={(e) => { divRefs.current["descricao_tax"] = e }}
            >
                <label htmlFor="descriptionRamo" className="block text-sm font-medium text-gray-700">
                    Descrição da Taxonomia
                </label>

                <textarea
                    {...register("descricao", { required: true })}
                    id="descriptionTaxonomia"
                    placeholder="Digite uma descrição para a taxonomia"
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
                {errors.descricao && <p className="text-red-500 text-xs italic mt-1">{errors.descricao.message}</p>}
            </div>

            <p className="flex flex-col gap-2">
                <Label className="text-lg">Fontes</Label>
                <Controller
                    name="fontesSelecionadas"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value=""
                            onValueChange={(value) => {
                                field.onChange([...field.value, value]);
                                const fonteEncontrada = fontes.find(fonte => fonte.id === value);

                                if (fonteEncontrada) {
                                    setFontesSelecionadas([...fontesSelecionadas!, fonteEncontrada]);
                                }
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione uma ou mais fontes" />
                            </SelectTrigger>

                            <SelectContent ref={(e) => { divRefs.current["select_fontes_tax"] = e }}>
                                <SelectGroup>

                                    <SelectLabel>Fontes</SelectLabel>
                                    {fontes && fontes.filter(fonte => !fontesSelecionadas!.some(f => f.id === fonte.id)).map((fonte, index) => (
                                        <SelectItem
                                            key={index}
                                            value={fonte.id}
                                            className="p-2 rounded-sm"
                                        >
                                            {fonte.name}
                                        </SelectItem>
                                    ))}
                                    {
                                        fontes?.length === fontesSelecionadas!.length && (
                                            <SelectItem
                                                value="Todos"
                                                className="hover:cursor-pointer"
                                                disabled
                                            >
                                                Nenhuma fonte para selecionar
                                            </SelectItem>
                                        )
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.fontesSelecionadas && (
                    <span className="text-red-500 mb-5 text-sm italic">{errors.fontesSelecionadas.message}</span>
                )}
            </p>
            {
                fontesSelecionadas && fontesSelecionadas.length > 0 && (
                    <div className="flex flex-col gap-3 w-full">
                        <Label htmlFor="tipe" className="text-lg">{fontesSelecionadas.length > 1 ? "Fontes selecionadas" : "Fonte selecionada"}</Label>
                        <div className="grid grid-cols-3 gap-3 border-gray-200 rounded-md border-1 p-3">
                            {
                                fontesSelecionadas.map((fonte: Fonte, index) => (
                                    <div ref={(e) => { divRefs.current["divFonteSelecionada_" + index] = e }} key={fonte.id} className="flex w-fit gap-3 items-center border-gray-200 rounded-sm border-1 pr-3 overflow-hidden">
                                        <button onClick={() => {
                                            const novaLista = fontesSelecionadas.filter((f) => f.id !== fonte.id)
                                            setFontesSelecionadas(novaLista);
                                            setValue("fontesSelecionadas", [""]);
                                        }}>
                                            <div className="flex items-center" title="Remover fonte">
                                                <span
                                                    className="
                                                        bg-red-200 p-[10px]
                                                        hover:bg-red-400 hover:cursor-pointer hover:text-white
                                                        transition-all duration-200 ease-in-out
                                                    "
                                                >
                                                    <X className="w-4 h-4" />
                                                </span>
                                            </div>
                                        </button>
                                        <p className=" w-full text-sm">{fonte.name}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )
            }
        </form>

    )
}