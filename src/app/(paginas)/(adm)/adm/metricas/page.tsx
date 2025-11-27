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
import { useState } from "react";

export default function metricas() {
  const [openDialogEditar, setOpenDialogEditar] = useState(false);
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [editandoForm, setEditandoForm] = useState<any>(null);
  const [pesquisa, setPesquisa] = useState("");
  const [metricaSelecionada, setMetricaSelecionada] = useState<Metrica | null>(
    null
  );

  const [mockMetricas, setMockMetricas] = useState([
    {
      id: 1,
      nome: "Precisão de Feedback",
      modelo: "GPT-5",
      notaCorte: 5,
      criterio:
        "A métrica deve avaliar se o feedback retornado pela IA identifica corretamente a presença ou ausência do critério jurídico analisado, sem adicionar informações inexistentes no edital. A resposta deve ser objetiva, coerente, e manter alinhamento semântico com o critério esperado.",
      passosAvaliacao:
        "Comparar o expected_feedback com o actual_feedback retornado pelo modelo. Verificar se o modelo identificou corretamente se o critério está presente no documento (expected_fulfilled). Calcular similaridade semântica entre expected e actual. Gerar score final entre 0 e 1 baseado nessa similaridade. Considerar o teste aprovado caso score >= threshold.",
      created_at: "2025-11-17T15:56:39",
    },
    {
      id: 2,
      nome: "Precisão de Feedback",
      modelo: "GPT-5",
      notaCorte: 5,
      criterio:
        "A métrica deve avaliar se o feedback retornado pela IA identifica corretamente a presença ou ausência do critério jurídico analisado, sem adicionar informações inexistentes no edital. A resposta deve ser objetiva, coerente, e manter alinhamento semântico com o critério esperado.",
      passosAvaliacao:
        "Comparar o expected_feedback com o actual_feedback retornado pelo modelo. Verificar se o modelo identificou corretamente se o critério está presente no documento (expected_fulfilled). Calcular similaridade semântica entre expected e actual. Gerar score final entre 0 e 1 baseado nessa similaridade. Considerar o teste aprovado caso score >= threshold.",
      created_at: "12/11/2023, 12:23:20",
    },
    {
      id: 3,
      nome: "Precisão de Feedback",
      modelo: "GPT-5",
      notaCorte: 5,
      criterio:
        "A métrica deve avaliar se o feedback retornado pela IA identifica corretamente a presença ou ausência do critério jurídico analisado, sem adicionar informações inexistentes no edital. A resposta deve ser objetiva, coerente, e manter alinhamento semântico com o critério esperado.",
      passosAvaliacao:
        "Comparar o expected_feedback com o actual_feedback retornado pelo modelo. Verificar se o modelo identificou corretamente se o critério está presente no documento (expected_fulfilled). Calcular similaridade semântica entre expected e actual. Gerar score final entre 0 e 1 baseado nessa similaridade. Considerar o teste aprovado caso score >= threshold.",
      created_at: "12/11/2023, 12:23:20",
    },
  ]);

  function salvarEdicao(data: {
    nome: string;
    modelo: string;
    notaCorte: number;
    criterio: string;
    passosAvaliacao: string;
  }) {
    const novasMetricas = mockMetricas.map((t) =>
      t.id === editandoForm.id ? { ...t, ...data } : t
    );

    setMockMetricas(novasMetricas);

    // se tiver expandido, atualizar a métrica selecionada também ou seja o endpoind vai ser pelo id da métrica
    if (metricaSelecionada && metricaSelecionada.id === editandoForm.id) {
      const metricaAtualizada = novasMetricas.find(
        (m) => m.id === editandoForm.id
      );

      if (metricaAtualizada) {
        setMetricaSelecionada(metricaAtualizada);
      }
    }
  }

  function excluirMetrica(id: number) {
    setMockMetricas(mockMetricas.filter((t) => t.id !== id));
  }

  function adicionarMetrica(data: {
    nome: string;
    modelo: string;
    notaCorte: number;
    criterio: string;
    passosAvaliacao: string;
  }) {
    const novaMetrica = {
      id: mockMetricas.length + 1,
      nome: data.nome,
      modelo: data.modelo,
      notaCorte: data.notaCorte,
      criterio: data.criterio,
      passosAvaliacao: data.passosAvaliacao,
      created_at: new Date().toLocaleString(),
    };
    setMockMetricas([...mockMetricas, novaMetrica]);
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
                onSubmit={(data) => {
                  adicionarMetrica(data);
                  setOpenDialogAdd(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {!metricaSelecionada && (
          <>
            {/* Barra de pesquisa */}
            <BarraDePesquisa value={pesquisa} onChange={setPesquisa} />

            {/* Cards de Métrica */}

            <ListaMetricas
              metricas={mockMetricas.filter((m) =>
                m.nome.toLowerCase().includes(pesquisa.toLowerCase())
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
