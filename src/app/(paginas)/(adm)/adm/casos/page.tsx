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
import { Caso } from "@/core/caso";
import { useRef, useState } from "react";

export default function casos() {
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [casoSelecionado, setCasoSelecionado] = useState<Caso | null>(null);
  const [pesquisa, setPesquisa] = useState("");
  const [editandoForm, setEditandoForm] = useState<any>(null);
  const [openDialogEditar, setOpenDialogEditar] = useState(false);
  const termoBusca = useRef<string>("");
  const [casoFiltrado, setCasoFiltrado] = useState<Caso[]>([]);

  function filtrarCaso() {
    if (termoBusca.current.trim() === "") {
      setCasoFiltrado(mockCasos);
      return;
    }

    const cc = mockCasos.filter(
      (c) =>
        c.name &&
        c.name.toLowerCase().startsWith(termoBusca.current.toLowerCase())
    );

    setCasoFiltrado(cc);
  }

  const [mockCasos, setMockCasos] = useState([
    {
      id: "1",
      name: "Caso de teste de não conformidades para SIFAC",
      taxonomia:
        "TAX-Contratação de prestação de serviços de coleta e análise de efluentes",
      ramo: "Validar que o licitante enviou simultaneamente a proposta e os documentos de habilitação proposta e os documentos de habilitação.",
      teste: "Teste de Procisão - Edital X",
      conformidade: "Sim",
      feedbackEsperado:
        "O output aborda todos os pontos principais, identificando que o critério de cadastro no SICAF e compatibilidade do ramo de atividade não foi explicitamente mencionado no documento, alinhando-se ao esperado. Além disso, sugere melhorias, indo além do esperado. No entanto, há uma leve diferença de detalhamento em relação ao esperado, pois o output traz recomendações adicionais, mas não há informações faltando sobre a ausência do critério.",
      textoEntrada:
        "O output aborda todos os pontos principais, identificando que o critério de cadastro no SICAF e compatibilidade do ramo de atividade não foi explicitamente mencionado no documento, alinhando-se ao esperado. Além disso, sugere melhorias, indo além do esperado. No entanto, há uma leve diferença de detalhamento em relação ao esperado, pois o output traz recomendações adicionais, mas não há informações faltando sobre a ausência do critério.",
      created_at: "12/11/2023, 12:23:20",
    },
    {
      id: "2",
      name: "Caso de teste de não conformidades para SIFAC",
      taxonomia:
        "TAX-Contratação de prestação de serviços de coleta e análise de efluentes",
      ramo: "Validar que o licitante enviou simultaneamente a proposta e os documentos de habilitação.",
      teste: "Teste de Procisão - Edital X",
      conformidade: "conformidade",
      feedbackEsperado:
        "O output aborda todos os pontos principais, identificando que o critério de cadastro no SICAF e compatibilidade do ramo de atividade não foi explicitamente mencionado no documento, alinhando-se ao esperado. Além disso, sugere melhorias, indo além do esperado. No entanto, há uma leve diferença de detalhamento em relação ao esperado, pois o output traz recomendações adicionais, mas não há informações faltando sobre a ausência do critério.",
      textoEntrada: "texto de entrada",
      created_at: "12/11/2023, 12:23:20",
    },
  ]);

  function salvarEdicao(data: {
    name: string;
    taxonomia: string;
    ramo: string;
    teste: string;
    conformidade: string;
    feedbackEsperado: string;
    textoEntrada: string;
    created_at?: string;
  }) {
    const novosCasos = mockCasos.map((t) =>
      t.id === editandoForm.id ? { ...t, ...data } : t
    );

    setMockCasos(novosCasos);
    setCasoFiltrado(novosCasos);

    if (casoSelecionado && casoSelecionado.id === editandoForm.id) {
      const metricaAtualizada = novosCasos.find(
        (m) => m.id === editandoForm.id
      );

      if (metricaAtualizada) {
        setCasoSelecionado(metricaAtualizada);
      }
    }
  }

  function adicionarCaso(data: {
    name: string;
    taxonomia: string;
    ramo: string;
    teste: string;
    conformidade: string;
    feedbackEsperado: string;
    textoEntrada: string;
    created_at?: string;
  }) {
    let id = crypto.randomUUID();
    const novosCasos = {
      id: id,
      name: data.name,
      taxonomia: data.taxonomia,
      ramo: data.ramo,
      teste: data.teste,
      conformidade: data.conformidade,
      feedbackEsperado: data.feedbackEsperado,
      textoEntrada: data.textoEntrada,
      created_at: new Date().toLocaleString(),
    };
    setMockCasos([...mockCasos, novosCasos]);
    setCasoFiltrado([...mockCasos, novosCasos]);
  }

  function excluirCaso(id: string) {
    setMockCasos(mockCasos.filter((t) => t.id !== id));
    setCasoFiltrado(mockCasos.filter((t) => t.id !== id));
  }
  return (
    <>
      <div className="flex flex-col gap-5 ">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-bold">Gestão de casos de testes</h2>
          {/* Modal do Form */}
          <Dialog open={openDialogAdd} onOpenChange={setOpenDialogAdd}>
            <DialogTrigger asChild>
              <BotaoAdicionar texto="Adicionar caso" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold">
                  Adicionar caso de teste
                </DialogTitle>
                <DialogDescription>
                  Preencha os campos abaixo para adicionar um novo caso de teste
                </DialogDescription>
              </DialogHeader>

              <FormularioCaso
                mode="create"
                onSubmit={(data) => {
                  adicionarCaso(data);
                  setOpenDialogAdd(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {!casoSelecionado && (
          <>
            {/* Barra de pesquisa */}
            <BarraDePesquisa funcFiltrar={filtrarCaso} refInput={termoBusca} />

            {/* Cards dos Casos */}
            <ListaCaso
              casos={mockCasos.filter((c) => c.name.toLowerCase())}
              onOpen={(c) => setCasoSelecionado(c)}
              onEditar={(c) => {
                setEditandoForm(c);
                setOpenDialogEditar(true);
              }}
              onExcluir={(id) => excluirCaso(id)}
            />
          </>
        )}

        {/* Caso expandido */}
        {casoSelecionado && (
          <DetalheCaso
            caso={casoSelecionado}
            onVoltar={() => setCasoSelecionado(null)}
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
