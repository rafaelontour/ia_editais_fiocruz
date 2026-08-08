import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adicionarUnidadeService } from "@/service/unidade";

const unidadeSchema = z.object({
    nome: z.string().min(4, "O nome da unidade é obrigatório"),
    localizacao: z.string().optional(),
})

interface AdicionarUnidadeProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    atualizarUnidades: () => Promise<void>
}

export default function AdicionarUnidade({ open, onOpenChange, atualizarUnidades }: AdicionarUnidadeProps) {
    type UnidadeFormData = z.infer<typeof unidadeSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<UnidadeFormData>({
        resolver: zodResolver(unidadeSchema),
    })

    const [erroGeral, setErroGeral] = useState<string>("");

    async function adicionarUnidade(data: UnidadeFormData) {
        const resposta = await adicionarUnidadeService(data.nome, data.localizacao ?? "");

        if (resposta !== 201) {
            setErroGeral("Já existe uma unidade cadastrada com esse nome!");
            return
        }

        onOpenChange(false);
        atualizarUnidades()
        limparCampos();
    }
    function limparCampos() {
        if (erroGeral) setErroGeral("");
        reset();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="" onCloseAutoFocus={limparCampos}>
                <DialogHeader className="mb-3">
                    <div className="flex flex-row gap-2 items-center">
                        <DialogTitle>Adicionar unidade</DialogTitle>
                    </div>
                    <DialogDescription>Adicione uma unidade</DialogDescription>
                </DialogHeader>

                <form className="flex flex-col gap-5" onSubmit={handleSubmit(adicionarUnidade)}>
                    <div className="flex flex-col gap-3">
                        <div className="flex w-full flex-col gap-1">
                            <Label>Nome</Label>
                            <Input
                                {...register("nome")}
                                placeholder="Insira o nome"
                            />
                            {errors.nome && <span className="text-xs text-red-500 italic">{errors.nome.message}</span>}
                        </div>
                        <div className="flex w-full flex-col gap-1">
                            <Label htmlFor="localizacao">Localização</Label>
                            <Input
                                {...register("localizacao")}
                                id="localizacao"
                                placeholder="Insira a localização (opcional)"
                            />
                            {errors.localizacao && <span className="text-xs text-red-500 italic">{errors.localizacao.message}</span>}
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" className="cursor-pointer">Cancelar</Button>
                            </DialogClose>

                            <Button
                                type="submit"
                                className="bg-verde hover:bg-green-900 cursor-pointer"
                            >
                                Adicionar
                            </Button>
                        </DialogFooter>
                    </div>
                    {erroGeral && <span className="text-xs text-red-500 italic">{erroGeral}</span>}
                </form>

            </DialogContent>
        </Dialog>
    );
}
