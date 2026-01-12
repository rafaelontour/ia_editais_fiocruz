import { ModeloFormData, ModeloSchema } from "@/core/schemas/modelo.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";

interface FormularioModeloProps {
  initialData?: ModeloFormData | null;
  onSubmit: (data: ModeloFormData) => void;
  mode?: "create" | "edit";
}

export default function FormularioModelo({
  initialData,
  onSubmit,
  mode = "create",
}: FormularioModeloProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ModeloFormData>({
    resolver: zodResolver(ModeloSchema),
    defaultValues: initialData || {
      name: "",
      code_name: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 text-lg"
    >
      <div className="flex flex-col gap-2">
        <Label>Nome:</Label>
        <Input {...register("name")} />
        {errors.name && (
          <span className="text-red-500 text-sm italic">
            {errors.name.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label> Codinome: </Label>
        <Input {...register("code_name")} />
        {errors.code_name && (
          <span className="text-red-500 text-sm italic">
            {errors.code_name.message}
          </span>
        )}
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          type="button"
          className="flex bg-vermelho hover:bg-vermelho text-white hover:cursor-pointer"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className=" bg-verde hover:bg-verde text-white hover:cursor-pointer"
        >
          {mode === "create" ? "Salvar" : "Atualizar"}
        </Button>
      </DialogFooter>
    </form>
  );
}
