import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MetricaFormData, MetricaSchema } from "@/core/schemas/metrica.schema";

interface FormularioMetricaProps {
  initialData?: {
    id: string;
    name: string;
    modelo: string;
    notaCorte: number;
    criterio: string;
    passosAvaliacao: string;
  };
  onSubmit: (data: any) => void;
  mode?: "create" | "edit";
}

function toFormData(
  data: FormularioMetricaProps["initialData"]
): MetricaFormData {
  return {
    name: data?.name ?? "",
    modelo: data?.modelo ?? "",
    notaCorte: Number(data?.notaCorte ?? 0),
    criterio: data?.criterio ?? "",
    passosAvaliacao: data?.passosAvaliacao ?? "",
  };
}

export default function FormularioMetrica({
  initialData,
  onSubmit,
  mode = "create",
}: FormularioMetricaProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(MetricaSchema),
    defaultValues: toFormData(initialData),
  });

  useEffect(() => {
    if (initialData) {
      reset(toFormData(initialData) as MetricaFormData);
    }
  }, [initialData, reset]);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        console.log("Data final:", data);
        console.log("Tipo de notaCorte final:", typeof data.notaCorte);

        onSubmit(data);
      })}
      className="flex flex-col gap-4 text-lg"
    >
      <div className="flex flex-col gap-2">
        <Label>Nome da métrica</Label>
        <Input {...register("name")} />
        {errors.name && (
          <span className="text-red-500 text-sm italic">
            {errors.name.message}
          </span>
        )}
      </div>

      <div className="flex justify-between gap-2">
        <div className="flex flex-col gap-2 w-1/2">
          <Label>Modelo de ia</Label>
          <Controller
            name="modelo"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="cursor-pointer" value="teste">
                    Teste
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="teste2">
                    Teste2
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.modelo && (
            <span className="text-red-500 text-sm italic">
              {errors.modelo.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 w-1/2">
          <Label>Nota de corte</Label>
          <Input
            type="number"
            {...register("notaCorte", { valueAsNumber: true })}
          />
          {errors.notaCorte && (
            <span className="text-red-500 text-sm italic">
              {errors.notaCorte.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Critério da métrica</Label>
        <textarea
          className="border rounded p-2 text-sm"
          {...register("criterio")}
          rows={2.5}
        />
        {errors.criterio && (
          <span className="text-red-500 text-sm italic">
            {errors.criterio.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Passos de avaliação da métrica</Label>
        <textarea
          className="border rounded p-2 text-sm"
          {...register("passosAvaliacao")}
          rows={2.5}
        />
        {errors.passosAvaliacao && (
          <span className="text-red-500 text-sm italic">
            {errors.passosAvaliacao.message}
          </span>
        )}
      </div>

      <DialogFooter>
        <Button
          className="flex bg-vermelho hover:bg-vermelho text-white hover:cursor-pointer"
          type="button"
          variant="outline"
        >
          Cancelar
        </Button>
        <Button type="submit" className="bg-verde text-white cursor-pointer">
          {mode === "create" ? "Salvar" : "Atualizar"}
        </Button>
      </DialogFooter>
    </form>
  );
}
