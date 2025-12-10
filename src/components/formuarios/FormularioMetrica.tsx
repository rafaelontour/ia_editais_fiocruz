import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MetricaFormData, MetricaSchema } from "@/core/schemas/metrica.schema";

interface FormularioMetricaProps {
  initialData?: {
    id: string;
    name: string;
    modelo: string;
    threshold: number;
    criteria: string;
    evaluation_steps: string;
  };
  onSubmit: (data: any) => void;
  mode?: "create" | "edit";
}

function toFormData(
  data: FormularioMetricaProps["initialData"]
): MetricaFormData {
  return {
    name: data?.name ?? "",
    threshold: Number(data?.threshold ?? 0),
    criteria: data?.criteria ?? "",
    evaluation_steps: data?.evaluation_steps ?? "",
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
        console.log("Tipo de threshold final:", typeof data.threshold);

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
        {/* <div className="flex flex-col gap-2 w-1/2">
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
        </div> */}

        <div className="flex flex-col gap-2 w-full">
          <Label>Nota de corte</Label>
          <Input
            type="number"
            step="0.1"
            {...register("threshold", { valueAsNumber: true })}
          />
          {errors.threshold && (
            <span className="text-red-500 text-sm italic">
              {errors.threshold.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Critério da métrica</Label>
        <textarea
          className="border rounded p-2 text-sm"
          {...register("criteria")}
          rows={2.5}
        />
        {errors.criteria && (
          <span className="text-red-500 text-sm italic">
            {errors.criteria.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Passos de avaliação da métrica</Label>
        <textarea
          className="border rounded p-2 text-sm"
          {...register("evaluation_steps")}
          rows={2.5}
        />
        {errors.evaluation_steps && (
          <span className="text-red-500 text-sm italic">
            {errors.evaluation_steps.message}
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
