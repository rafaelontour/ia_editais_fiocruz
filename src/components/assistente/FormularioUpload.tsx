"use client";

import { Bot, Upload, User, X } from "lucide-react";
import { Button } from "../ui/button";
import { FileUpload } from "../ui/file-upload";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Tipificacao } from "@/core";
import { getTipificacoesService } from "@/service/tipificacao";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDocumentGroupsService, getDocumentGroupItemsService } from "@/service/configurador";
import type { DocumentGroup, DocumentGroupItem } from "@/core/configurador/GrupoDocumento";
import { getUsuariosPorUnidade } from "@/service/usuario";
import useUsuario from "@/data/hooks/useUsuario";

const schemaDocumento = z.object({
  nome: z.string().min(3, "O nome do documento é obrigatório"),
  identificador: z.string().min(1, "O número do documento é obrigatório"),
  tipificacoes: z.array(z.string()).min(1, "Selecione pelo menos uma tipificação"),
  grupoDocumentoId: z.string().min(1, "Selecione o grupo de documento"),
  tipoDocumentoId: z.string().min(1, "Selecione o tipo de documento"),
  responsavel: z.string().min(1, "Selecione o responsável"),
  descricao: z.string().min(3, "A descrição é obrigatória"),
});

type formData = z.infer<typeof schemaDocumento> & {
  descricao?: string;
  arquivo?: File | null;
};

interface Props {
  onDocumentoCriado: (doc: {
    conversationId: string;
    documentId: string;
    fileDataUrl: string;
    fileName: string;
  }) => void;
  onCancelar?: () => void;
}

