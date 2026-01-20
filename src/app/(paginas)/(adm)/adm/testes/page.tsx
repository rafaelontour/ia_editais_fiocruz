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
import { Teste } from "@/core/teste";
import {
  adicionarTesteService,
  atualizarTesteService,
  excluirTesteService,
  getTestesService,
} from "@/service/teste";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import { toast } from "sonner";

export default function testes() {
  const [openDialogTestes, setOpenDialogTestes] = useState(false);
  const [openDialogEditar, setOpenDialogEditar] = useState(false);
  const [editandoForm, setEditandoForm] = useState<any>(null);
  const termoBusca = useRef<string>("");
  const [testeFiltrado, setTesteFiltrado] = useState<Teste[]>([]);
  const [testes, setTestes] = useState<Teste[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    async function carregar() {
      const resultado = await getTestesService();
      if (resultado) {
        setCarregando(false);
        setTestes(resultado);
        setTesteFiltrado(resultado);
      }
    }
    carregar();
  }, []);

  const breakpointColumns = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1,
  };

  function filtrarTeste() {
    if (termoBusca.current.trim() === "") {
      setTesteFiltrado(testes);
      return;
    }

    const filtrados = testes.filter(
      (t) =>
        t.name &&
        t.name.toLowerCase().startsWith(termoBusca.current.toLowerCase()),
    );

    setTesteFiltrado(filtrados);
  }

  async function excluirTeste(id: string) {
    const sucesso = await excluirTesteService(id);
    if (!sucesso) {
      toast.error("Erro ao excluir teste");
      return;
    }

    toast.success("Teste excluído com sucesso");

    const filtrados = testes.filter((t) => t.id !== id);

    setTestes(filtrados);
    setTesteFiltrado(filtrados);
  }

  async function salvarEdicao(data: { name: string; description: string }) {
    const sucesso = await atualizarTesteService(editandoForm.id, data);
    if (!sucesso) {
      toast.error("Erro ao atualizar teste");
      return;
    }
    toast.success("Teste atualizado com sucesso");
    setTestes(
      testeFiltrado.map((t) =>
        t.id === editandoForm.id
          ? { ...t, name: data.name, description: data.description }
          : t,
      ),
    );
    setTesteFiltrado(
      testeFiltrado.map((t) =>
        t.id === editandoForm.id
          ? { ...t, name: data.name, description: data.description }
          : t,
      ),
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
              onSubmit={async (data) => {
                try {
                  const novoTeste = await adicionarTesteService({
                    name: data.name,
                    description: data.description,
                  });

                  if (!novoTeste) {
                    toast.error("Erro ao criar teste");
                    return;
                  }
                  setTestes((prev) => [novoTeste, ...prev]);
                  setTesteFiltrado((prev) => [novoTeste, ...prev]);

                  toast.success("Teste criado com sucesso");
                  setOpenDialogTestes(false);
                } catch (error: any) {
                  if (error?.status === 409) {
                    toast.error("Já existe uma coleção de teste com esse nome");
                    return;
                  }
                  console.error(error);
                  toast.error("Erro inesperado ao criar teste");
                }
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Barra de pesquisa */}
      <BarraDePesquisa funcFiltrar={filtrarTeste} refInput={termoBusca} />

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

      {carregando ? (
        <div className="flex justify-center items-center gap-2 text-sm text-gray-400">
          <span>Carregando coleção de testes...</span>
          <Loader2 className="animate-spin ml-2" />
        </div>
      ) : testeFiltrado.length > 0 ? (
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex relative gap-5 mb-10 px-1"
        >
          {testeFiltrado.map((mockTeste) => (
            <div
              style={{ boxShadow: "0 0 5px rgba(0,0,0,.3)" }}
              key={mockTeste.id}
              className="flex flex-col gap-2 rounded-md p-4 w-full transition ease-in-out duration-100 mb-5"
            >
              <h2 className="text-2xl font-semibold">{mockTeste.name}</h2>
              <p>{mockTeste.description}</p>

              <div className="flex justify-between items-center mt-3">
                <Calendario data={mockTeste.created_at} />

                <div className="flex gap-3">
                  <BotaoEditar
                    onClick={() => {
                      setEditandoForm(mockTeste);
                      setOpenDialogEditar(true);
                    }}
                  />

                  <BotaoExcluir
                    funcExcluir={excluirTeste}
                    item={mockTeste}
                    tipo="teste"
                  />
                </div>
              </div>
            </div>
          ))}
        </Masonry>
      ) : (
        <p className="text-gray-400 text-2xl text-center animate-pulse">
          Nenhuma coleção de teste encontrada.
        </p>
      )}
    </div>
  );
}
