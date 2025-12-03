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
import { CasoFormData, CasoSchema } from "@/core/schemas/caso.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Taxonomia } from "@/core";

interface FormularioCasoProps {
  initialData?: {
    id: number;
    name: string;
    taxonomia: string;
    tipificacao: string;
    ramo: string;
    teste: string;
    conformidade: string;
    feedbackEsperado: string;
    textoEntrada: string;
    created_at?: string;
  };
  onSubmit: (data: any) => void;
  mode?: "create" | "edit";
  taxonomias?: Taxonomia[];
  carregandoTax?: boolean;
}

export default function FormularioCaso({
  initialData,
  onSubmit,
  mode = "create",
  taxonomias = [],
  carregandoTax = false,
}: FormularioCasoProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CasoFormData>({
    resolver: zodResolver(CasoSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      taxonomia: initialData?.taxonomia ?? "",
      tipificacao: initialData?.tipificacao ?? "",
      ramo: initialData?.ramo ?? "",
      teste: initialData?.teste ?? "",
      conformidade: initialData?.conformidade ?? "",
      feedbackEsperado: initialData?.feedbackEsperado ?? "",
      textoEntrada: initialData?.textoEntrada ?? "",
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
        <Label>Nome do caso</Label>
        <Input {...register("name")} />
        {errors.name && (
          <span className="text-red-500 text-sm italic">
            {errors.name.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Taxonomia associada</Label>
        <Controller
          name="taxonomia"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value ?? ""}
              onValueChange={field.onChange}
              disabled={carregandoTax}
            >
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue
                  placeholder={carregandoTax ? "Carregando..." : "Selecione"}
                />
              </SelectTrigger>
              <SelectContent>
                {taxonomias?.map((tax: Taxonomia) => (
                  <SelectItem key={tax.id} value={tax.id!}>
                    {tax.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.taxonomia && (
          <span className="text-red-500 text-sm italic">
            {errors.taxonomia.message}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label>Tipificação associada</Label>
        <Controller
          name="tipificacao"
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
        {errors.tipificacao && (
          <span className="text-red-500 text-sm italic">
            {errors.tipificacao.message}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label>Ramo associada</Label>
        <Controller
          name="ramo"
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
        {errors.ramo && (
          <span className="text-red-500 text-sm italic">
            {errors.ramo.message}
          </span>
        )}
      </div>
      <div className="flex justify-between gap-2">
        <div className="flex flex-col gap-2 w-1/2">
          <Label>Teste associado</Label>
          <Input {...register("teste")} />
          {errors.teste && (
            <span className="text-red-500 text-sm italic">
              {errors.teste.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 w-1/2">
          <Label>Conformidade com o ramo?</Label>
          <Input {...register("conformidade")} />
          {errors.conformidade && (
            <span className="text-red-500 text-sm italic">
              {errors.conformidade.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Feedback esperado</Label>
        <textarea
          className="border rounded p-2 text-sm"
          {...register("feedbackEsperado")}
          rows={2.5}
        />
        {errors.feedbackEsperado && (
          <span className="text-red-500 text-sm italic">
            {errors.feedbackEsperado.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Texto de entrada</Label>
        <textarea
          className="border rounded p-2 text-sm"
          {...register("textoEntrada")}
          rows={2.5}
        />
        {errors.textoEntrada && (
          <span className="text-red-500 text-sm italic">
            {errors.textoEntrada.message}
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