export default function FormularioUpload({ onDocumentoCriado, onCancelar }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
    watch,
    trigger,
    getValues,
  } = useForm<formData>({
    resolver: zodResolver(schemaDocumento),
    defaultValues: {
      tipificacoes: [],
      grupoDocumentoId: "",
      tipoDocumentoId: "",
    },
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [tipificacoes, setTipificacoes] = useState<Tipificacao[]>([]);
  const [tipificacoesSelecionadas, setTipificacoesSelecionadas] = useState<Tipificacao[]>([]);
  const [filteredTipificacoes, setFilteredTipificacoes] = useState<Tipificacao[]>([]);
  const [gruposDocumento, setGruposDocumento] = useState<DocumentGroup[]>([]);
  const [itensDocumento, setItensDocumento] = useState<DocumentGroupItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const { usuario: currentUser } = useUsuario();

  const grupoSelecionado = watch("grupoDocumentoId");
  const nomeValue = watch("nome");
  const identificadorValue = watch("identificador");
  const tipoDocumentoIdValue = watch("tipoDocumentoId");
  const tipificacoesValue = watch("tipificacoes");
  const descricaoValue = watch("descricao");
  const arquivoValue = watch("arquivo");

  const stepDefinitions = [
    {
      title: "Vamos começar!",
      description: "Preencha as informações básicas do documento.",
    },
    {
      title: "Metade do caminho!",
      description: "Selecione as tipificações do documento.",
    },
    {
      title: "Quase lá!",
      description: "Revise as informações e faça o upload do arquivo.",
    },
  ];

  const responsavelValue = watch("responsavel");

  const completedFields = [
    !!nomeValue,
    !!identificadorValue,
    !!grupoSelecionado,
    !!tipoDocumentoIdValue,
    !!responsavelValue,
    !!tipificacoesValue?.length,
    !!descricaoValue,
    !!arquivoValue,
  ].filter(Boolean).length;

  const progressPercentage = Math.min(100, Math.round((completedFields / 8) * 100));

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === stepDefinitions.length;

  const handleNextStep = async () => {
    const fieldsToValidate: Array<keyof formData> =
      currentStep === 1
        ? ["nome", "identificador", "grupoDocumentoId", "tipoDocumentoId"]
        : currentStep === 2
          ? ["tipificacoes", "responsavel"]
          : [];

    const valid = fieldsToValidate.length
      ? await trigger(fieldsToValidate)
      : true;

    if (!valid) return;

    if (currentStep < stepDefinitions.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  async function carregarDados() {
    const [tips, grupos] = await Promise.all([
      getTipificacoesService(),
      getDocumentGroupsService(),
    ]);
    if (tips) setTipificacoes(tips);
    if (grupos) setGruposDocumento(grupos);
  }

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (currentUser?.unit_id) {
      getUsuariosPorUnidade(currentUser.unit_id).then((u) =>
        setUsuarios(u ?? []),
      );
    }
  }, [currentUser?.unit_id]);

  useEffect(() => {
    if (grupoSelecionado) {
      getDocumentGroupItemsService(grupoSelecionado).then((itens) => {
        setItensDocumento(itens);
        setValue("tipoDocumentoId", "");
      });
    } else {
      setItensDocumento([]);
    }
  }, [grupoSelecionado, setValue]);

  useEffect(() => {
    const filteredByGroup = tipificacoes.filter((t) => {
      if (t.document_group_id && t.document_group_id !== grupoSelecionado) return false;
      return true;
    });

    if (!tipoDocumentoIdValue) {
      setFilteredTipificacoes(filteredByGroup);
      return;
    }

    const selectedItem = itensDocumento.find((i) => i.id === tipoDocumentoIdValue);
    const filtered = selectedItem
      ? filteredByGroup.filter((t) => t.document_group_item_id === selectedItem.id)
      : filteredByGroup;

    setFilteredTipificacoes(filtered);
  }, [tipificacoes, grupoSelecionado, tipoDocumentoIdValue, itensDocumento]);

  async function enviar(data: formData) {
    const descricao = getValues("descricao");
    const arquivo = getValues("arquivo");
    if (!arquivo) {
      toast.error("O arquivo é obrigatório");
      return;
    }

    setLoading(true);

    try {
      const group = gruposDocumento.find((g) => g.id === data.grupoDocumentoId);
      const item = itensDocumento.find((i) => i.id === data.tipoDocumentoId);

      const { criarDocumentoChat } = await import("@/service/assistente/assistente");

      const doc = await criarDocumentoChat({
        name: data.nome,
        identifier: data.identificador,
        description: descricao,
        grupo: group?.name ?? "",
        tipo_documento: item?.name ?? "",
        projeto_nome: "",
        typification_ids: data.tipificacoes,
        editors_ids: data.responsavel ? [data.responsavel] : [],
        arquivo,
      });

      toast.success("Documento enviado com sucesso!");
      reset();
      setTipificacoesSelecionadas([]);
      setCurrentStep(1);

      onDocumentoCriado({
        conversationId: doc.conversationId,
        documentId: doc.documentId,
        fileDataUrl: doc.fileUrl,
        fileName: doc.fileName,
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro ao criar documento!";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border p-8 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-verde/10 rounded-lg">
            <Bot className="w-6 h-6 text-verde" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-800">OiacIA</h1>
            <p className="text-sm text-zinc-500">
              Envie um documento para começar a conversar
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-600">
            Etapa {currentStep} de {stepDefinitions.length}
          </p>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-verde transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="space-y-1">
            <p className="text-xl font-bold text-gray-900">
              {stepDefinitions[currentStep - 1].title}
            </p>
            <p className="text-sm font-semibold text-gray-600 mb-7">
              {stepDefinitions[currentStep - 1].description}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(enviar)} className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="nome" className="text-sm font-medium">
                  Nome do documento
                </Label>
                <Input {...register("nome")} id="nome" placeholder="Ex: Contrato nº 123" />
                {errors.nome && (
                  <span className="text-xs text-red-500 italic">{errors.nome.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="identificador" className="text-sm font-medium">
                  Número do documento
                </Label>
                <Input
                  {...register("identificador")}
                  id="identificador"
                  placeholder="Ex: 2024/0001"
                />
                {errors.identificador && (
                  <span className="text-xs text-red-500 italic">{errors.identificador.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Grupo de documento</Label>
                <Controller
                  name="grupoDocumentoId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o grupo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Grupos</SelectLabel>
                          {gruposDocumento.map((g) => (
                            <SelectItem key={g.id} value={g.id}>
                              {g.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.grupoDocumentoId && (
                  <span className="text-xs text-red-500 italic">
                    {errors.grupoDocumentoId.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Tipo de documento</Label>
                <Controller
                  name="tipoDocumentoId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!grupoSelecionado || itensDocumento.length === 0}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            !grupoSelecionado
                              ? "Selecione um grupo primeiro"
                              : itensDocumento.length === 0
                                ? "Nenhum tipo disponível"
                                : "Selecione o tipo"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Tipos</SelectLabel>
                          {itensDocumento.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.tipoDocumentoId && (
                  <span className="text-xs text-red-500 italic">
                    {errors.tipoDocumentoId.message}
                  </span>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Responsável</Label>
                <Controller
                  name="responsavel"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o responsável" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Responsáveis</SelectLabel>
                          {usuarios.length > 0
                            ? usuarios.map((u: any) => (
                                <SelectItem key={u.id} value={u.id}>
                                  {u.username}
                                </SelectItem>
                              ))
                            : currentUser && (
                                <SelectItem value={currentUser.id ?? ""}>
                                  {currentUser.username}
                                </SelectItem>
                              )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.responsavel && (
                  <span className="text-xs text-red-500 italic">
                    {errors.responsavel.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Tipificações</Label>
              <Controller
                name="tipificacoes"
                control={control}
                render={({ field }) => (
                  <Select
                    value=""
                    onValueChange={(value) => {
                      field.onChange([...(field.value ?? []), value]);
                      const encontrada = tipificacoes.find((t) => t.id === value);
                      if (encontrada) {
                        setTipificacoesSelecionadas((prev) => [...prev, encontrada]);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione tipificações" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tipificações</SelectLabel>
                        {filteredTipificacoes
                          .filter((t) => !tipificacoesSelecionadas.some((s) => s.id === t.id))
                          .map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.name}
                            </SelectItem>
                          ))}
                        {filteredTipificacoes.length === 0 ? (
                          <SelectItem value="nenhuma" disabled>
                            Nenhuma tipificação disponível para este grupo/tipo
                          </SelectItem>
                        ) : tipificacoesSelecionadas.length === filteredTipificacoes.length ? (
                          <SelectItem value="todos" disabled>
                            Todas já foram selecionadas
                          </SelectItem>
                        ) : null}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tipificacoes && (
                <span className="text-xs text-red-500 italic">{errors.tipificacoes.message}</span>
              )}

              {tipificacoesSelecionadas.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tipificacoesSelecionadas.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-1 bg-zinc-100 border rounded-md pr-2 overflow-hidden text-sm"
                    >
                      <span
                        role="button"
                        className="bg-red-200 p-1.5 flex items-center hover:bg-red-400 hover:text-white transition-colors cursor-pointer"
                        onClick={() => {
                          const novaLista = tipificacoesSelecionadas.filter((s) => s.id !== t.id);
                          setTipificacoesSelecionadas(novaLista);
                          setValue(
                            "tipificacoes",
                            novaLista.map((s) => s.id),
                          );
                        }}
                      >
                        <X className="w-3 h-3" />
                      </span>
                      <span className="text-xs">{t.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="descricao" className="text-sm font-medium">
                  Descrição
                </Label>
                <Textarea
                  {...register("descricao")}
                  id="descricao"
                  placeholder="Descreva o documento..."
                  className="resize-y min-h-[100px]"
                />
                {errors.descricao && (
                  <span className="text-xs text-red-500 italic">
                    {errors.descricao.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Upload do documento (PDF)</Label>
                <Controller
                  name="arquivo"
                  control={control}
                  render={({ field }) => (
                    <FileUpload
                      onChange={(files: File[]) => {
                        field.onChange(files[0]);
                      }}
                    />
                  )}
                />
              </div>
            </div>
          )}

            <div className="flex items-center justify-between w-full pt-4">
              <div className="flex gap-2">
                {isFirstStep && onCancelar ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancelar}
                    className="cursor-pointer"
                  >
                    Cancelar
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={isFirstStep}
                    className="cursor-pointer"
                  >
                    Voltar
                  </Button>
                )}
              </div>

              {isLastStep ? (
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-verde hover:bg-verde/90 text-white cursor-pointer"
                >
                  <Upload />
                  {loading ? "Enviando..." : "Enviar documento"}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-verde hover:bg-verde/90 text-white cursor-pointer"
                >
                  Avançar
                </Button>
              )}
            </div>
        </form>
      </div>
    </div>
  );
}
