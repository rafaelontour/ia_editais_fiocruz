import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ramo } from "@/core";
import { useState } from "react";
import { PencilLine } from "lucide-react";
import { atualizarRamoService } from "@/service/ramo";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";

const schemaRamo = z.object({
  tituloRamo: z.string().min(1, "O título do ramo é obrigatório!"),
  descricaoRamo: z.string().min(6, "A descrição do ramo é obrigatória!"),
})

interface RamoProps {
    ramo: Ramo
    idTaxonomia: string | undefined
    atualizarRamos: (id: string | undefined) => void
    divRefs: React.RefObject<Record<string, HTMLDivElement | HTMLButtonElement | null>>
    flagHook: React.RefObject<boolean>
}

export default function EditarRamo({ ramo, idTaxonomia, atualizarRamos, divRefs, flagHook }: RamoProps) {

    
    type FormDataRamo = z.infer<typeof schemaRamo>;
    const { register: registerRamo, handleSubmit: handleSubmitRamo, formState: { errors: errorsRamo }, reset: resetRamo } = useForm<FormDataRamo>({
        resolver: zodResolver(schemaRamo)
    })

    const [openDialogIdRamo, setOpenDialogIdRamo] = useState<string | null | undefined>(null);

    const atualizarRamoDaTaxonomia = async (data: FormDataRamo) => {
        try {
          const dado: Ramo = {
            id: ramo.id,
            taxonomy_id: idTaxonomia,
            title: data.tituloRamo,
            description: data.descricaoRamo
          }
    
          const resposta = await atualizarRamoService(dado);
    
          if (resposta !== 200) {
            toast.error("Erro ao atualizar ramo");
          }
    
          atualizarRamos(idTaxonomia);
          setOpenDialogIdRamo(null);
        } catch(e) {
          toast.error('Erro ao atualizar ramo');
        }
      }

    return (
        <Dialog open={openDialogIdRamo === ramo.id} onOpenChange={(open) => { setOpenDialogIdRamo(open ? ramo.id : null) }}>
            <DialogTrigger asChild>
                <button
                    onClick={() => {
                        flagHook.current = true
                    }}
                    title="Editar ramo"
                    className="flex items-center justify-center h-8 w-8 bg-white rounded-sm border border-gray-300 hover:cursor-pointer"
                >
                    <PencilLine className="h-4 w-4" strokeWidth={1.5} />
                </button>
            </DialogTrigger>

            <DialogContent
                ref={(e) => { divRefs.current["dialog_ramo_" + ramo.id] = e }}
                onCloseAutoFocus={() => { flagHook.current = false }}
            >
                <DialogHeader>
                    <DialogTitle>Editar ramo</DialogTitle>
                    <DialogDescription>
                        Atualize os dados do ramo selecionado
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmitRamo(atualizarRamoDaTaxonomia)} className="space-y-4">
                    <div>
                        <label htmlFor="titleRamo" className="block text-sm font-medium text-gray-700">
                            Título
                        </label>

                        <input
                            {...registerRamo("tituloRamo")}
                            defaultValue={ramo.title || "asfasdfsadf"}
                            type="text"
                            id="titleTaxonomia"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                        {errorsRamo.tituloRamo && <span className="text-red-500 text-sm italic">{errorsRamo.tituloRamo.message}</span>}
                    </div>

                    <div>
                        <label htmlFor="descriptionRamo" className="block text-sm font-medium text-gray-700">
                            Descrição do ramo
                        </label>

                        <textarea
                            {...registerRamo("descricaoRamo")}
                            defaultValue={ramo.description}
                            id="descriptionTaxonomia"
                            placeholder="Digite uma descrição para a taxonomia"
                            rows={4}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                        {errorsRamo.descricaoRamo && <span className="text-red-500 text-sm italic">{errorsRamo.descricaoRamo.message}</span>}
                    </div>

                    <DialogFooter>
                        <DialogClose
                            className={`
                                    transition ease-in-out text-white
                                    rounded-md px-3 bg-vermelho
                                    hover:cursor-pointer text-sm
                                `}
                            style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                        >
                            Cancelar
                        </DialogClose>

                        <Button
                            type="submit"
                            className={`
                                    flex bg-verde hover:bg-verde
                                    text-white hover:cursor-pointer
                                    active:scale-100
                                `}
                            style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                        >
                            Salvar
                        </Button>
                    </DialogFooter>
                </form>

            </DialogContent>
        </Dialog>
    )
}