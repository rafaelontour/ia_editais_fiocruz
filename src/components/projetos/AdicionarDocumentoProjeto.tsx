"use client";

import { Upload, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Tipificacao } from "@/core";
import { DocumentGroupItem } from "@/core/configurador/GrupoDocumento";
import { getDocumentGroupItemsService } from "@/service/configurador";
import { getProjetosService } from "@/service/projeto";
import { getTipificacoesService } from "@/service/tipificacao";
import { getUsuariosPorUnidade } from "@/service/usuario";
import {
  adicionarDocumentoService,
  enviarArquivoDocumentoService,
} from "@/service/documento";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useUsuario from "@/data/hooks/useUsuario";
import Botao from "../BotaoAdicionar";

const schema = z.object({
  tipo: z.string().min(1, "Selecione o tipo do documento"),
  nome: z.string().min(3, "O nome do documento é obrigatório"),
  tipificacoes: z
    .array(z.string())
    .min(1, "Selecione pelo menos uma tipificação"),
  responsavel: z.string().min(1, "Selecione o responsável"),
  identificador: z.string().min(1, "O número do documento é obrigatório"),
  descricao: z.string().min(3, "A descrição é obrigatória"),
  arquivo: z.instanceof(File, { message: "O arquivo é obrigatório" }),
});

interface Props {
  projectId: string;
  onAdded?: () => void;
  defaultTipo?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  withTrigger?: boolean;
}

