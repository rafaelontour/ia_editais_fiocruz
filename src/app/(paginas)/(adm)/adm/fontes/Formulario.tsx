import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/ui/file-upload";
import RotuloOpcional from "@/components/RotuloOpcional";


interface FormularioFonteProps {
    register: any;
    errors: any;
    arquivo: File | null;
    onArquivoChange: (arquivo: File | null) => void;
}

export default function Formulario({ register, errors, arquivo, onArquivoChange }: FormularioFonteProps) {

    return (
        <form className="flex text-lg flex-col gap-4">
            <p className="flex flex-col gap-2">
                <Label className="text-lg">Nome da fonte</Label>

                <Input
                    {...register("nome")}
                    type="text"
                    className="border-2 border-gray-300 rounded-md p-2 w-full"
                    data-cy="input-nome-fonte"
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
                    data-cy="input-descricao-fonte"
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

            <FileUpload
                value={arquivo}
                onChange={(files) => onArquivoChange(files[0] ?? null)}
            />

            <span className="text-sm text-gray-500 italic">
                O documento é opcional. Se a fonte já tiver um arquivo, ele será mantido enquanto nenhum novo arquivo for selecionado.
            </span>
        </form>
    );
}
