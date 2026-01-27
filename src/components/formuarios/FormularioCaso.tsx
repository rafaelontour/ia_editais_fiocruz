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
import { Edital, Tipificacao } from "@/core";
import { Teste } from "@/core/teste";

interface FormularioCasoProps {
  initialData?: {
    id: number;
    name: string;
    taxonomia: string;
    tipificacao: string;
    branch_id: string;
    test_collection_id: string;
    // doc_id: string;
    expected_fulfilled: boolean;
    expected_feedback: string;
    // input: string;
    created_at?: string;
  };
  onSubmit: (data: any) => void;
  mode?: "create" | "edit";
  tipificacoes?: Tipificacao[];
  testes?: Teste[];
  editais?: Edital[];
  defaultCollectionId?: string;
  carregandoEdital?: boolean;
  carregandoTeste?: boolean;
  carregandoTip?: boolean;
}

export default function FormularioCaso({
  initialData,
  onSubmit,
  mode = "create",
  tipificacoes = [],
  testes = [],
  defaultCollectionId,
  editais = [],
  carregandoEdital = false,
  carregandoTeste = false,
  carregandoTip = false,
}: FormularioCasoProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<CasoFormData>({
    resolver: zodResolver(CasoSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      taxonomy_id: initialData?.taxonomia ?? "",
      typification_id: initialData?.tipificacao ?? "",
      branch_id: initialData?.branch_id ?? "",
      test_collection_id:
        initialData?.test_collection_id ?? defaultCollectionId ?? "",
      // doc_id: initialData?.doc_id ?? "",
      expected_fulfilled: initialData
        ? initialData.expected_fulfilled
          ? "true"
          : "false"
        : "",
      expected_feedback: initialData?.expected_feedback ?? "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        expected_fulfilled: initialData.expected_fulfilled ? "true" : "false",
      } as any);
    }
  }, [initialData, reset]);

  const tipificacaoSelecionada = watch("typification_id");

  const taxonomiasFiltradas =
    tipificacoes.find((t) => t.id === tipificacaoSelecionada)?.taxonomies ?? [];

  const taxonomiaSelecionada = watch("taxonomy_id");

  const ramosFiltrados =
    taxonomiasFiltradas.find((tax) => tax.id === taxonomiaSelecionada)
      ?.branches ?? [];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 text-lg max-h-[450px] overflow-y-auto pr-4"
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

      {/* <div className="flex flex-col gap-2">
        <Label>Edital associado</Label>
        <Controller
          name="doc_id"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {editais?.map((doc: Edital) => (
                  <SelectItem key={doc.id} value={doc.id!}>
                    {doc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.doc_id && (
          <span className="text-red-500 text-sm italic">
            {errors.doc_id.message}
          </span>
        )}
      </div> */}

      <div className="flex flex-col gap-2">
        <Label>Tipificação associada</Label>
        <Controller
          name="typification_id"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {tipificacoes?.map((tip: Tipificacao) => (
                  <SelectItem key={tip.id} value={tip.id!}>
                    {tip.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.typification_id && (
          <span className="text-red-500 text-sm italic">
            {errors.typification_id.message}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label>Taxonomia associada</Label>
        <Controller
          name="taxonomy_id"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value ?? ""}
              onValueChange={field.onChange}
              disabled={!tipificacaoSelecionada}
            >
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue
                  placeholder={
                    !tipificacaoSelecionada
                      ? "Selecione uma tipificação primeiro"
                      : "Selecione"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {taxonomiasFiltradas.map((tax) => (
                  <SelectItem key={tax.id} value={tax.id!}>
                    {tax.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.taxonomy_id && (
          <span className="text-red-500 text-sm italic">
            {errors.taxonomy_id.message}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label>Ramo associada</Label>
        <Controller
          name="branch_id"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={!taxonomiaSelecionada}
            >
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue
                  placeholder={
                    !taxonomiaSelecionada
                      ? "Selecione uma taxonomia primeiro"
                      : "Selecione"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {ramosFiltrados?.map((ram) => (
                  <SelectItem key={ram.id} value={ram.id!}>
                    {ram.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.branch_id && (
          <span className="text-red-500 text-sm italic">
            {errors.branch_id.message}
          </span>
        )}
      </div>
      <div className="flex justify-between gap-2">
        {!defaultCollectionId && (
          <div className="flex flex-col gap-2 w-1/2">
            <Label>Teste associado</Label>
            <Controller
              name="test_collection_id"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full cursor-pointer">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {testes?.map((test: Teste) => (
                      <SelectItem key={test.id} value={test.id!}>
                        {test.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.test_collection_id && (
              <span className="text-red-500 text-sm italic">
                {errors.test_collection_id.message}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 w-1/2">
          <Label>Conformidade com o ramo?</Label>
          <div className="flex items-center gap-4 ">
            <label className="flex items-center gap-1 cursor-pointer text-sm">
              <Input
                type="radio"
                value="true"
                {...register("expected_fulfilled")}
                className="cursor-pointer"
              />
              Sim
            </label>
            <label className="flex items-center gap-1 cursor-pointer text-sm">
              <Input
                type="radio"
                value="false"
                className="cursor-pointer"
                {...register("expected_fulfilled")}
              />
              Não
            </label>
            {errors.expected_fulfilled && (
              <span className="text-red-500 text-sm italic">
                {errors.expected_fulfilled.message}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Feedback esperado</Label>
        <textarea
          className="border rounded p-2 text-sm"
          {...register("expected_feedback")}
          rows={2.5}
        />
        {errors.expected_feedback && (
          <span className="text-red-500 text-sm italic">
            {errors.expected_feedback.message}
          </span>
        )}
      </div>

      {/* <div className="flex flex-col gap-2">
        <Label>Texto de entrada</Label>
        <textarea
          className="border rounded p-2 text-sm"
          {...register("input")}
          rows={2.5}
        />
        {errors.input && (
          <span className="text-red-500 text-sm italic">
            {errors.input.message}
          </span>
        )}
      </div> */}

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
