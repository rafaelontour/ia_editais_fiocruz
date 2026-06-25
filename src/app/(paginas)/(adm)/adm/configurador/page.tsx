"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ImageIcon,
  Pencil,
  PencilLine,
  Plus,
  Trash,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Masonry from "react-masonry-css";
import Div from "@/components/Div";
import {
  DocumentGroup,
  DocumentGroupItem,
} from "@/core/configurador/GrupoDocumento";
import {
   getDocumentGroupsService,
   adicionarGrupoDocumentoService,
   atualizarGrupoDocumentoService,
   excluirGrupoDocumentoService,
   getDocumentGroupItemsService,
   adicionarDocumentoConfiguravelService,
   atualizarDocumentoConfiguravelService,
   excluirDocumentoConfiguravelService,
 } from "@/service/configurador";

export default function ConfiguradorPage() {
  const [grupos, setGrupos] = useState<DocumentGroup[]>([]);
  const [itemsByGroup, setItemsByGroup] = useState<
    Record<string, DocumentGroupItem[]>
  >({});
  const [nomeGrupo, setNomeGrupo] = useState("");
  const [dialogAberto, setDialogAberto] = useState(false);
  const [documentDialogAberto, setDocumentDialogAberto] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [newDocumentoNome, setNewDocumentoNome] = useState("");
  const [newDocumentoImagem, setNewDocumentoImagem] = useState<string>("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );
  const [carregando, setCarregando] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [editDialogAberto, setEditDialogAberto] = useState(false);
  const [editItem, setEditItem] = useState<DocumentGroupItem | null>(null);
  const [editDocumentoNome, setEditDocumentoNome] = useState("");
  const [editDocumentoImagem, setEditDocumentoImagem] = useState<string>("");
  const [editGroupDialogAberto, setEditGroupDialogAberto] = useState(false);
  const [editGroupId, setEditGroupId] = useState<string | null>(null);
  const [editGroupName, setEditGroupName] = useState("");

  const breakpointColumnsObj = { default: 3, 1500: 3, 1000: 2, 700: 1 };

  useEffect(() => {
    carregarGrupos();
  }, []);

  const carregarGrupos = async () => {
    const dados = await getDocumentGroupsService();
    const grupos = dados ?? [];
    setGrupos(grupos);

    // carregar itens por grupo
    const map: Record<string, DocumentGroupItem[]> = {};
    for (const g of grupos) {
      const items = await getDocumentGroupItemsService(g.id);
      map[g.id] = items ?? [];
    }
    setItemsByGroup(map);
  };

  const adicionarGrupo = async () => {
    if (!nomeGrupo.trim()) {
      toast.error("Informe um nome para o grupo de documentos.");
      return;
    }

    setCarregando(true);
    const [status] = await adicionarGrupoDocumentoService(nomeGrupo.trim());
    setCarregando(false);

    if (status !== 201) {
      toast.error("Erro ao adicionar grupo de documentos.");
      return;
    }

    toast.success("Grupo de documentos adicionado com sucesso.");
    setNomeGrupo("");
    setDialogAberto(false);
    carregarGrupos();
  };

  const excluirGrupo = async (id: string) => {
    const status = await excluirGrupoDocumentoService(id);
    if (status !== 204) {
      toast.error("Erro ao excluir o grupo.");
      return;
    }

    toast.success("Grupo excluído com sucesso.");
    carregarGrupos();
  };

  const abrirModalDocumento = (groupId: string) => {
    setSelectedGroupId(groupId);
    setNewDocumentoNome("");
    setDocumentDialogAberto(true);
  };

  const fecharModalDocumento = () => {
    setDocumentDialogAberto(false);
    setSelectedGroupId(null);
    setNewDocumentoNome("");
    setNewDocumentoImagem("");
  };

  const adicionarDocumentoAoGrupo = async () => {
    if (!selectedGroupId) {
      toast.error("Grupo não selecionado.");
      return;
    }

    const name = newDocumentoNome.trim();
    if (!name) {
      toast.error("Informe o nome do documento.");
      return;
    }

    const [status] = await adicionarDocumentoConfiguravelService(
      selectedGroupId,
      name,
      newDocumentoImagem || undefined,
    );
    if (status !== 201) {
      toast.error("Erro ao adicionar documento no grupo.");
      return;
    }

    toast.success("Documento adicionado ao grupo.");
    setNewDocumentoNome("");
    setNewDocumentoImagem("");
    setDocumentDialogAberto(false);
    const items = await getDocumentGroupItemsService(selectedGroupId);
    setItemsByGroup((m) => ({ ...m, [selectedGroupId]: items ?? [] }));
  };

  const abrirModalEditarGrupo = (grupo: DocumentGroup) => {
    setEditGroupId(grupo.id);
    setEditGroupName(grupo.name);
    setEditGroupDialogAberto(true);
  };

  const fecharModalEditarGrupo = () => {
    setEditGroupDialogAberto(false);
    setEditGroupId(null);
    setEditGroupName("");
  };

  const atualizarGrupo = async () => {
    if (!editGroupId || !editGroupName.trim()) {
      toast.error("Informe um nome para o grupo.");
      return;
    }

    const status = await atualizarGrupoDocumentoService(
      editGroupId,
      editGroupName.trim(),
    );
    if (status !== 200) {
      toast.error("Erro ao atualizar grupo.");
      return;
    }

    toast.success("Grupo atualizado.");
    fecharModalEditarGrupo();
    carregarGrupos();
  };

  const abrirModalEditarDocumento = (item: DocumentGroupItem) => {
    setEditItem(item);
    setEditDocumentoNome(item.name);
    setEditDocumentoImagem(item.icon_path ?? "");
    setEditDialogAberto(true);
  };

  const fecharModalEditarDocumento = () => {
    setEditDialogAberto(false);
    setEditItem(null);
    setEditDocumentoNome("");
    setEditDocumentoImagem("");
  };

  const atualizarDocumentoNoGrupo = async () => {
    if (!editItem) {
      toast.error("Item não selecionado.");
      return;
    }

    const name = editDocumentoNome.trim();
    if (!name) {
      toast.error("Informe o nome do documento.");
      return;
    }

    const status = await atualizarDocumentoConfiguravelService(
      editItem.id,
      name,
      editDocumentoImagem || undefined,
    );
    if (status !== 200) {
      toast.error("Erro ao atualizar documento.");
      return;
    }

    toast.success("Documento atualizado.");
    fecharModalEditarDocumento();
    const items = await getDocumentGroupItemsService(editItem.group_id);
    setItemsByGroup((m) => ({ ...m, [editItem.group_id]: items ?? [] }));
  };

  const excluirDocumentoDoGrupo = async (groupId: string, itemId: string) => {
    const status = await excluirDocumentoConfiguravelService(itemId);
    if (status !== 204) {
      toast.error("Erro ao excluir documento.");
      return;
    }
    toast.success("Documento excluído.");
    const items = await getDocumentGroupItemsService(groupId);
    setItemsByGroup((m) => ({ ...m, [groupId]: items ?? [] }));
  };

  const toggleExpandGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-4xl font-bold">Modo Configurador</p>
        </div>

        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-vermelho text-white">
              <Plus size={18} />
              Adicionar grupo
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar novo grupo</DialogTitle>
              <DialogDescription>
                Crie um grupo de documentos para ser usado em tipificações e em
                projetos.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="grupoNome">Nome do grupo</Label>
                <Input
                  id="grupoNome"
                  value={nomeGrupo}
                  onChange={(event) => setNomeGrupo(event.target.value)}
                  placeholder="Ex: Documentos de compliance"
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose>
                <Button
                  variant="secondary"
                  className="cursor-pointer text-white bg-vermelho hover:bg-vermelho"
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                onClick={adicionarGrupo}
                disabled={carregando}
                className="bg-verde cursor-pointer hover:bg-verde text-white"
              >
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog
        open={documentDialogAberto}
        onOpenChange={(open) => {
          setDocumentDialogAberto(open);
          if (!open) {
            setSelectedGroupId(null);
            setNewDocumentoNome("");
            setNewDocumentoImagem("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar novo tipo de documento</DialogTitle>
            <DialogDescription>
              Informe o nome do tipo de documento que será associado ao grupo
              selecionado.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="documentoNome">Nome</Label>
              <Input
                id="documentoNome"
                value={newDocumentoNome}
                onChange={(event) => setNewDocumentoNome(event.target.value)}
                placeholder="Ex: Contrato social"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Imagem (opcional)</Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="relative cursor-pointer"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setNewDocumentoImagem(ev.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    };
                    input.click();
                  }}
                >
                  <ImageIcon size={16} className="mr-1" />
                  Escolher imagem
                </Button>

                {newDocumentoImagem && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-500 cursor-pointer"
                    onClick={() => setNewDocumentoImagem("")}
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>

              {newDocumentoImagem && (
                <div className="relative mt-2 inline-block">
                  <img
                    src={newDocumentoImagem}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose>
              <Button
                variant="secondary"
                className="cursor-pointer bg-vermelho hover:bg-vermelho text-white"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              onClick={adicionarDocumentoAoGrupo}
              className="bg-verde text-white hover:bg-verde cursor-pointer"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editGroupDialogAberto}
        onOpenChange={(open) => {
          setEditGroupDialogAberto(open);
          if (!open) fecharModalEditarGrupo();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar grupo</DialogTitle>
            <DialogDescription>
              Altere o nome do grupo de documentos.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="editGrupoNome">Nome do grupo</Label>
              <Input
                id="editGrupoNome"
                value={editGroupName}
                onChange={(event) => setEditGroupName(event.target.value)}
                placeholder="Ex: Documentos de compliance"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose>
              <Button
                variant="secondary"
                className="cursor-pointer text-white bg-vermelho hover:bg-vermelho"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              onClick={atualizarGrupo}
              className="bg-verde cursor-pointer hover:bg-verde text-white"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editDialogAberto}
        onOpenChange={(open) => {
          setEditDialogAberto(open);
          if (!open) {
            fecharModalEditarDocumento();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar tipo de documento</DialogTitle>
            <DialogDescription>
              Altere o nome ou a imagem do tipo de documento.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="editDocumentoNome">Nome</Label>
              <Input
                id="editDocumentoNome"
                value={editDocumentoNome}
                onChange={(event) => setEditDocumentoNome(event.target.value)}
                placeholder="Ex: Contrato social"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Imagem (opcional)</Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="relative cursor-pointer"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setEditDocumentoImagem(ev.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    };
                    input.click();
                  }}
                >
                  <ImageIcon size={16} className="mr-1" />
                  {editDocumentoImagem ? "Trocar imagem" : "Escolher imagem"}
                </Button>

                {editDocumentoImagem && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-500 cursor-pointer"
                    onClick={() => setEditDocumentoImagem("")}
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>

              {editDocumentoImagem && (
                <div className="relative mt-2 inline-block">
                  <img
                    src={editDocumentoImagem}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose>
              <Button
                variant="secondary"
                className="cursor-pointer bg-vermelho hover:bg-vermelho text-white"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              onClick={atualizarDocumentoNoGrupo}
              className="bg-verde text-white hover:bg-verde cursor-pointer"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {grupos.length === 0 ? (
        <Div>
          <p className="text-gray-500">
            Nenhum grupo cadastrado ainda. Use o botão acima para criar um
            grupo.
          </p>
        </Div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex gap-4"
          columnClassName="flex flex-col gap-4"
        >
          {grupos.map((grupo) => {
            const documentos = itemsByGroup[grupo.id] ?? [];
            const documentosVisiveis = expandedGroups[grupo.id]
              ? documentos
              : documentos.slice(0, 3);

            return (
              <Div key={grupo.id}>
                <div>
                  <p className="text-xl font-semibold">{grupo.name}</p>
                </div>
                <div className="mt-3">
                  <p className="text-sm font-medium">Documentos:</p>
                  {documentos.length > 0 ? (
                    <ul className="mt-2 space-y-1">
                      {documentosVisiveis.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {item.icon_path && (
                              <img
                                src={item.icon_path}
                                alt=""
                                className="h-6 w-6 rounded object-cover cursor-pointer flex-shrink-0 hover:opacity-80"
                                title="Clique para ampliar"
                                onClick={() =>
                                  setExpandedImage(item.icon_path ?? null)
                                }
                              />
                            )}
                            <span className="text-sm truncate">
                              {item.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              className="text-xs border border-gray-300 rounded-md hover:bg-gray-100 px-2 cursor-pointer"
                              onClick={() => abrirModalEditarDocumento(item)}
                              title="Editar"
                            >
                              Editar
                            </Button>
                            <Button
                              variant="ghost"
                              className="text-xs border border-gray-300 rounded-md hover:bg-gray-100 px-2 cursor-pointer"
                              onClick={() =>
                                excluirDocumentoDoGrupo(grupo.id, item.id)
                              }
                            >
                              Excluir
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400 mt-2">
                      Nenhum documento configurável.
                    </p>
                  )}

                  <div className="flex flex-col gap-2 mt-4">
                    <div className="flex items-center justify-between gap-2 text-sm text-gray-400">
                      <span>
                        Criado em{" "}
                        {new Date(grupo.created_at ?? "").toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          title="Adicionar documento"
                          className="h-8 w-8 bg-verde text-white hover:bg-verde cursor-pointer rounded-sm"
                          onClick={() => abrirModalDocumento(grupo.id)}
                        >
                          <Plus size={16} />
                        </Button>
                        <Button
                          title="Editar grupo"
                          className={`
                                                                 h-8 w-8 hover:cursor-pointer border border-gray-300 rounded-sm
                                                                 bg-branco hover:bg-branco
                                                             `}
                          onClick={() => abrirModalEditarGrupo(grupo)}
                        >
                          <PencilLine size={16} color="black" />
                        </Button>
                        <Button
                          title="Excluir grupo"
                          variant="destructive"
                          className="h-8 w-8 bg-vermelho hover:bg-vermelho hover:cursor-pointer rounded-sm"
                          onClick={() => excluirGrupo(grupo.id)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </div>
                    {documentos.length > 3 ? (
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => toggleExpandGroup(grupo.id)}
                      >
                        {expandedGroups[grupo.id]
                          ? "Mostrar menos"
                          : `Mostrar mais (${documentos.length - 3})`}
                      </Button>
                    ) : null}
                  </div>
                </div>
              </Div>
            );
          })}
        </Masonry>
      )}
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
    </div>
  );
}
