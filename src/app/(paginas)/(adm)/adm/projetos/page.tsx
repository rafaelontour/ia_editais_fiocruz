"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import BarraDePesquisa from "@/components/BarraDePesquisa";
import Botao from "@/components/BotaoAdicionar";
import BotaoCancelar from "@/components/botoes/BotaoCancelar";
import BotaoSalvar from "@/components/botoes/BotaoSalvar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, PencilLine, View } from "lucide-react";
import Masonry from "react-masonry-css";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Div from "@/components/Div";
import Calendario from "@/components/Calendario";
import BotaoExcluir from "@/components/BotaoExcluir";
import { useRouter } from "next/navigation";
import { Projeto } from "@/core/projeto/Projeto";
import { DocumentGroup } from "@/core/configurador/GrupoDocumento";
import {
  adicionarProjetoService,
  atualizarProjetoService,
  excluirProjetoService,
  getProjetosService,
} from "@/service/projeto";
import { getDocumentosPorProjetoService } from "@/service/documento";
import { getDocumentGroupsService } from "@/service/configurador";

const schema = z.object({
  nome: z.string().min(1, "O nome do projeto é obrigatório"),
  descricao: z.string().optional(),
  document_group_id: z.string().optional(),
});

export default function ProjetosPage() {
  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nome: "", descricao: "", document_group_id: "" },
  });

  const breakpointColumnsObj = { default: 3, 1500: 3, 1000: 2, 700: 1 };

  const [openDialogProjetos, setOpenDialogProjetos] = useState(false);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [projetosFiltradas, setProjetosFiltradas] = useState<Projeto[]>([]);
  const [documentGroups, setDocumentGroups] = useState<DocumentGroup[]>([]);
  const [openDialogIdEditar, setOpenDialogIdEditar] = useState<string | null>(
    null,
  );
  const [carregando, setCarregando] = useState<boolean>(true);
  const termoBusca = useRef<string>("");
  const router = useRouter();

  const [stats, setStats] = useState<
    Record<string, { total: number; sent: number; completed: number }>
  >({});

  const carregarDocumentGroups = async () => {
    const grupos = await getDocumentGroupsService();
    setDocumentGroups(grupos ?? []);
  };

  const fetchData = useCallback(async () => {
    setCarregando(true);
    const ps = await getProjetosService();
    setProjetos(ps);
    setProjetosFiltradas(ps);

    // buscar contagens de documentos por projeto
    const map: Record<
      string,
      { total: number; sent: number; completed: number }
    > = {};
    await Promise.all(
      ps.map(async (p) => {
        const docs = await getDocumentosPorProjetoService(p.id);
        const total = docs.length;
        const sent = docs.filter((d) => d.sent_to_kanban).length;
        const completed = docs.filter((d) => {
          const status = d.status?.toLowerCase();
          return status === "completed" || status === "finalizado";
        }).length;
        map[p.id] = { total, sent, completed };
      }),
    );

    setStats(map);
    setCarregando(false);
  }, []);

  useEffect(() => {
    fetchData();
    carregarDocumentGroups();
  }, [fetchData]);

  useEffect(() => {
    if (openDialogIdEditar) {
      const p = projetos.find((x) => x.id === openDialogIdEditar);
      if (p) {
        setValue("nome", p.name);
        setValue("descricao", p.description ?? "");
        setValue("document_group_id", p.document_group_id ?? "");
      }
    }
  }, [openDialogIdEditar, projetos, setValue]);

  const adicionarProjeto = async (data: FormData) => {
    if (carregando) return;
    setCarregando(true);
    try {
      const grupo = documentGroups.find((g) => g.id === data.document_group_id);
      const [status, , detail] = await adicionarProjetoService(
        data.nome,
        data.descricao,
        data.document_group_id,
        grupo?.name,
      );
      if (status !== 201) {
        toast.error(detail || "Erro ao adicionar processo");
        return;
      }
      toast.success("Projeto adicionado");
      setOpenDialogProjetos(false);
      reset();
      fetchData();
    } finally {
      setCarregando(false);
    }
  };

  const atualizarProjeto = async (data: FormData) => {
    if (carregando || !openDialogIdEditar) return;
    setCarregando(true);
    try {
      const [status, detail] = await atualizarProjetoService(
        openDialogIdEditar,
        data.nome,
        data.document_group_id,
      );
      if (status !== 200) {
        toast.error(detail || "Erro ao atualizar projeto");
        return;
      }
      toast.success("Projeto atualizado");
      setOpenDialogIdEditar(null);
      setOpenDialogProjetos(false);
      reset();
      fetchData();
    } finally {
      setCarregando(false);
    }
  };

  const excluirProjeto = async (item: Projeto) => {
    if (carregando) return;
    setCarregando(true);
    try {
      const status = await excluirProjetoService(item.id);
      if (status !== 204) {
        toast.error("Erro ao excluir projeto");
        return;
      }
      toast.success("Projeto excluído");
      fetchData();
    } finally {
      setCarregando(false);
    }
  };

  function filtrarProjetos() {
    if (termoBusca.current.trim() === "") {
      setProjetosFiltradas(projetos);
      return;
    }
    const ff = projetos.filter(
      (p) =>
        p.name &&
        p.name.toLowerCase().includes(termoBusca.current.toLowerCase()),
    );
    setProjetosFiltradas(ff);
  }

  function percent(p: Projeto) {
    const s = stats[p.id];
    if (!s || s.total === 0) return 0;
    if (s.sent < s.total) {
      return Math.round((s.sent / s.total) * 50);
    }
    return 50 + Math.round((s.completed / s.total) * 50);
  }

  const getProjectStatus = (projectId: string) => {
    const s = stats[projectId];
    if (!s || s.total === 0 || s.sent < s.total) {
      return "Iniciado";
    }
    if (s.completed < s.total) {
      return "Em andamento";
    }
    return "Concluído";
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-5 sticky top-0 z-1 justify-between w-full items-center">
        <div className="flex w-full justify-between relative">
          <div className="w-full flex justify-between items-center">
            <h2 className="text-4xl font-bold">Agrupador de Documentos</h2>

            <Dialog
              open={openDialogProjetos}
              onOpenChange={setOpenDialogProjetos}
            >
              <DialogTrigger asChild>
                <Botao texto="Adicionar processo" />
              </DialogTrigger>
              <DialogContent onCloseAutoFocus={() => reset()}>
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold">
                    Adicionar processo à base de dados
                  </DialogTitle>
                  <DialogDescription className="text-md pb-2">
                    Preencha os campos abaixo para adicionar um novo projeto
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-sm block mb-1">Nome</label>
                    <input
                      {...register("nome")}
                      className="w-full border rounded px-2 py-1"
                    />
                    {errors.nome && (
                      <p className="text-xs text-red-500">
                        {String(errors.nome.message)}
                      </p>
                    )}
                  </div>
                  {/* <div>
                    <label className="text-sm block mb-1">Descrição</label>
                    <textarea
                      {...register("descricao")}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div> */}
                  <div>
                    <label className="text-sm block mb-1">
                      Grupo de documentos
                    </label>
                    <select
                      {...register("document_group_id")}
                      className="w-full border rounded px-2 py-1"
                    >
                      {documentGroups.map((grupo) => (
                        <option key={grupo.id} value={grupo.id}>
                          {grupo.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose>
                    <BotaoCancelar />
                  </DialogClose>
                  <BotaoSalvar onClick={handleSubmit(adicionarProjeto)} disabled={carregando} />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {projetos.length !== 0 && (
          <BarraDePesquisa
            className="w-full"
            refInput={termoBusca}
            funcFiltrar={filtrarProjetos}
          />
        )}
      </div>

      {carregando ? (
        <div className="flex justify-center items-center gap-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <p className="animate-pulse">Carregando projetos...</p>
          <Loader2 className="animate-spin ml-2" />
        </div>
      ) : projetosFiltradas.length > 0 ? (
        <div className="h-[calc(100vh-248px)] overflow-y-auto px-3 py-1">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className={"flex gap-5"}
          >
            {projetosFiltradas.map((projeto) => (
              <Div key={projeto.id}>
                <div data-cy="item-projeto" className="flex flex-col gap-2">
                  <h2 className="text-2xl font-semibold wrap-break-word">
                    {projeto.name}
                  </h2>
                  <p className={`py-1 w-fit wrrap-break-words text-md`}>
                    {getProjectStatus(projeto.id)}
                  </p>

                  <div className="w-full mt-2">
                    <div className="w-full bg-gray-200 h-2.5 rounded">
                      <div
                        className="bg-verde h-2.5 rounded"
                        style={{ width: `${percent(projeto)}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1 text-sm">
                      <span>
                        {stats[projeto.id]?.completed ?? 0} de{" "}
                        {stats[projeto.id]?.total ?? 0} documentos
                      </span>
                      <span className="font-medium">{percent(projeto)}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <Calendario data={projeto.created_at} />
                  <div className="flex gap-3">
                    <Button
                      title="Ver projeto"
                      onClick={() => router.push(`/adm/projetos/${projeto.id}`)}
                      className="h-8 w-8 hover:cursor-pointer border border-gray-300 rounded-sm bg-branco hover:bg-branco"
                    >
                      <View color="black" />
                    </Button>
                    <Dialog
                      open={openDialogIdEditar === projeto.id}
                      onOpenChange={(open) =>
                        setOpenDialogIdEditar(open ? projeto.id : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button
                          title="Editar projeto"
                          className={`h-8 w-8 hover:cursor-pointer border border-gray-300 rounded-sm bg-branco hover:bg-branco`}
                          size={"icon"}
                        >
                          <PencilLine color="black" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent onCloseAutoFocus={() => reset()}>
                        <DialogHeader>
                          <DialogTitle className="text-3xl font-bold">
                            Atualizar projeto
                          </DialogTitle>
                          <DialogDescription className="text-md pb-4">
                            Atualize os dados do projeto selecionado
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-3">
                          <div>
                            <label className="text-sm block mb-1">Nome</label>
                            <input
                              {...register("nome")}
                              className="w-full border rounded px-2 py-1"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose>
                            <BotaoCancelar />
                          </DialogClose>
                          <BotaoSalvar
                            onClick={handleSubmit(atualizarProjeto)}
                            disabled={carregando}
                          />
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <BotaoExcluir
                      tipo="projeto"
                      item={projeto}
                      disabled={carregando}
                      funcExcluir={() => excluirProjeto(projeto)}
                    />
                  </div>
                </div>
              </Div>
            ))}
          </Masonry>
        </div>
      ) : (
        <p className="text-gray-400 text-2xl text-center animate-pulse">
          Nenhum projeto encontrado.
        </p>
      )}
    </div>
  );
}