export default function AdicionarDocumentoProjeto({
  projectId,
  onAdded,
  defaultTipo,
  open,
  onOpenChange,
  withTrigger = true,
}: Props) {
  type Form = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    trigger,
    watch,
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      tipo: "Documento",
      tipificacoes: [],
      responsavel: "",
    },
  });

  const [internalOpen, setInternalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const dialogOpen = open ?? internalOpen;
  const [tipificacoes, setTipificacoes] = useState<Tipificacao[]>([]);
  const [filteredTipificacoes, setFilteredTipificacoes] = useState<
    Tipificacao[]
  >([]);
  const [documentGroupItems, setDocumentGroupItems] = useState<
    DocumentGroupItem[]
  >([]);
  const [projectGroupId, setProjectGroupId] = useState<string | undefined>(
    undefined,
  );
  const [tipificacoesSelecionadas, setTipificacoesSelecionadas] = useState<
    Tipificacao[]
  >([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [responsavelSelecionado, setResponsavelSelecionado] =
    useState<any>(null);
  const { usuario } = useUsuario();
  const urlBase = process.env.NEXT_PUBLIC_URL_BASE ?? "";

  const nomeValue = watch("nome");
  const identificadorValue = watch("identificador");
  const tipoValue = watch("tipo");
  const tipificacoesValue = watch("tipificacoes");
  const responsavelValue = watch("responsavel");
  const descricaoValue = watch("descricao");
  const arquivoValue = watch("arquivo");

  const stepDefinitions = [
    {
      title: "Vamos começar!",
      description: "Preencha as informações básicas.",
    },
    {
      title: "Metade do caminho!",
      description: "Selecione as tipificações e o responsável pelo documento.",
    },
    {
      title: "Quase lá!",
      description: "Revise as informações antes de enviar.",
    },
  ];

  const completedFields = [
    !!nomeValue,
    !!identificadorValue,
    !!(tipoValue || defaultTipo),
    !!tipificacoesValue?.length,
    !!responsavelValue,
    !!descricaoValue,
    !!arquivoValue,
  ].filter(Boolean).length;

  const progressPercentage = Math.min(
    100,
    Math.round((completedFields / 7) * 100),
  );

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === stepDefinitions.length;

  const handleNextStep = async () => {
    const fieldsToValidate: Array<keyof Form> =
      currentStep === 1
        ? ["nome", "identificador", "tipo"]
        : currentStep === 2
          ? ["tipificacoes", "responsavel"]
          : [];

    const valid = fieldsToValidate.length
      ? await trigger(fieldsToValidate)
      : true;

    if (!valid) return;

    if (currentStep < stepDefinitions.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  async function buscarTipificacoes() {
    const t = await getTipificacoesService();
    if (!t) {
      toast.error("Erro ao buscar tipificações!");
      return;
    }
    setTipificacoes(t);
  }

  async function carregarProjetoGrupo() {
    try {
      const projetos = await getProjetosService();
      const projeto = projetos.find((p) => p.id === projectId);
      setProjectGroupId(projeto?.document_group_id);
    } catch (e) {
      setProjectGroupId(undefined);
    }
  }

  async function carregarTiposDoGrupo() {
    try {
      const projetos = await getProjetosService();
      const projeto = projetos.find((p) => p.id === projectId);
      const groupId = projeto?.document_group_id;
      if (!groupId) {
        setDocumentGroupItems([]);
        return;
      }
      const items = await getDocumentGroupItemsService(groupId);
      setDocumentGroupItems(items ?? []);
    } catch (e) {
      setDocumentGroupItems([]);
    }
  }

  async function buscarUsuarios() {
    const u = await getUsuariosPorUnidade(usuario?.unit_id);
    setUsuarios(u ?? []);
  }

  useEffect(() => {
    buscarTipificacoes();
    carregarTiposDoGrupo();
    carregarProjetoGrupo();
  }, []);

  useEffect(() => {
    if (!dialogOpen) return;
    if (defaultTipo) {
      setValue("tipo", defaultTipo);
      return;
    }
    if (documentGroupItems.length > 0) {
      setValue("tipo", documentGroupItems[0].name);
      return;
    }
    setValue("tipo", "Documento");
  }, [dialogOpen, defaultTipo, documentGroupItems, setValue]);

  useEffect(() => {
    if (dialogOpen) {
      buscarUsuarios();
    }
  }, [dialogOpen]);

  const tipoSelecionado = watch("tipo");

  useEffect(() => {
    const filteredByGroup = projectGroupId
      ? tipificacoes.filter((t) => t.document_group_id === projectGroupId)
      : tipificacoes;

    const tipoSelecionadoItem = documentGroupItems.find(
      (i) => i.name === tipoSelecionado,
    );
    const filteredByType = tipoSelecionado && tipoSelecionadoItem
      ? filteredByGroup.filter(
          (t) => t.document_group_item_id === tipoSelecionadoItem.id,
        )
      : filteredByGroup;

    setFilteredTipificacoes(filteredByType);
  }, [tipificacoes, projectGroupId, tipoSelecionado]);

  function limparDados() {
    reset();
    setTipificacoesSelecionadas([]);
    setResponsavelSelecionado(null);
  }

  const setDialogOpenState = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    }
    if (open === undefined) {
      setInternalOpen(value);
    }
    if (!value) {
      limparDados();
      setCurrentStep(1);
    }
    if (value) {
      setCurrentStep(1);
    }
  };

  const onSubmit = async (data: Form) => {
    const usuarioSelecionado = usuarios.find((u) => u.id === data.responsavel);
    const [status, id] = await adicionarDocumentoService(projectId, {
      name: data.nome,
      number: data.identificador,
      type: data.tipo,
      status: "PENDING",
      responsible: data.responsavel,
      responsible_name: usuarioSelecionado?.username,
      responsible_icon: usuarioSelecionado?.icon,
    });

    if (status !== 201) {
      toast.error("Erro ao criar documento");
      return;
    }

    const arquivoField = (data as any).arquivo as File | undefined;
    if (arquivoField) {
      await enviarArquivoDocumentoService(id, arquivoField);
    }

    toast.success("Documento criado");
    limparDados();
    setDialogOpenState(false);
    onAdded && onAdded();
  };

  return (
    <div>
      <Dialog
        open={dialogOpen}
        onOpenChange={(value) => {
          setDialogOpenState(value);
          if (value) buscarUsuarios();
        }}
      >
        {withTrigger && (
          <DialogTrigger asChild>
            <Botao texto="Adicionar Documento" />
          </DialogTrigger>
        )}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Etapa {currentStep} de {stepDefinitions.length}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {currentStep === 1 && (
              <div className="grid gap-4 md:grid-cols-1">
                <div className="space-y-2">
                  <Label>Tipo do documento</Label>
                  {defaultTipo ? (
                    <div className="w-full border rounded px-3 py-2 text-gray-700">
                      {defaultTipo}
                    </div>
                  ) : (
                    <Controller
                      name="tipo"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Tipo de documento</SelectLabel>
                              {documentGroupItems &&
                              documentGroupItems.length > 0 ? (
                                documentGroupItems.map((item) => (
                                  <SelectItem key={item.id} value={item.name}>
                                    {item.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <>
                                  <SelectItem value="Documento">
                                    Documento
                                  </SelectItem>
                                  <SelectItem value="Relatório">
                                    Relatório
                                  </SelectItem>
                                  <SelectItem value="Parecer">
                                    Parecer
                                  </SelectItem>
                                </>
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  )}
                  {errors.tipo && (
                    <span className="text-xs text-red-500">
                      {String(errors.tipo.message)}
                    </span>
                  )}
                  {defaultTipo && (
                    <input
                      type="hidden"
                      value={defaultTipo}
                      {...register("tipo")}
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Nome do documento</Label>
                  <Input {...register("nome")} />
                  {errors.nome && (
                    <span className="text-xs text-red-500">
                      {String(errors.nome.message)}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Número do documento</Label>
                  <Input {...register("identificador")} />
                  {errors.identificador && (
                    <span className="text-xs text-red-500">
                      {String(errors.identificador.message)}
                    </span>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tipificações</Label>
                    <Controller
                      name="tipificacoes"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value=""
                          onValueChange={(value) => {
                            const novoValor = [...(field.value ?? []), value];
                            field.onChange(novoValor);
                            const tipificacaoEncontrada = tipificacoes.find(
                              (t) => t.id === value,
                            );
                            if (tipificacaoEncontrada) {
                              setTipificacoesSelecionadas((prev) => [
                                ...prev,
                                tipificacaoEncontrada,
                              ]);
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
                                .filter(
                                  (t) =>
                                    !tipificacoesSelecionadas.some(
                                      (selected) => selected.id === t.id,
                                    ),
                                )
                                .map((tipificacao) => (
                                  <SelectItem
                                    key={tipificacao.id}
                                    value={tipificacao.id}
                                  >
                                    {tipificacao.name}
                                  </SelectItem>
                                ))}
                              {filteredTipificacoes.length === 0 ? (
                                <SelectItem value="nenhuma" disabled>
                                  Nenhuma tipificação disponível para este grupo
                                </SelectItem>
                              ) : (
                                tipificacoesSelecionadas.length ===
                                  filteredTipificacoes.length && (
                                  <SelectItem value="todos" disabled>
                                    Todas tipificações já foram selecionadas
                                  </SelectItem>
                                )
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.tipificacoes && (
                      <span className="text-xs text-red-500">
                        {String(errors.tipificacoes.message)}
                      </span>
                    )}
                  </div>

                  {tipificacoesSelecionadas.length > 0 && (
                    <div className="space-y-2">
                      <Label>Tipificações selecionadas</Label>
                      <div className="grid grid-cols-3 gap-3 border border-gray-200 rounded-md p-3">
                        {tipificacoesSelecionadas.map((t) => (
                          <div
                            key={t.id}
                            className="flex items-center justify-between gap-3 border border-gray-200 rounded-sm p-2"
                          >
                            <span>{t.name}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const novaLista =
                                  tipificacoesSelecionadas.filter(
                                    (item) => item.id !== t.id,
                                  );
                                setTipificacoesSelecionadas(novaLista);
                                setValue(
                                  "tipificacoes",
                                  novaLista.map((item) => item.id),
                                );
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Responsável</Label>
                    <Controller
                      name="responsavel"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            const usuarioSelecionado = usuarios.find(
                              (u) => u.id === value,
                            );
                            if (usuarioSelecionado) {
                              setResponsavelSelecionado(usuarioSelecionado);
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione um usuário" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Usuários</SelectLabel>
                              {usuarios.length > 0 ? (
                                usuarios.map((usuarioItem) => (
                                  <SelectItem
                                    key={usuarioItem.id}
                                    value={usuarioItem.id}
                                  >
                                    {usuarioItem.username}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="nenhum" disabled>
                                  Nenhum usuário disponível
                                </SelectItem>
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.responsavel && (
                      <span className="text-xs text-red-500">
                        {String(errors.responsavel.message)}
                      </span>
                    )}
                  </div>

                  {responsavelSelecionado && (
                    <div className="space-y-2">
                      <Label>Responsável selecionado</Label>
                      <div className="grid grid-cols-1 gap-3 border border-gray-200 rounded-md p-3">
                        <div className="flex items-center justify-between gap-3 border border-gray-200 rounded-sm p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 overflow-hidden">
                              {responsavelSelecionado.icon?.file_path ? (
                                <img
                                  src={
                                    responsavelSelecionado.icon.file_path.startsWith(
                                      "http",
                                    )
                                      ? responsavelSelecionado.icon.file_path
                                      : `${urlBase}${responsavelSelecionado.icon.file_path}`
                                  }
                                  alt={responsavelSelecionado.username}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <User className="h-5 w-5 text-gray-500" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold">
                                {responsavelSelecionado.username}
                              </p>
                              <p className="text-xs text-gray-500">
                                Responsável
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setResponsavelSelecionado(null);
                              setValue("responsavel", "");
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    {...register("descricao")}
                    className="min-h-[154px]"
                  />
                  {errors.descricao && (
                    <span className="text-xs text-red-500">
                      {String(errors.descricao.message)}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Upload do documento</Label>
                  <Controller
                    name="arquivo"
                    control={control}
                    render={({ field }) => (
                      <FileUpload
                        onChange={(files: File[]) => field.onChange(files[0])}
                      />
                    )}
                  />
                  {errors.arquivo && (
                    <span className="text-xs text-red-500">
                      {String(errors.arquivo.message)}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full justify-between">
              <div className="flex items-center gap-2 justify-between w-full ">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={isFirstStep}
                >
                  Voltar
                </Button>
                {!isLastStep && (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-verde text-white hover:bg-verde
                  cursor-pointer"
                  >
                    Avançar
                  </Button>
                )}
              </div>

              <div className="flex justify-end gap-2">
                {isLastStep ? (
                  <Button type="submit" className="bg-vermelho text-white">
                    <Upload />
                    Salvar documento
                  </Button>
                ) : null}
              </div>
            </div>
          </form>

          <DialogFooter />
        </DialogContent>
      </Dialog>
    </div>
  );
}
