import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/ui/file-upload";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IconFile } from "@tabler/icons-react";
import RotuloOpcional from "@/components/RotuloOpcional";


interface FormularioFonteProps {
    register: any;
    errors: any;
    arquivo: File | null;
    onArquivoChange: (arquivo: File | null) => void;
    filePath?: string | null;
    fonteName?: string;
}

export default function Formulario({ register, errors, arquivo, onArquivoChange, filePath, fonteName }: FormularioFonteProps) {

    const documentoUrl = filePath
        ? (filePath.startsWith("http") ? filePath : `${process.env.NEXT_PUBLIC_URL_BASE ?? ""}${filePath}`)
        : "";

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

            {filePath && (
                <Dialog>
                    <DialogTrigger asChild>
                        <button
                            type="button"
                            title="Ver documento"
                            className="flex items-center bg-red-500 px-2 rounded-md w-fit"
                            style={{ boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.3)" }}
                        >
                            <IconFile color="white" size={16} />
                            <span className="text-xs text-white p-1 hover:underline hover:cursor-pointer">
                                Visualizar fonte
                            </span>
                        </button>
                    </DialogTrigger>

                    <DialogContent className="flex flex-col gap-0 p-10 w-[80%] h-[90%]">
                        <DialogHeader>
                            <DialogTitle className="text-xl mb-5">
                                Documento da fonte: {fonteName}
                            </DialogTitle>
                            <DialogDescription />
                        </DialogHeader>
                        <iframe
                            title={`Documento da fonte ${fonteName ?? ""}`}
                            src={documentoUrl}
                            width="100%"
                            height="100%"
                            style={{ border: "none" }}
                        />
                    </DialogContent>
                </Dialog>
            )}

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
