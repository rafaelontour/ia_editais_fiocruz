"use client";
import BarraDePesquisa from "@/components/BarraDePesquisa";
import BotaoAdicionar from "@/components/BotaoAdicionar";
import FormularioMetrica from "@/components/formuarios/FormularioMetrica";
import DetalheMetrica from "@/components/metricas/DetalheMetrica";
import ListaMetricas from "@/components/metricas/ListaMetricas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Metrica } from "@/core/metrica";
import {
  adicionarMetricaService,
  atualizarMetricaService,
  excluirMetricaService,
  getMetricasService,
} from "@/service/metrica";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function metricas() {
  const [openDialogEditar, setOpenDialogEditar] = useState(false);
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [editandoForm, setEditandoForm] = useState<any>(null);
  const [pesquisa, setPesquisa] = useState("");
  const [metricaSelecionada, setMetricaSelecionada] = useState<Metrica | null>(
    null,
  );
  const termoBusca = useRef<string>("");

  useEffect(() => {
    async function carregar() {
      const resultado = await getMetricasService();
      if (resultado) {
        setMetricas(resultado);
        setMetricaFiltrada(resultado);
      }
    }
    carregar();
  }, []);

  const [metricaFiltrada, setMetricaFiltrada] = useState<Metrica[]>([]);
  const [metricas, setMetricas] = useState<Metrica[]>([]);

  function filtrarMetricas() {
    if (termoBusca.current.trim() === "") {
      setMetricaFiltrada(metricas);
      return;
    }

    const mm = metricas.filter(
      (m) =>
        m.name &&
        m.name.toLowerCase().startsWith(termoBusca.current.toLowerCase()),
    );

    setMetricaFiltrada(mm);
  }

  async function salvarEdicao(data: {
    name: string;
    threshold: number;
    criteria: string;
    evaluation_steps: string;
  }) {
    const sucesso = await atualizarMetricaService(editandoForm.id, data);
    if (!sucesso) {
      toast.error("Erro ao atualizar métrica");
      return;
    }

    toast.success("Métrica atualizada com sucesso");

    const novasMetricas = metricas.map((t) =>
      t.id === editandoForm.id ? { ...t, ...data } : t,
    );

    setMetricas(novasMetricas);
    setMetricaFiltrada(novasMetricas);

    // se tiver expandido, atualizar a métrica selecionada também ou seja o endpoind vai ser pelo id da métrica
    if (metricaSelecionada && metricaSelecionada.id === editandoForm.id) {
      const metricaAtualizada = novasMetricas.find(
        (m) => m.id === editandoForm.id,
      );

      if (metricaAtualizada) {
        setMetricaSelecionada(metricaAtualizada);
      }
    }
  }

  async function excluirMetrica(id: string) {
    const sucesso = await excluirMetricaService(id);
    if (!sucesso) {
      toast.error("Erro ao excluir métrica");
      return;
    }

    toast.success("Métrica excluída com sucesso");

    const filtradas = metricas.filter((t) => t.id !== id);

    setMetricas(filtradas);
    setMetricaFiltrada(filtradas);
  }

  return (
    <>
      <div className="flex flex-col gap-5 ">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-bold">Gestão de métricas</h2>
          {/* Modal do Form */}
          <Dialog open={openDialogAdd} onOpenChange={setOpenDialogAdd}>
            <DialogTrigger asChild>
              <BotaoAdicionar texto="Adicionar métrica" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold">
                  Adicionar métrica
                </DialogTitle>
                <DialogDescription>
                  Preencha os campos abaixo para adicionar uma nova métrica
                </DialogDescription>
              </DialogHeader>

              <FormularioMetrica
                mode="create"
                onSubmit={async (data) => {
                  try {
                    const novaMetrica = await adicionarMetricaService({
                      name: data.name,
                      threshold: data.threshold,
                      criteria: data.criteria,
                      evaluation_steps: data.evaluation_steps,
                    });

                    if (!novaMetrica) {
                      toast.error("Erro ao criar métrica");
                      return;
                    }
                    setMetricas((prev) => [novaMetrica, ...prev]);
                    setMetricaFiltrada((prev) => [novaMetrica, ...prev]);

                    toast.success("Métrica criada com sucesso");
                    setOpenDialogAdd(false);
                  } catch (error) {
                    toast.error("Erro inesperado ao criar métrica");
                  }
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {!metricaSelecionada && (
          <>
            {/* Barra de pesquisa */}
            <BarraDePesquisa
              refInput={termoBusca}
              funcFiltrar={filtrarMetricas}
            />

            {/* Cards de Métrica */}

            <ListaMetricas
              metricas={metricaFiltrada.filter((m) =>
                m.name.toLowerCase().includes(pesquisa.toLowerCase()),
              )}
              onOpen={(m) => setMetricaSelecionada(m)} // maxima
              onEditar={(m) => {
                setEditandoForm(m);
                setOpenDialogEditar(true);
              }}
              onExcluir={(id) => excluirMetrica(id)}
            />
          </>
        )}

        {/* Métrica expandida */}
        {metricaSelecionada && (
          <DetalheMetrica
            metrica={metricaSelecionada}
            onVoltar={() => setMetricaSelecionada(null)}
            onEditar={() => {
              setEditandoForm(metricaSelecionada);
              setOpenDialogEditar(true);
            }}
            onExcluir={() => {
              excluirMetrica(metricaSelecionada.id);
              setMetricaSelecionada(null);
            }}
          />
        )}
      </div>

      {/* Modal de edição do form*/}
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
              <FormularioMetrica
                mode="edit"
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
