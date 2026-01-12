"use client";
import BarraDePesquisa from "@/components/BarraDePesquisa";
import BotaoEditar from "@/components/BotaoEditar";
import BotaoExcluir from "@/components/BotaoExcluir";
import Calendario from "@/components/Calendario";
import FormularioModelo from "@/components/formuarios/FormularioModelo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Modelo } from "@/core/modelo";
import {
  adicionarModeloService,
  atualizarModeloService,
  excluirModeloService,
  getModeloService,
} from "@/service/modelo";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import { toast } from "sonner";

export default function Modelos() {
  const [openDialogModelo, setOpenDialogModelo] = useState(false);
  const [modeloFiltrado, setModeloFiltrado] = useState<Modelo[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);

  const [editandoForm, setEditandoForm] = useState<any>(null);
  const [openDialogEditar, setOpenDialogEditar] = useState(false);

  const termoBusca = useRef<string>("");

  useEffect(() => {
    async function carregar() {
      const resultado = await getModeloService();

      if (resultado) {
        setModelos(resultado);
        setModeloFiltrado(resultado);
      }
    }
    carregar();
  }, []);

  const breakpointCols = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1,
  };

  function filtrarModelo() {
    if (termoBusca.current.trim() === "") {
      setModeloFiltrado(modelos);
      return;
    }

    const filtrados = modelos.filter(
      (m) =>
        m.name &&
        m.name.toLowerCase().startsWith(termoBusca.current.toLowerCase())
    );

    setModeloFiltrado(filtrados);
  }

  async function excluirModelo(id: string) {
    const sucesso = await excluirModeloService(id);
    if (!sucesso) {
      toast.error("Erro ao excluir modelo de ia");
      return;
    }

    toast.success("Modelo excluído com sucesso");

    const filtrados = modelos.filter((m) => m.id !== id);

    setModelos(filtrados);
    setModeloFiltrado(filtrados);
  }

  async function salvarEdicao(data: { name: string; code_name: string }) {
    const sucesso = await atualizarModeloService(editandoForm.id, data);
    if (!sucesso) {
      toast.error("Erro ao atualizar modelo de ia");
      return;
    }
    toast.success("Modelo de ia atualizado com sucesso");
    setModelos(
      modeloFiltrado.map((m) =>
        m.id === editandoForm.id
          ? { ...m, name: data.name, code_name: data.code_name }
          : m
      )
    );
    setModeloFiltrado(
      modeloFiltrado.map((m) =>
        m.id === editandoForm.id
          ? { ...m, name: data.name, code_name: data.code_name }
          : m
      )
    );
  }

  return (
    <div className="flex flex-col gap-5 pd-10">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold">Modelos de IA</h2>

        <Dialog open={openDialogModelo} onOpenChange={setOpenDialogModelo}>
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
              <p className="text-white text-sm">Adicionar Modelo de IA</p>
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold">
                Adicionar modelo de IA
              </DialogTitle>

              <DialogDescription className="text-md pb-2">
                Preencha os campos abaixo para adicionar um novo modelo de IA
              </DialogDescription>
            </DialogHeader>

            <FormularioModelo
              mode="create"
              onSubmit={async (data) => {
                try {
                  const novoModelo = await adicionarModeloService({
                    name: data.name,
                    code_name: data.code_name,
                  });

                  if (!novoModelo) {
                    toast.error("Erro ao criar modelo");
                    return;
                  }

                  setModelos((prev) => [...prev, novoModelo]);
                  setModeloFiltrado((prev) => [...prev, novoModelo]);

                  toast.success("Modelo criado com sucesso");
                  setOpenDialogModelo(false);
                } catch (error) {
                  console.error("Erro ao criar modelo de IA:", error);
                  toast.error("Erro ao criar modelo de IA");
                }
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <BarraDePesquisa funcFiltrar={filtrarModelo} refInput={termoBusca} />

      <Dialog open={openDialogEditar} onOpenChange={setOpenDialogEditar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">
              Editar Modelo
            </DialogTitle>
            <DialogDescription>
              Atualize os dados do Modelo selecionado
            </DialogDescription>
          </DialogHeader>

          {editandoForm && (
            <FormularioModelo
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

      <Masonry
        breakpointCols={breakpointCols}
        className="flex relative gap-5 mb-10 px-1
      "
      >
        {modeloFiltrado.map((modelo) => (
          <div
            style={{ boxShadow: "0 0 5px rgba(0,0,0,.3)" }}
            key={modelo.id}
            className="flex flex-col gap-2 rounded-md p-4 w-full transition ease-in-out duration-100 mb-5"
          >
            <h2 className="text-2xl font-semibold">{modelo.name}</h2>
            <p>
              <span className="font-bold">codinome:</span> {modelo.code_name}
            </p>

            <div className="flex justify-between items-center mt-3">
              <Calendario data={modelo.created_at} />

              <div className="flex gap-3">
                <BotaoEditar
                  onClick={() => {
                    setEditandoForm(modelo);
                    setOpenDialogEditar(true);
                  }}
                />

                <BotaoExcluir
                  funcExcluir={excluirModelo}
                  item={modelo}
                  tipo="modelo"
                />
              </div>
            </div>
          </div>
        ))}
      </Masonry>
    </div>
  );
}
