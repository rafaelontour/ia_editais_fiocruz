import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { TesteSchema, TesteFormData } from "@/core/schemas/teste.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface FormularioTesteProps {
  initialData?: TesteFormData | null;
  onSubmit: (data: TesteFormData) => void;
  mode?: "create" | "edit";
}

export default function FormularioTeste({
  initialData,
  onSubmit,
  mode = "create",
}: FormularioTesteProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TesteFormData>({
    resolver: zodResolver(TesteSchema),
    defaultValues: initialData || {
      name: "",
      descricao: "",
    },
  });

  // Preenche o form quando estiver em modo EDITAR
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
        <Label>Nome do Teste</Label>
        <Input {...register("name")} />
        {errors.name && (
          <span className="text-red-500 text-sm italic">
            {errors.name.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Descrição</Label>
        <textarea
          {...register("descricao")}
          className="border rounded p-2 text-sm"
        />
        {errors.descricao && (
          <span className="text-red-500 text-sm italic">
            {errors.descricao.message}
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
        <Button type="submit" className="bg-verde text-white">
          {mode === "create" ? "Salvar" : "Atualizar"}
        </Button>
      </DialogFooter>
    </form>
  );
}
