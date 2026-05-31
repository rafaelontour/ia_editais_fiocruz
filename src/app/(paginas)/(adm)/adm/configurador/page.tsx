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
import { Plus, Trash2 } from "lucide-react";
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
  excluirGrupoDocumentoService,
  getDocumentGroupItemsService,
  adicionarDocumentoConfiguravelService,
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
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );
  const [carregando, setCarregando] = useState(false);

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
    );
    if (status !== 201) {
      toast.error("Erro ao adicionar documento no grupo.");
      return;
    }

    toast.success("Documento adicionado ao grupo.");
    setNewDocumentoNome("");
    setDocumentDialogAberto(false);
    const items = await getDocumentGroupItemsService(selectedGroupId);
    setItemsByGroup((m) => ({ ...m, [selectedGroupId]: items ?? [] }));
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
                Salvar grupo
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
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar novo documento</DialogTitle>
            <DialogDescription>
              Informe o nome do documento que será associado ao grupo
              selecionado.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="documentoNome">Nome do documento</Label>
              <Input
                id="documentoNome"
                value={newDocumentoNome}
                onChange={(event) => setNewDocumentoNome(event.target.value)}
                placeholder="Ex: Contrato social"
              />
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
              Salvar documento
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
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm">{item.name}</span>
                          <Button
                            variant="ghost"
                            className="text-sm"
                            onClick={() =>
                              excluirDocumentoDoGrupo(grupo.id, item.id)
                            }
                          >
                            Excluir
                          </Button>
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
                        Criado em {new Date(grupo.created_at ?? "").toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="destructive"
                          className="flex items-center gap-2 bg-vermelho text-white hover:bg-vermelho cursor-pointer"
                          onClick={() => excluirGrupo(grupo.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                        <Button
                          className="bg-verde text-white hover:bg-verde cursor-pointer"
                          onClick={() => abrirModalDocumento(grupo.id)}
                        >
                          Adicionar documento
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
    </div>
  );
}
