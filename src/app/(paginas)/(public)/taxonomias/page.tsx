"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Fonte, Tipificacao } from "@/core";
import { Ramo } from "@/core/ramo";
import { Taxonomia } from "@/core/taxonomia";
import { getFontesService } from "@/service/fonte";
import { adicionarRamoService, excluirRamo } from "@/service/ramo";
import { adicionarTaxonomia, excluirTaxonomia, getTaxonomiasService } from "@/service/taxonomia";
import { getTipificacoesService } from "@/service/tipificacao";
import { Calendar, ChevronLeft, PencilLine, Plus, Trash } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";


export default function Taxonomias() {
  const [idSelecionado, setIdSelecionado] = useState<string | undefined>("");
  const [taxonomiaSelecionada, setTaxonomiaSelecionada] = useState<Taxonomia | null | undefined>(null);
  const [tituloTaxonomia, setTituloTaxonomia] = useState<string>("");
  const [descricaoTaxonomia, setDescricaoTaxonomia] = useState<string>("");
  const [descricaoRamo, setDescricaoRamo] = useState<string>("");
  const [tituloRamo, setTituloRamo] = useState<string>("");
  let [tax, setTax] = useState<Taxonomia[]>([]);

  const [fontesSelecionadas, setFontesSelecionadas] = useState<Fonte[]>([]);
  const [fontes, setFontes] = useState<Fonte[]>([]);
  const [tipificacoes, setTipificacoes] = useState<Tipificacao[]>([]);
  const [idTipificacao, setIdTipificacao] = useState<string>("");

  const [openTaxonomia, setOpenTaxonomia] = useState<boolean>(false);
  const [openDialogRamo, setOpenDialogRamo] = useState<boolean>(false);

  const divRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const botaoRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taxs = await getTaxonomiasService()
        setTax(taxs || []);

        const fnts = await getFontesService()
        setFontes(fnts || []);

        const tips = await getTipificacoesService()
        setTipificacoes(tips || []);

      } catch (error) {
        console.error("Erro ao buscar taxonomias:", error); // Chamar um toast no lugar
      }
    }

    fetchData();
  }, []);

  // Função para verificar clique fora de uma taxonomia para atualizar os ramos e melhorar usabilidade
  useEffect(() => {
  const handleClick = (e: MouseEvent) => {
    const target = e.target as Node;

    const clicouDentroDeAlguma = Object.values(divRefs.current).some((ref) =>
      ref?.contains(target)
    );

    if (!clicouDentroDeAlguma && !openDialogRamo) {
      setTaxonomiaSelecionada(null);
      setIdSelecionado("");
    }
  };

  document.addEventListener("mousedown", handleClick);
  return () => document.removeEventListener("mousedown", handleClick);
}, [openDialogRamo]);


  const handleAddRamo = async (idTaxonomia: string | undefined, titulo: string, descricao: string) => {
    const ramo: Ramo = {
      taxonomy_id: idTaxonomia,
      title: titulo,
      description: descricao,
    };

    const resposta = await adicionarRamoService(ramo);

    if (resposta !== 201) {
      throw new Error("Erro ao adicionar ramo");
    }

    setOpenDialogRamo(false);
  }

  const handleExcluirTaxonomia = async (taxonomiaId: string | undefined) => {
    try {
      const resposta = await excluirTaxonomia(taxonomiaId);
      setIdSelecionado("");

      if (resposta !== 204) {
        throw new Error("Erro ao excluir taxonomia");
      }

      const taxs = await getTaxonomiasService()
      setTax(taxs || []);
      setTaxonomiaSelecionada(null)

    } catch (error) {
      console.error('Erro ao excluir taxonomia:', error); // Chamar um toast no lugar
    }
  };

  const handleExcluirRamo = async (taxonomiaId: string | undefined, idRamo: number) => {
    try {
      await excluirRamo(idRamo);

      const taxs = await getTaxonomiasService()
      setTax(taxs || []);

    } catch (error) {
      console.error('Erro ao excluir ramo:', error);
    }
  };

  const handleAdicionarTaxonomia = async () => {
    try {
      const novaTaxonomia: Taxonomia = {
        typification_id: idTipificacao,
        title: tituloTaxonomia,
        description: descricaoTaxonomia,
        source: fontesSelecionadas.map(fonte => fonte.id),
      }

      const resposta = await adicionarTaxonomia(novaTaxonomia);

      if (resposta !== 201) {
        throw new Error("Erro ao adicionar taxonomia");
      }

      const taxs = await getTaxonomiasService();
      setTax(taxs || []);
    } catch (error) {
      console.error('Erro ao adicionar taxonomia:', error);
    }
    setOpenTaxonomia(false);
    limparCampos();
  }

  function limparCampos() {
    setTituloTaxonomia("");
    setDescricaoTaxonomia("");
    setFontesSelecionadas([]);
    setIdTipificacao("");
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-4 justify-between">
        <div className="flex flex-row items-center gap-2">
          <button className="flex items-center justify-center h-8 w-8 bg-white rounded-sm border border-gray-300 ml-4 hover:cursor-pointer">
            <ChevronLeft className="h-4 w-4 " />
          </button>
          <h1 className="ml-4 font-semibold text-2xl">Gestão de Taxonomia e ramos</h1>
        </div>

        <Dialog open={openTaxonomia} onOpenChange={setOpenTaxonomia}>
          <DialogTrigger asChild >
            <button
              className=" flex items-center gap-2 bg-vermelho hover:bg-vermelho cursor-pointer hover:shadow-md text-white font-semibold py-2 px-4 rounded-sm hover:scale-105 active:scale-100 duration-100 transition-all"

            >
              <Plus className="h-5 w-5 " strokeWidth={1.5} />
              Adicionar
            </button>

          </DialogTrigger>
          <DialogContent onCloseAutoFocus={limparCampos}>
            <DialogHeader>
              <DialogTitle>Adicionar taxonomia</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para adicionar uma nova taxonomia.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex p-3 gap-2 bg-gray-300 rounded-sm items-center">
                <label className="block text-md text-gray-700">
                  Tipificação:
                </label>

                <select
                  className="bg-white p-2 w-full rounded-md"
                  defaultValue={"Selecione uma tipificação"}
                  onChange={(e) => setIdTipificacao(e.target.value)}
                >
                  <option disabled>Selecione uma tipificação</option>
                  {
                    tipificacoes && tipificacoes.map((item, index) => (
                      <option key={index} value={item.id}>{item.name}</option>
                    ))
                  }
                </select>
              </div>
              <div>
                <label htmlFor="titleRamo" className="block text-sm font-medium text-gray-700">
                  Título*
                </label>
                <input
                  onChange={(e) => setTituloTaxonomia(e.target.value)}
                  type="text"
                  id="titleTaxonomia"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="descriptionRamo" className="block text-sm font-medium text-gray-700">
                  Descrição da Taxonomia*
                </label>
                <textarea
                  onChange={(e) => setDescricaoTaxonomia(e.target.value)}
                  id="descriptionTaxonomia"
                  placeholder="Digite uma descrição para a taxonomia"
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>

              <p className="flex flex-col gap-2">
                <label>Fontes</label>
                <select
                  defaultValue={"Selecione uma fonte"}
                  className="border-2 border-gray-300 rounded-md p-2"
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    setFontesSelecionadas([...fontesSelecionadas, fontes.find(fonte => fonte.id === e.target.value)!])
                  }}
                >
                  <option disabled>Selecione uma fonte</option>
                  {fontes && fontes.map((fonte, index) => (
                    <option
                      key={index}
                      value={fonte.id}
                    >
                      {fonte.name}
                    </option>
                  ))}
                </select>
              </p>

              {
                fontesSelecionadas.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p>Fontes selecionadas: </p>
                    <div className="grid grid-cols-3 gap-2 border-2 border-gray-300 rounded-md p-2">
                      {fontesSelecionadas.map((fonte, index) => (
                        <span key={index} className="flex gap-2 items-center w-fit">
                          <Checkbox
                            className="cursor-pointer"
                            checked
                            onClick={() => {
                              setFontesSelecionadas((fonteAnterior) => fonteAnterior.filter(fonte => fonte.id !== fonteAnterior[index].id))
                              console.log("fontes selecionadas", fontesSelecionadas)
                            }}
                            id="fonte"
                            key={index}
                          />
                          <Label className="cursor-pointer" htmlFor={"fonte"} key={fonte.id}>{fonte.name}</Label>
                        </span>
                      ))}
                    </div>
                  </div>
                )
              }
            </div>
            <DialogFooter>
              <DialogClose className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                Cancelar
              </DialogClose>

              <button
                className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md"
                type="submit"
                onClick={handleAdicionarTaxonomia}
              >
                Adicionar
              </button>


            </DialogFooter>

          </DialogContent>
        </Dialog>
      </div>

      <div className="flex max-h-[80dvh]">
        <div className="flex flex-col basis-1/2 overflow-y-scroll">
          {tax.map((item, index) => (
            <Card
              ref={(e) => { divRefs.current[index] = e }}
              key={index}
              className={`
                hover:bg-gray-200 hover:cursor-pointer
                m-4 hover:scale-[1.03] active:scale-100 duration-100
                div-taxonomia
                ${idSelecionado && idSelecionado === index.toString() ? "border-orange-300 border-[1px]" : ""}
              `}
              onClick={() => {
                setTaxonomiaSelecionada(item)
                setIdSelecionado(index.toString())
              }}
            >
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{item.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Calendar size={27} />
                  <span className="flex justify-center flex-col">
                    <span className="text-[10px] font-semibold mb-[-5px] mt-1">Criada em</span>
                    <span>{item.created_at}</span>
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center justify-center h-8 w-8 div-taxonomia bg-white rounded-sm border border-gray-300 hover:cursor-pointer hover:scale-110 active:scale-100 duration-100 transition-all">
                    <PencilLine className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                  <button
                    className="flex items-center justify-center h-8 w-8 bg-red-700 div-taxonomia text-white rounded-sm border border-gray-300 hover:cursor-pointer hover:scale-110 active:scale-100 duration-100 transition-all"
                    onClick={() => handleExcluirTaxonomia(item.id)}
                  >
                    <Trash className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
              </CardFooter>
            </Card>

            
          ))}
        </div>

        <div className="basis-1/2">
          <Card className="min-h-[50rem] h-auto m-4">
            <CardHeader>
              <CardTitle className="flex flex-row justify-between items-center">
                <h1 className="text-2xl">Ramos</h1>
                <Dialog open={openDialogRamo} onOpenChange={setOpenDialogRamo}>
                  <DialogTrigger asChild>
                    <div ref={(e) => { divRefs.current["botao"] = e }}>
                      <button
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 cursor-pointer hover:shadow-md text-white font-semibold py-2 px-4 rounded-sm"
                      >
                        <Plus className="h-5 w-5 " strokeWidth={1.5} />
                        Adicionar ramo
                      </button>
                    </div>

                  </DialogTrigger>
                  <DialogContent >
                    <DialogHeader>
                      <DialogTitle>Adicionar Ramo</DialogTitle>
                      <DialogDescription>
                        Preencha os campos abaixo para adicionar um novo ramo.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex p-3 gap-2 bg-gray-300 rounded-sm items-center">
                        <label className="block text-md text-gray-700">
                          Tipificação:
                        </label>

                        <select
                          className="bg-white p-2 w-full rounded-md"
                          defaultValue={"Selecione uma tipificação"}
                          onChange={(e) => setIdTipificacao(e.target.value)}
                        >
                          <option disabled>Selecione uma tipificação</option>
                          {
                            tipificacoes && tipificacoes.map((item, index) => (
                              <option key={index} value={item.id}>{item.name}</option>
                            ))
                          }
                        </select>
                      </div>
                      <div>
                        <label htmlFor="titleRamo" className="block text-sm font-medium text-gray-700">
                          Nome do Ramo*
                        </label>
                        <input
                          onChange={(e) => setTituloRamo(e.target.value)}
                          type="text"
                          id="titleRamo"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="descriptionRamo" className="block text-sm font-medium text-gray-700">
                          Descrição do Ramo*
                        </label>
                        <textarea
                          onChange={(e) => setDescricaoRamo(e.target.value)}
                          id="descriptionRamo"
                          placeholder="Digite uma descrição para o ramo"
                          rows={4}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                        Cancelar
                      </DialogClose>

                      <button
                        className="px-4 py-2 text-sm hover:cursor-pointer font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md"
                        type="submit"
                        onClick={() => {console.log("ids: ", idSelecionado, " EEE ", taxonomiaSelecionada?.id); handleAddRamo(taxonomiaSelecionada?.id, tituloRamo, descricaoRamo)}}
                      >
                        Adicionar
                      </button>


                    </DialogFooter>

                  </DialogContent>
                </Dialog>
              </CardTitle>

            </CardHeader>

            <CardContent>
              {taxonomiaSelecionada ? (
                taxonomiaSelecionada.branches && taxonomiaSelecionada.branches.length > 0 ? (
                  <ul>
                    {taxonomiaSelecionada.branches.map((ramo, index) => (
                      <div key={ramo.id} className="flex flex-col gap-2">
                        <li className="flex  justify-between items-center mb-2">
                          <span>{ramo.title}</span>

                          <div className="flex flex-row gap-2">
                            <button className="flex items-center justify-center h-8 w-8 bg-white rounded-sm border border-gray-300 hover:cursor-pointer hover:scale-110 active:scale-100 duration-100 transition-all">
                              <PencilLine className="h-4 w-4" strokeWidth={1.5} />
                            </button>
                            <button
                              onClick={() => handleExcluirRamo(taxonomiaSelecionada.id, ramo.id)}
                              className="flex items-center justify-center h-8 w-8 bg-red-700 text-white rounded-sm border border-gray-300 hover:cursor-pointer hover:scale-110 active:scale-100 duration-100 transition-all">
                              <Trash className="h-4 w-4" strokeWidth={1.5} />
                            </button>
                          </div>
                        </li>

                        {
                          index !== taxonomiaSelecionada.branches!.length - 1 &&
                          <hr className="border-gray-300 mb-4" />
                        }

                      </div>
                    ))}
                  </ul>
                ) : (
                  <p className="ml-3">Nenhum ramo disponível adicione um novo ramo.</p>
                )
              ) : (
                <p className="ml-3">Selecione uma taxonomia para exibir ramos</p>
              )
              }
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

}