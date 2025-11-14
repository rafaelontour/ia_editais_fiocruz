"use client";

import BarraDePesquisa from "@/components/BarraDePesquisa";
import BotaoEditar from "@/components/BotaoEditar";
import BotaoExcluir from "@/components/BotaoExcluir";
import Calendario from "@/components/Calendario";
import FormularioTeste from "@/components/formuarios/FormularioTeste";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import Masonry from "react-masonry-css";

export default function testes() {
  const [openDialogTestes, setOpenDialogTestes] = useState(false);
  const [openDialogEditar, setOpenDialogEditar] = useState(false);
  const [editandoForm, setEditandoForm] = useState<any>(null);
  const [pesquisa, setPesquisa] = useState("");

  const breakpointColumns = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1,
  };

  const [mockTestes, setMockTestes] = useState([
    {
      id: 1,
      nome: "Teste de Exemplo 1",
      descricao: "Descrição do Teste de Exemplo 1",
    },
    {
      id: 2,
      nome: "Teste de Exemplo 2",
      descricao: "Descrição do Teste de Exemplo 2",
    },
  ]);

  const testesFiltrados = mockTestes.filter((t) =>
    t.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  function adicionarTeste(data: { nome: string; descricao: string }) {
    const novoTeste = {
      id: mockTestes.length + 1,
      nome: data.nome,
      descricao: data.descricao,
    };
    setMockTestes([...mockTestes, novoTeste]);
  }

  function excluirTeste(id: number) {
    setMockTestes(mockTestes.filter((t) => t.id !== id));
  }

  function salvarEdicao(data: { nome: string; descricao: string }) {
    setMockTestes(
      mockTestes.map((t) =>
        t.id === editandoForm.id
          ? { ...t, nome: data.nome, descricao: data.descricao }
          : t
      )
    );
  }

  return (
    <div className="flex flex-col gap-5 pd-10">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold">Coleção de Testes</h2>

        {/* Modal do Form */}
        <Dialog open={openDialogTestes} onOpenChange={setOpenDialogTestes}>
          <DialogTrigger asChild>
            <Button
              variant={"destructive"}
              style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
              className={`
                flex rounded-md gap-2 items-center px-4 py-2
                bg-vermelho  text-white
                hover:cursor-pointer
            `}
            >
              <Plus size={18} />
              <p className="text-white text-sm">Adicionar teste</p>
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold">
                Adicionar teste
              </DialogTitle>

              <DialogDescription className="text-md pb-2">
                Preencha os campos abaixo para adicionar um novo teste
              </DialogDescription>
            </DialogHeader>

            <FormularioTeste
              mode="create"
              onSubmit={(data) => {
                adicionarTeste(data);
                setOpenDialogTestes(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Barra de pesquisa */}
      <BarraDePesquisa value={pesquisa} onChange={setPesquisa} />

      {/* Modal de edição do form*/}
      <Dialog open={openDialogEditar} onOpenChange={setOpenDialogEditar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">
              Editar Teste
            </DialogTitle>
            <DialogDescription>
              Atualize os dados do teste selecionado
            </DialogDescription>
          </DialogHeader>

          {editandoForm && (
            <FormularioTeste
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
      {/* Cards de Teste*/}
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex relative gap-5 mb-10 px-1"
      >
        {testesFiltrados.map((mockTeste) => (
          <div
            style={{ boxShadow: "0 0 5px rgba(0,0,0,.3)" }}
            key={mockTeste.id}
            className="flex flex-col gap-2 rounded-md p-4 w-full transition ease-in-out duration-100 mb-5"
          >
            <h2 className="text-2xl font-semibold">{mockTeste.nome}</h2>
            <p>{mockTeste.descricao}</p>

            <div className="flex justify-between items-center mt-3">
              <Calendario />

              <div className="flex gap-3">
                <BotaoEditar
                  onClick={() => {
                    setEditandoForm(mockTeste);
                    setOpenDialogEditar(true);
                  }}
                />

                <BotaoExcluir
                  titulo="Excluir Teste"
                  descricao="Tem certeza que deseja excluir o teste"
                  onClick={() => excluirTeste(mockTeste.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </Masonry>
    </div>
  );
}
