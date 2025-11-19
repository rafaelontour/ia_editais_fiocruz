import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/ui/file-upload";
import { Fonte } from "@/core";
import RotuloOpcional from "@/components/RotuloOpcional";

interface FormularioFonteProps {
    register: any;
    errors: any;
}

export default function Formulario({ register, errors }: FormularioFonteProps) {

    return (
        <form className="flex text-lg flex-col gap-4">
            <p className="flex flex-col gap-2">
                <Label className="text-lg">Nome da fonte</Label>

                <Input
                    {...register("nome")}
                    type="text"
                    className="border-2 border-gray-300 rounded-md p-2 w-full"
                />

                {errors.nome && (
                    <span className="text-red-500 text-sm italic">
                        {errors.nome.message}
                    </span>
                )}
            </p>

            <p className="flex flex-col gap-2">
                <Label className="text-lg">Descrição da fonte</Label>

                <Input
                    {...register("descricao")}
                    type="text"
                    className="border-2 border-gray-300 rounded-md p-2 w-full"
                />

                {errors.descricao && (
                    <span className="text-red-500 text-sm italic">
                        {errors.descricao.message}
                    </span>
                )}
            </p>

            <p className="flex items-center gap-2">
                <Label className="text-lg">
                    Upload de documento
                </Label>
                <RotuloOpcional />
            </p>

            <FileUpload />
        </form>
    );
}
