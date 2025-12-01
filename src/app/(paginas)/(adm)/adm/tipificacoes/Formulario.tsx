import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Fonte } from "@/core";
import { X } from "lucide-react";
import { Controller } from "react-hook-form";

interface FormularioFonteProps {
    fontes: Fonte[];
    fontesSelecionadas: Fonte[];
    setFontesSelecionadas: (fontes: Fonte[]) => void;
    setValue: any;
    control: any;
    register: any;
    errors: any;
}

export default function Formulario({
    register,
    errors,
    control,
    setValue,
    fontes,
    fontesSelecionadas,
    setFontesSelecionadas
}: FormularioFonteProps) {
    return (
        <form className="flex text-lg flex-col gap-4">
            <p className="flex flex-col gap-2">
                <Label htmlFor="nome" className="text-lg">Nome da tipificação</Label>
                <Input
                    {...register("nome")}
                    type="text"
                    className="border-2 border-gray-300 rounded-md p-2 w-full"
                    data-cy="input-nome-tipificacao"
                />
                {errors.nome && <span className="text-red-500 text-sm italic">{errors.nome.message}</span>}
            </p>

            <p className="flex flex-col gap-2">
                <Label className="text-lg">
                    Fontes
                    <span
                        style={{ boxShadow: "2px 2px 3px rgba(0, 0, 0, .5)" }}
                        className="text-xs px-2 py-1 rounded-md bg-yellow-400 italic"
                    >
                        opcional
                    </span>
                </Label>

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
                                    setFontesSelecionadas([...fontesSelecionadas, fonteEncontrada]);
                                }
                            }}
                        >
                            <SelectTrigger data-cy="trigger-fontes-tip" className="w-full">
                                <SelectValue placeholder="Selecione uma ou mais fontes" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>

                                    <SelectLabel>Fontes</SelectLabel>
                                    {fontes && fontes.filter(f => !fontesSelecionadas.some((fonte: Fonte) => fonte.id === f.id)).map((fonte, index) => (
                                        <SelectItem
                                            key={index}
                                            value={fonte.id}
                                            className="p-2 rounded-sm"
                                            data-cy="item-fonte"
                                        >
                                            {fonte.name}
                                        </SelectItem>
                                    ))}
                                    {
                                        fontes?.length === fontesSelecionadas.length && (
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
                    <span className="text-red-500 text-sm italic">{errors.fontesSelecionadas.message}</span>
                )}
            </p>

            {
                fontesSelecionadas.length > 0 && (
                    <div className="flex flex-col gap-3 w-full">
                        <Label htmlFor="tipe" className="text-lg">{fontesSelecionadas.length > 1 ? "Fontes selecionadas" : "Fonte selecionada"}</Label>
                        <div
                            className={`
                                grid ${fontesSelecionadas.length === 1 ? "grid-cols-1" : fontesSelecionadas.length === 2 ? "grid-cols-2" : "grid-cols-3" } 
                                gap-3 border-gray-200 rounded-md border-1 p-3
                            `}
                        >
                            {
                                fontesSelecionadas.map((fonte: Fonte) => (
                                    <div data-cy="fonte-selecionada" key={fonte.id} className="flex w-fit gap-3 items-center border-gray-200 rounded-sm border-1 pr-3 overflow-hidden">
                                        <div role="button" className="flex h-full" onClick={() => {
                                            const novaLista = fontesSelecionadas.filter((f: Fonte) => f.id !== fonte.id);
                                            setFontesSelecionadas(novaLista);
                                            setValue("fontesSelecionadas", novaLista.map(f => f.id));
                                        }}>
                                            <div className="flex items-center h-full" title="Remover fonte">
                                                <span
                                                    className="
                                                        bg-red-200 p-[10px] h-full flex items-center justify-center
                                                        hover:bg-red-400 hover:cursor-pointer hover:text-white
                                                        transition-all duration-200 ease-in-out
                                                    "
                                                >
                                                    <X className="w-4 h-4 mt-0.5" />
                                                </span>
                                            </div>
                                        </div>
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