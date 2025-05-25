"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Ramo } from "@/core/ramo";
import { Taxonomia } from "@/core/taxonomia";
import { Calendar, ChevronLeft, PencilLine, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";


export default function Taxonomias() {
  const [taxonomiaSelecionada, setTaxonomiaSelecionada] = useState<Taxonomia | null>(null);

  const ramoNovo: Ramo = {
    id: 0,
    nome: '',
    descricao: '',
  }

  const taxonomiaNova: Taxonomia = {
    id: 0,  
    nome: '',
    descricao: '',
    data: '',
  }

  const [itens, setItens] = useState<Taxonomia[]>([]);

  const getTaxonomias = async () => {
    const dados = await fetch('http://localhost:3000/api/taxonomias')

    if (!dados.ok) {
        throw new Error('Erro ao buscar taxonomias')
    }

    const taxonomias = await dados.json()
    setItens(taxonomias)
  }

  useEffect(() => {
    try {
      getTaxonomias()
    } catch (error) {
        console.error("Erro ao buscar taxonomias:", error);
    }
  }, []);

  const handleAddRamo = () => {
    if (taxonomiaSelecionada) {
      const novaTaxonomia = {
        ...taxonomiaSelecionada,
        ramos: [...taxonomiaSelecionada.ramos || [], ramoNovo],
      };

      setItens((prevItens) =>
        prevItens.map((item) =>
          item.nome === taxonomiaSelecionada.nome ? novaTaxonomia : item
        )
      );

      setTaxonomiaSelecionada(novaTaxonomia);

      setOpenRamo(false);
    }
  };

const handleDeleteTaxonomia = async (taxonomiaId: number) => {
    try {
        const response = await fetch(`http://localhost:3000/api/taxonomias?id=${taxonomiaId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro ao excluir taxonomia:', errorData.error);
            return;
        }

        getTaxonomias()
    } catch (error) {
        console.error('Erro ao excluir taxonomia:', error);
    }
};


const handleDeleteRamo = async (taxonomiaId: number, idRamo: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/taxonomias?id=${taxonomiaId}&ramo=${idRamo}`, {
          method: 'DELETE',
      });

      if (!response.ok) {
          const errorData = await response.json();
          console.error('Erro ao excluir ramo:', errorData.error);
          return;
      }

      getTaxonomias()
    } catch (error) {
        console.error('Erro ao excluir ramo:', error);
    }
};


  const handleAddTaxonomia = () => {
    setItens((prevItens) => [...prevItens, taxonomiaNova]);
    setOpenTaxonomia(false);
  }


  const [openTaxonomia, setOpenTaxonomia] = useState(false);
  const [openRamo, setOpenRamo] = useState(false);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row items-center gap-2 mb-4 justify-between">
        <div className="flex flex-row items-center gap-2">
          <button className="flex items-center justify-center h-8 w-8 bg-white rounded-sm border border-gray-300 ml-4 hover:cursor-pointer">
            <ChevronLeft className="h-4 w-4 " />
          </button>
          <h1 className="ml-4 font-semibold text-2xl">Gestão de Taxonomia e Ramos</h1>
        </div>

        <Dialog open={openTaxonomia} onOpenChange={setOpenTaxonomia}>
          <DialogTrigger asChild >
            <button 
                className=" flex items-center gap-2 bg-red-500 hover:bg-red-600 cursor-pointer hover:shadow-md text-white font-semibold py-2 px-4 rounded-sm"
              
            >
              <Plus className="h-5 w-5 " strokeWidth={1.5} />
              Adicionar 
            </button>
          
          </DialogTrigger>
          <DialogContent >
            <DialogHeader>
              <DialogTitle>Adicionar taxonomia</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para adicionar uma nova taxonomia.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-gray-300 rounded-sm items-center flex justify-center">
                <span>Tipificação COMUM A TODAS AS CONTRATAÇÕES </span>
              </div>
              <div>
                <label htmlFor="nomeRamo" className="block text-sm font-medium text-gray-700">
                  Título*
                </label>
                <input
                  onChange={(e) => taxonomiaNova.nome = e.target.value}
                  type="text"
                  id="nomeTaxonomia"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"   
                />
              </div>
              <div>
                  <label htmlFor="descricaoRamo" className="block text-sm font-medium text-gray-700">
                    Descrição da Taxonomia*
                  </label>
                  <textarea
                    onChange={(e) => taxonomiaNova.descricao = e.target.value}
                    id="descricaoTaxonomia"
                    placeholder="Digite uma descrição para a taxonomia"
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  />
              </div>
              <div>
                <label htmlFor="fontes" className="block text-sm font-medium text-gray-700">
                  Fontes* 
                </label>
                <select name="" id="" className="w-full">
                  <option value="">IN SGD n° 94/2022</option>
                  <option value="">Lei n° 14.133/2021</option>
                  <option value="">Constituição Federal</option>
                  <option value="">INSTRUÇÃO NORMATIVA 05/2017 SLTI</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                  Cancelar
              </DialogClose>
              
              <button 
                className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md"
                type="submit"
                onClick={handleAddTaxonomia}
              >
                Adicionar
              </button>

              
            </DialogFooter>

          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-row">
        <div className="basis-1/2">
          {itens.map((item, index) => (
            <Card
              key={index}
              className="hover:bg-gray-200 hover:cursor-pointer m-4"
              onClick={() => setTaxonomiaSelecionada(item)}
            >
              <CardHeader>
                <CardTitle>{item.nome}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{item.descricao}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-400">{item.data}</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center justify-center h-8 w-8 bg-white rounded-sm border border-gray-300 hover:cursor-pointer">
                    <PencilLine className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                  <button 
                    onClick={() => handleDeleteTaxonomia(item.id)}
                    className="flex items-center justify-center h-8 w-8 bg-red-700 text-white rounded-sm border border-gray-300 hover:cursor-pointer">
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
                <Dialog open={openRamo} onOpenChange={setOpenRamo}>
                  <DialogTrigger asChild >
                    <button 
                        className=" flex items-center gap-2 bg-red-500 hover:bg-red-600 cursor-pointer hover:shadow-md text-white font-semibold py-2 px-4 rounded-sm"
                      
                    >
                      <Plus className="h-5 w-5 " strokeWidth={1.5} />
                      Adicionar Ramos
                    </button>
                  
                  </DialogTrigger>
                  <DialogContent >
                    <DialogHeader>
                      <DialogTitle>Adicionar Ramo</DialogTitle>
                      <DialogDescription>
                        Preencha os campos abaixo para adicionar um novo ramo.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="bg-gray-300 rounded-sm items-center flex justify-center">
                        <span>Tipificação COMUM A TODAS AS CONTRATAÇÕES </span>
                      </div>
                      <div className="bg-gray-300 rounded-sm items-center flex justify-center">
                        <span>Taxonomia Planejada </span>
                      </div>
                      <div>
                        <label htmlFor="nomeRamo" className="block text-sm font-medium text-gray-700">
                          Nome do Ramo*
                        </label>
                        <input
                          onChange={(e) => ramoNovo.nome = e.target.value}
                          type="text"
                          id="nomeRamo"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"   
                        />
                      </div>
                      <div>
                          <label htmlFor="descricaoRamo" className="block text-sm font-medium text-gray-700">
                            Descrição do Ramo*
                          </label>
                          <textarea
                            onChange={(e) => ramoNovo.descricao = e.target.value}
                            id="descricaoRamo"
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
                        className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md"
                        type="submit"
                        onClick={handleAddRamo}
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
                taxonomiaSelecionada.ramos && taxonomiaSelecionada.ramos.length > 0 ? (
                  <ul>
                  {taxonomiaSelecionada.ramos.map((ramo, index) => (
                      <div key={index} className="flex flex-col gap-2">
                          <li className="flex  justify-between items-center mb-2">
                          <span>{ramo.nome}</span>
                     
                            <div className="flex flex-row gap-2">
                                <button className="flex items-center justify-center h-8 w-8 bg-white rounded-sm border border-gray-300 hover:cursor-pointer">
                                  <PencilLine className="h-4 w-4" strokeWidth={1.5} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteRamo(taxonomiaSelecionada.id, ramo.id)}
                                  className="flex items-center justify-center h-8 w-8 bg-red-700 text-white rounded-sm border border-gray-300 hover:cursor-pointer">
                                  <Trash className="h-4 w-4" strokeWidth={1.5} />
                                </button>
                           
                          </div>
                         </li>
                        <div className="w-full flex flex-col mb-6">
                    
                            <hr />
                        </div>
                      </div>
                      
                    ))}
                </ul>
              ) : (
                  <p>Nenhum ramo disponível adicione um novo ramo.</p>
                )
              ) : (
                  <p>Nenhum ramo disponível selecione uma taxonomia.</p>
                )
              }
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}