"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Play,
  Eye,
  View,
  Loader2,
  CheckCircle2,
  Plus,
  Trash2,
  Bot,
  X,
  LayoutGrid,
} from "lucide-react";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { Projeto, DocumentoProjeto } from "@/core/projeto/Projeto";
import { DocumentGroupItem } from "@/core/configurador/GrupoDocumento";
import { getProjetosService } from "@/service/projeto";
import {
  getDocumentosPorProjetoService,
  marcarEnviadoAoKanban,
  excluirDocumentoService,
} from "@/service/documento";
import { adicionarEditalService, getEditalPorProjectDocumentIdService } from "@/service/edital";
import { enviarArquivoService } from "@/service/editalArquivo";
import { getDocumentGroupItemsService, getDocumentGroupsService } from "@/service/configurador";
import { getUsuariosPorUnidade } from "@/service/usuario";
import AdicionarDocumentoProjeto from "@/components/projetos/AdicionarDocumentoProjeto";

import useEditalProc from "@/data/hooks/useProcEdital";
import { toast } from "sonner";
import useUsuario from "@/data/hooks/useUsuario";
import Calendario from "@/components/Calendario";

export default function ProjetoInternoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [documentos, setDocumentos] = useState<DocumentoProjeto[]>([]);
  const [documentGroupItems, setDocumentGroupItems] = useState<
    DocumentGroupItem[]
  >([]);
  const [documentGroups, setDocumentGroups] = useState<any[]>([]);
  const [removedGroupItemIds, setRemovedGroupItemIds] = useState<string[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<Record<string, File>>({});
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const urlBase = process.env.NEXT_PUBLIC_URL_BASE ?? "";

  const { usuario } = useUsuario();
  const { lista, salvarLista } = useEditalProc();

  const [openAddSameTypeDocumento, setOpenAddSameTypeDocumento] =
    useState(false);
  const [defaultTipoDocumento, setDefaultTipoDocumento] = useState<
    string | undefined
  >(undefined);

  async function fetch() {
    setCarregando(true);
    const ps = await getProjetosService();
    const p = ps.find((x) => x.id === id) ?? null;
    setProjeto(p);
    const docs = await getDocumentosPorProjetoService(id);
    setDocumentos(docs);

    const groups = await getDocumentGroupsService();
    setDocumentGroups(groups ?? []);

    if (p?.document_group_id) {
      const items = await getDocumentGroupItemsService(p.document_group_id);
      setDocumentGroupItems(items ?? []);
    } else {
      setDocumentGroupItems([]);
    }

    if (usuario?.unit_id) {
      const u = await getUsuariosPorUnidade(usuario.unit_id);
      setUsuarios(u ?? []);
    }

    setCarregando(false);
  }

  useEffect(() => {
    if (id) fetch();
  }, [id, usuario?.unit_id]);

  const documentosEnviados = documentos.filter((d) => d.sent_to_kanban).length;
  const documentosConcluidos = documentos.filter((d) => {
    const status = d.status?.toLowerCase();
    return status === "completed" || status === "finalizado";
  }).length;

  const allSentToKanban =
    documentos.length > 0 && documentosEnviados >= documentos.length;
  const allCompleted =
    documentos.length > 0 && documentosConcluidos >= documentos.length;

  const progressoPercentual = documentos.length
    ? allSentToKanban
      ? 50 + Math.round((documentosConcluidos / documentos.length) * 50)
      : Math.round((documentosEnviados / documentos.length) * 50)
    : 0;

  const activeStep = allCompleted ? 2 : allSentToKanban ? 1 : 0;

  const progressSteps = [
    { label: "Iniciado", icon: Play },
    { label: "Em andamento", icon: Loader2 },
    { label: "Finalizado", icon: CheckCircle2 },
  ];

  const getResponsaveisAnimatedItems = (doc: DocumentoProjeto) => {
    const userIds = doc.responsibles ?? (doc.responsible ? [doc.responsible] : []);
    return userIds.map((userId, index) => {
      const user = usuarios.find((u) => u.id === userId);
      const label = ({ DEFAULT: "Padrão", ADMIN: "Administrador", ANALYST: "Analista", AUDITOR: "Auditor" } as Record<string, string>)[user?.access_level ?? ""] ?? user?.access_level ?? "Usuário";
      return {
        id: index,
        name: user?.username?.split(" ")[0] ?? "Usuário",
        designation: label,
        image: user?.icon?.file_path
          ? `${urlBase}${user.icon.file_path}`
          : "/user.png",
      };
    });
  };

  const formatDocumentStatus = (status?: string, enviadoAoKanban?: boolean) => {
    if (!status) return "Sem status";
    switch (status.toLowerCase()) {
      case "pending":
        return enviadoAoKanban ? "Rascunho" : "Pendente";
      case "under_construction":
      case "UNDER_CONSTRUCTION":
        return "Em construção";
      case "waiting_for_review":
      case "WAITING_FOR_REVIEW":
        return "Aguardando revisão";
      case "completed":
      case "COMPLETED":
        return "Concluído";
      case "iniciado":
      case "INICIADO":
        return "Iniciado";
      case "em_andamento":
      case "EM_ANDAMENTO":
        return "Em andamento";
      case "finalizado":
      case "FINALIZADO":
        return "Finalizado";
      default:
        return status;
    }
  };

  const enviarParaKanban = async (doc: DocumentoProjeto) => {
    if (saving) return;
    setSaving(true);
    try {
      const payload = {
        name: doc.name,
        identifier: doc.number ?? doc.id,
        description: doc.type ?? "",
        grupo: projeto?.document_group_id
          ? documentGroups.find((g) => g.id === projeto.document_group_id)?.name ?? ""
          : "",
        tipo_documento: doc.type ?? "",
        projeto_nome: projeto?.name ?? "",
        typification_ids: doc.typification_ids ?? [],
        editors_ids: doc.responsibles?.length
          ? doc.responsibles
          : doc.responsible
            ? [doc.responsible]
            : [],
        project_document_id: doc.id,
      };

      const [resposta, idEdital] = (await adicionarEditalService(payload)) ?? [];

      if (resposta !== 201 || !idEdital) {
        toast.error("Erro ao enviar documento para o Kanban");
        return;
      }

      if (!lista.includes(idEdital)) {
        lista.push(idEdital);
        salvarLista(lista);
      }

      const file = pendingFiles[doc.id];
      if (file) {
        const uploadStatus = await enviarArquivoService(idEdital, file);
        if (uploadStatus !== 201) {
          toast.error("Erro ao fazer upload do arquivo");
        } else {
          setPendingFiles((prev) => {
            const next = { ...prev };
            delete next[doc.id];
            return next;
          });
        }
      }

      await marcarEnviadoAoKanban(doc.id);
      toast.success("Documento enviado para Kanban");
      fetch();
      router.push("/adm/editais");
    } finally {
      setSaving(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    if (saving) return;
    setSaving(true);
    try {
      const status = await excluirDocumentoService(documentId);
      if (status !== 204) {
        toast.error("Erro ao excluir documento");
        return;
      }
      toast.success("Documento excluído");
      fetch();
    } finally {
      setSaving(false);
    }
  };

  const removePlaceholderRow = (groupItemId: string) => {
    setRemovedGroupItemIds((prev) => [...prev, groupItemId]);
  };

  type DocumentRow = {
    groupItem: DocumentGroupItem;
    doc?: DocumentoProjeto;
  };

  const documentRows: DocumentRow[] = documentGroupItems
    .filter((item) => !removedGroupItemIds.includes(item.id))
    .reduce<DocumentRow[]>((rows, item) => {
      const docsOfType = documentos.filter((d) => d.type === item.name);
      if (docsOfType.length === 0) {
        rows.push({ groupItem: item, doc: undefined });
        return rows;
      }
      docsOfType.forEach((doc) => rows.push({ groupItem: item, doc }));
      return rows;
    }, []);

  return (
    <div className="flex flex-col gap-5">
      {carregando ? (
        <div className="flex justify-center items-center gap-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <p className="animate-pulse">Carregando projeto...</p>
          <Loader2 className="animate-spin" />
        </div>
      ) : (
      <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft />
          </Button>
          <div>
            <h2 className="text-3xl font-bold">{projeto?.name}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.push(`/adm/editais?projeto=${encodeURIComponent(projeto?.name ?? "")}`)}
            className="flex rounded-md gap-2 items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:cursor-pointer"
            style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
          >
            <LayoutGrid size={18} />
            <span className="text-sm">Meus Documentos</span>
          </Button>
          <AdicionarDocumentoProjeto
            projectId={id}
            onAdded={(docId, file) => {
              if (file && docId) setPendingFiles((prev) => ({ ...prev, [docId]: file }));
              fetch();
            }}
          />
        </div>
      </div>
      <AdicionarDocumentoProjeto
        projectId={id}
        defaultTipo={defaultTipoDocumento}
        open={openAddSameTypeDocumento}
        onOpenChange={setOpenAddSameTypeDocumento}
        withTrigger={false}
        onAdded={(docId, file) => {
          if (file && docId) setPendingFiles((prev) => ({ ...prev, [docId]: file }));
          setDefaultTipoDocumento(undefined);
          setOpenAddSameTypeDocumento(false);
          fetch();
        }}
      />

      <div className="w-full rounded-xl bg-white border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="min-w-0">
            <h3 className="text-2xl font-semibold">Documentos do Projeto</h3>
            <p className="text-sm text-gray-500">
              Acompanhe todos os documentos relacionados
            </p>
          </div>

          <div className="w-full rounded-xl p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-semibold text-gray-700">
                {progressoPercentual}%
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border p-2 ${
                      activeStep >= 0
                        ? "bg-verde text-white border-verde"
                        : "bg-white border border-gray-300 text-gray-500"
                    }`}
                  >
                    <Play className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.12em] text-gray-600">
                    Iniciado
                  </span>
                </div>

                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-gray-200" />
                  <div
                    className="absolute inset-y-0 left-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-verde"
                    style={{ width: `${progressoPercentual}%` }}
                  />
                  <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full border p-2 ${
                        activeStep >= 1
                          ? "bg-verde text-white border-verde"
                          : "bg-white border border-gray-300 text-gray-500"
                      }`}
                    >
                      <Loader2 className="h-4 w-4" />
                    </div>
                    <span className="mt-2 text-[11px] uppercase tracking-[0.12em] text-gray-600">
                      Em andamento
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border p-2 ${
                      activeStep >= 2
                        ? "bg-verde text-white border-verde"
                        : "bg-white border border-gray-300 text-gray-500"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.12em] text-gray-600">
                    Finalizado
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full table-fixed border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10 border-b">
            <tr>
              <th className="p-2 text-left">Tipo</th>
              <th className="p-2 text-left">Nome</th>
              <th className="p-2 text-left">Número</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Criado em</th>
              <th className="p-2 text-left">Responsável</th>
              <th className="p- text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {documentRows.map(({ groupItem, doc }) => (
              <tr
                key={doc?.id ?? groupItem.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    {groupItem.icon_path && (
                      <img
                        src={groupItem.icon_path}
                        alt=""
                        className="h-6 w-6 rounded object-cover cursor-pointer flex-shrink-0 hover:opacity-80"
                        title="Clique para ampliar"
                        onClick={() => setExpandedImage(groupItem.icon_path ?? null)}
                      />
                    )}
                    <span>{groupItem.name}</span>
                  </div>
                </td>
                <td className="p-2">{doc?.name ?? ""}</td>
                <td className="p-2">{doc?.number ?? ""}</td>
                <td className="p-2">
                  {doc ? formatDocumentStatus(doc.status, doc.sent_to_kanban) : ""}
                </td>
                <td className="p-2">
                  {doc?.created_at ? <Calendario data={doc.created_at} /> : ""}
                </td>
                <td className="p-2">
                  {doc ? <AnimatedTooltip items={getResponsaveisAnimatedItems(doc)} /> : ""}
                </td>
                <td className="p-2 flex items-center gap-2">
                  {!doc ? (
                    <>
                      <Button
                        onClick={() => {
                          setDefaultTipoDocumento(groupItem.name);
                          setOpenAddSameTypeDocumento(true);
                        }}
                        title="Adicionar documento deste tipo"
                        className="h-10 w-10 hover:cursor-pointer border border-gray-300 rounded-sm bg-branco hover:bg-branco"
                      >
                        <Plus color="black" />
                      </Button>
                    </>
                  ) : doc.sent_to_kanban ? (
                    <Button
                      onClick={async () => {
                        const edital = await getEditalPorProjectDocumentIdService(doc.id);
                        if (edital?.id) {
                          router.push(`/adm/editais/${edital.id}`);
                        } else {
                          toast.error("Edital não encontrado");
                        }
                      }}
                      title="Visualizar análise do OiacIA"
                      className="h-10 w-10 hover:cursor-pointer border border-gray-300 rounded-sm bg-branco hover:bg-branco"
                    >
                      <Bot color="black" />
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => enviarParaKanban(doc)}
                        disabled={saving}
                        title="Enviar para Kanban"
                        className="h-10 w-10 bg-verde hover:cursor-pointer border border-gray-300 rounded-sm text-white hover:bg-verde"
                      >
                        <Play color="white" />
                      </Button>
                      <Button
                        onClick={() => deleteDocument(doc.id)}
                        disabled={saving}
                        title="Excluir documento"
                        className="h-10 w-10 hover:cursor-pointer border border-gray-300 rounded-sm bg-branco hover:bg-branco"
                      >
                        <Trash2 color="black" />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {expandedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={expandedImage}
              alt="Imagem ampliada"
              className="max-w-full max-h-[90vh] rounded shadow-2xl"
            />
            <button
              className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow cursor-pointer"
              onClick={() => setExpandedImage(null)}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
}
