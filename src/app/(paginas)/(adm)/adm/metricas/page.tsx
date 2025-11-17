"use client";
import BarraDePesquisa from "@/components/BarraDePesquisa";
import BotaoAdicionar from "@/components/BotaoAdicionar";
import BotaoEditar from "@/components/BotaoEditar";
import BotaoExcluir from "@/components/BotaoExcluir";
import Calendario from "@/components/Calendario";
import FormularioMetrica from "@/components/formuarios/FormularioMetrica";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Maximize, Maximize2 } from "lucide-react";
import { useState } from "react";
import Masonry from "react-masonry-css";

export default function metricas() {
  const [openDialogEditar, setOpenDialogEditar] = useState(false);
  const [openDialogAdd, setOpenDialogAdd] = useState(false);

  const breakpointColumns = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1,
  };

  const [mockMetricas, setMockMetricas] = useState([
    {
      id: 1,
      nome: "Precisão de Feedback",
      modelo: "GPT-5",
      notaCorte: 5,
      criterio: "critério da métrica",
      passosAvalicao: "passo a passo para a avaliação da métrica",
      created_at: "17/11/2025, 15:56:39",
    },
    {
      id: 2,
      nome: "Precisão de Feedback",
      modelo: "GPT-5",
      notaCorte: 5,
      criterio: "critério da métrica",
      passosAvalicao: "passo a passo para a avaliação da métrica",
      created_at: "17/11/2025, 15:56:39",
    },
    {
      id: 3,
      nome: "Precisão de Feedback",
      modelo: "GPT-5",
      notaCorte: 5,
      criterio: "critério da métrica",
      passosAvalicao: "passo a passo para a avaliação da métrica",
      created_at: "17/11/2025, 15:56:39",
    },
  ]);

  function excluirMetrica() {}

  function adicionarMetrica(data: {
    nome: string;
    modelo: string;
    notaCorte: number;
    criterio: string;
    passosAvalicao: string;
  }) {
    const novaMetrica = {
      id: mockMetricas.length + 1,
      nome: data.nome,
      modelo: data.modelo,
      notaCorte: data.notaCorte,
      criterio: data.criterio,
      passosAvalicao: data.passosAvalicao,
      created_at: new Date().toLocaleString(),
    };
    setMockMetricas([...mockMetricas, novaMetrica]);
  }

  return (
    <div className="flex flex-col gap-5 pd-10">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold">Gestão de métricas</h2>
        {/* Modal do Form */}
        <Dialog>
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

      {/* Barra de pesquisa */}
      <BarraDePesquisa />

      {/* Modal de edição do form*/}
      <Dialog>
        <DialogTrigger></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Cards de Teste*/}
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex relative gap-5 mb-10 px-1"
      >
        {mockMetricas.map((metrica) => (
          <div
            className="relative flex flex-col gap-2 rounded-md p-4 w-full transition ease-in-out duration-100 mb-5"
            key={metrica.id}
            style={{ boxShadow: "0 0 5px rgba(0,0,0,.3)" }}
          >
            <Maximize2
              className="absolute top-2 right-2 cursor-pointer"
              size={19}
            />

            <h2 className="text-2xl font-semibold">{metrica.nome}</h2>
            <div className="flex flex-row gap-3">
              <p className="bg-zinc-400 text-white rounded-md border-1 border-gray-300 w-fit py-1 px-2 ">
                Modelo ia: {metrica.modelo}
              </p>

              <p className="w-fit py-1 px-2 ">
                <span className="font-semibold">Nota de corte: </span>
                {metrica.notaCorte}
              </p>
            </div>

            <div className="flex justify-between items-center mt-3">
              <Calendario data={metrica.created_at} />

              <div className="flex gap-3">
                <BotaoEditar onClick={() => setOpenDialogEditar(true)} />
                <BotaoExcluir
                  titulo="Excluir Métrica"
                  descricao="Tem certeza que deseja escluir a métrica"
                  onClick={() => excluirMetrica()}
                />
              </div>
            </div>
          </div>
        ))}
      </Masonry>
    </div>
  );
}
