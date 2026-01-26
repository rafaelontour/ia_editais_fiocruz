"use client";
import BarraDePesquisa from "@/components/BarraDePesquisa";
import BotaoAdicionar from "@/components/BotaoAdicionar";
import DetalheCaso from "@/components/casos/DetalheCaso";
import ListaCaso from "@/components/casos/ListaCaso";
import FormularioCaso from "@/components/formuarios/FormularioCaso";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edital, Tipificacao } from "@/core";
import { Caso } from "@/core/caso";
import { Teste } from "@/core/teste";
import useUsuario from "@/data/hooks/useUsuario";
import {
  adicionarCasoService,
  atualizarCasoService,
  buscarCasoPorColecaoService,
  buscarCasoService,
  excluirCasoService,
} from "@/service/caso";
import { getEditaisService } from "@/service/edital";
import { getTestesService } from "@/service/teste";
import { getTipificacoesService } from "@/service/tipificacao";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface CasosContainerProps {
  collectionId?: string;
  hideCreateButton?: boolean;
}

export default function CasosContainer({
  collectionId,
  hideCreateButton,
}: CasosContainerProps) {
  const [carregando, setCarregando] = useState<boolean>(true);
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [casoSelecionado, setCasoSelecionado] = useState<Caso | null>(null);
  const [editandoForm, setEditandoForm] = useState<any>(null);
  const [openDialogEditar, setOpenDialogEditar] = useState(false);
  const termoBusca = useRef<string>("");
  const [casoFiltrado, setCasoFiltrado] = useState<Caso[]>([]);

  // Tipificações
  const [tipificacoes, setTipificacoes] = useState<Tipificacao[]>([]);
  const [carregandoTip, setCarregandoTip] = useState(true);

  // Testes
  const [testes, setTestes] = useState<Teste[]>([]);
  const [carregandoTeste, setCarregandoTeste] = useState(true);

  // Editais
  const [editais, setEditais] = useState<Edital[]>([]);
  const [carregandoEdital, setCarregandoEdital] = useState(true);

  // Contexto para pegar idUnidade
  const { usuario } = useUsuario();
  const idUnidade = usuario?.unit_id;

  useEffect(() => {
    async function carregar() {
      console.log("Collection id: ", collectionId);
      let resultado;

      if (collectionId) {
        resultado = await buscarCasoPorColecaoService(collectionId);
      } else {
        resultado = await buscarCasoService();
      }

      if (resultado) {
        setCasos(resultado);
        setCasoFiltrado(resultado);
        setCarregando(false);
      }
    }

    carregar();
  }, [collectionId]);

  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await getTipificacoesService();
        setTipificacoes(resposta ?? []);
      } catch (e) {
        console.error("Erro ao carregar tipificações", e);
      } finally {
        setCarregandoTip(false);
      }
    }
    carregar();
  }, []);

  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await getTestesService();
        setTestes(resposta ?? []);
      } catch (e) {
        console.error("Erro ao carregar testes", e);
      } finally {
        setCarregandoTeste(false);
      }
    }
    carregar();
  }, []);

  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await getEditaisService(idUnidade);
        setEditais(resposta ?? []);
      } catch (e) {
        console.error("Erro ao carregar editais", e);
      } finally {
        setCarregandoEdital(false);
      }
    }

    if (idUnidade) {
      carregar();
    }
  }, [idUnidade]);

  function filtrarCaso() {
    if (termoBusca.current.trim() === "") {
      setCasoFiltrado(casos);
      return;
    }

    const cc = casos.filter(
      (c) =>
        c.name &&
        c.name.toLowerCase().startsWith(termoBusca.current.toLowerCase()),
    );

    setCasoFiltrado(cc);
  }

  const [casos, setCasos] = useState<Caso[]>([]);

  async function salvarEdicao(data: {
    name: string;
    taxonomy_id: string;
    typification_id: string;
    branch_id: string;
    test_collection_id: string;
    //doc_id: string;
    expected_fulfilled: string;
    expected_feedback: string;
    //input: string;
    created_at?: string;
  }) {
    try {
      const payload = {
        ...data,
        expected_fulfilled: data.expected_fulfilled === "true",
      };

      const sucesso = await atualizarCasoService(editandoForm.id, data);

      if (!sucesso) {
        toast.error("Erro ao atualizar caso");
        return;
      }

      const novosCasos = casoFiltrado.map((t) =>
        t.id === editandoForm.id ? { ...t, ...payload } : t,
      );

      setCasos(novosCasos);
      setCasoFiltrado(novosCasos);

      if (casoSelecionado && casoSelecionado.id === editandoForm.id) {
        const metricaAtualizada = novosCasos.find(
          (m) => m.id === editandoForm.id,
        );

        if (metricaAtualizada) {
          setCasoSelecionado(metricaAtualizada);
        }
      }
      toast.success("Caso atualizado com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro inesperado ao atualizar caso");
    }
  }

  async function excluirCaso(id: string) {
    const sucesso = await excluirCasoService(id);

    if (!sucesso) {
      toast.error("Erro ao excluir caso");
      return;
    }

    toast.success("Caso de teste excluído com sucesso!");

    setCasos(casos.filter((t) => t.id !== id));
    setCasoFiltrado(casos.filter((t) => t.id !== id));
  }

  function getNomeTeste(id: string) {
    return testes.find((t) => t.id === id)?.name ?? id;
  }

  const ramos = tipificacoes.flatMap((t) =>
    (t.taxonomies ?? []).flatMap((tx) => tx.branches ?? []),
  );

  function getNomeRamo(id: string): string {
    const ram = ramos.find((r) => r.id === id);
    return ram?.title ?? "";
  }

  function getNomeEdital(id: string) {
    return editais.find((e) => e.id === id)?.name ?? id;
  }

  function getNomeTipificacaoPorBranchId(branchId: string): string {
    for (const tip of tipificacoes) {
      for (const tax of tip.taxonomies ?? []) {
        for (const branch of tax.branches ?? []) {
          if (branch.id === branchId) {
            return tip.name ?? "";
          }
        }
      }
    }
    return branchId; // fallback
  }

  function getNomeTaxonomiaPorBranchId(branchId: string): string {
    for (const tip of tipificacoes) {
      for (const tax of tip.taxonomies ?? []) {
        for (const branch of tax.branches ?? []) {
          if (branch.id === branchId) {
            return tax.title ?? "";
          }
        }
      }
    }
    return branchId; // fallback
  }

  return (
    <>
      <div className="flex flex-col gap-5 ">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-bold">Gestão de casos de testes</h2>
          {/* Modal do Form */}
          {!hideCreateButton && !casoSelecionado && (
            <Dialog open={openDialogAdd} onOpenChange={setOpenDialogAdd}>
              <DialogTrigger asChild>
                <BotaoAdicionar texto="Adicionar caso" />
              </DialogTrigger>
              <DialogContent className="py-6 pl-6 pr-4">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold">
                    Adicionar caso de teste
                  </DialogTitle>
                  <DialogDescription>
                    Preencha os campos abaixo para adicionar um novo caso de
                    teste
                  </DialogDescription>
                </DialogHeader>

                <FormularioCaso
                  mode="create"
                  tipificacoes={tipificacoes}
                  testes={testes}
                  editais={editais}
                  carregandoTip={carregandoTip}
                  onSubmit={async (data) => {
                    try {
                      const novoCaso = await adicionarCasoService({
                        name: data.name,
                        taxonomy_id: data.taxonomia,
                        typification_id: data.tipificacao,
                        branch_id: data.branch_id,
                        test_collection_id: data.test_collection_id,
                        // doc_id: data.doc_id,
                        expected_fulfilled: data.expected_fulfilled,
                        expected_feedback: data.expected_feedback,
                        // input: data.input,
                      });

                      if (!novoCaso) {
                        toast.error("Erro ao adicionar caso teste");
                        return;
                      }

                      setCasos((prev) => [novoCaso, ...prev]);
                      setCasoFiltrado((prev) => [novoCaso, ...prev]);

                      toast.success("Caso teste adicionado com sucesso!");
                      setOpenDialogAdd(false);
                    } catch (e) {
                      console.error(e);
                      toast.error("Erro inesperado ao adicionar caso teste");
                    }
                  }}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        <>
          {!casoSelecionado && (
            <BarraDePesquisa funcFiltrar={filtrarCaso} refInput={termoBusca} />
          )}

          {carregando ? (
            <div className="flex justify-center items-center gap-2 text-sm text-gray-400">
              <span>Carregando casos de testes...</span>
              <Loader2 className="animate-spin ml-2" />
            </div>
          ) : casoFiltrado.length > 0 ? (
            !casoSelecionado && (
              <ListaCaso
                casos={casoFiltrado.filter((c) => c.name.toLowerCase())}
                onOpen={(c) => setCasoSelecionado(c)}
                onEditar={(c) => {
                  setEditandoForm(c);
                  setOpenDialogEditar(true);
                }}
                onExcluir={(id) => excluirCaso(id)}
                getNomeTeste={getNomeTeste}
                getNomeRamo={getNomeRamo}
                getNomeEdital={getNomeEdital}
              />
            )
          ) : (
            <p className="text-gray-400 text-2xl text-center animate-pulse">
              Nenhum caso de teste encontrado.
            </p>
          )}
        </>

        {/* Caso expandido */}
        {casoSelecionado && (
          <DetalheCaso
            caso={casoSelecionado}
            onVoltar={() => setCasoSelecionado(null)}
            getNomeTeste={getNomeTeste}
            getNomeRamo={getNomeRamo}
            getNomeEdital={getNomeEdital}
            getNomeTaxonomiaPorBranchId={getNomeTaxonomiaPorBranchId}
            getNomeTipificacaoPorBranchId={getNomeTipificacaoPorBranchId}
            hideCreateButton={hideCreateButton}
          />
        )}
      </div>

      {openDialogEditar && (
        <Dialog open={openDialogEditar} onOpenChange={setOpenDialogEditar}>
          <DialogTrigger></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold">
                Editar Métrica
              </DialogTitle>
              <DialogDescription>
                Atualize os dados da métrica selecionada
              </DialogDescription>
            </DialogHeader>
            {editandoForm && (
              <FormularioCaso
                mode="edit"
                tipificacoes={tipificacoes}
                testes={testes}
                editais={editais}
                carregandoTip={carregandoTip}
                initialData={editandoForm}
                onSubmit={(data) => {
                  salvarEdicao(data);
                  setOpenDialogEditar(false);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
