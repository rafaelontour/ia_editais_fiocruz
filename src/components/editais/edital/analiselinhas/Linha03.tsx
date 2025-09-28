"use client"

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Edital, Tipificacao } from "@/core";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import TaxonommiasResultado from "./TaxonomiasResultado";

interface Props {
    edital: Edital | undefined
}

export default function Linha03({ edital }: Props) {

    // const tipificacoes = edital && edital?.typifications || []

    const tipificacoes = [
        {
            name: "Tipificação 1",
            id: "t1",
            sources: [
                {
                    name: "Fonte T1",
                    description: "Fonte ligada à tipificação 1",
                    id: "t1-s1",
                    created_at: "2025-09-27T10:23:17.321Z",
                    updated_at: "2025-09-27T10:23:17.321Z"
                }
            ],
            taxonomies: [
                {
                    title: "Taxonomia 1 da Tipificação 1",
                    description: "Descrição T1-Tax1",
                    id: "t1-tax1",
                    branches: [
                        {
                            title: "Ramo 1",
                            description: "Ramo de avaliação 1",
                            id: "t1-tax1-b1",
                            evaluation: {
                                feedback: "Completo",
                                fulfilled: true,
                                score: 10
                            }
                        },
                        {
                            title: "Ramo 2",
                            description: "Outro ramo",
                            id: "t1-tax1-b2",
                            evaluation: {
                                feedback: "Precisa ajustes",
                                fulfilled: false,
                                score: 5
                            }
                        }
                    ],
                    sources: [
                        {
                            name: "Fonte Taxonomia T1-1",
                            description: "Fonte usada em Taxonomia 1",
                            id: "t1-tax1-s1",
                            created_at: "2025-09-27T10:23:17.322Z",
                            updated_at: "2025-09-27T10:23:17.322Z"
                        }
                    ]
                },
                {
                    title: "Taxonomia 2 da Tipificação 1",
                    description: "Descrição T1-Tax2",
                    id: "t1-tax2",
                    branches: [
                        {
                            title: "Ramo único",
                            description: "Somente 1 ramo aqui",
                            id: "t1-tax2-b1",
                            evaluation: {
                                feedback: "Excelente",
                                fulfilled: true,
                                score: 9
                            }
                        }
                    ],
                    sources: []
                }
            ]
        },
        {
            name: "Tipificação 2",
            id: "t2",
            sources: [],
            taxonomies: [
                {
                    title: "Taxonomia 1 da Tipificação 2",
                    description: "Descrição T2-Tax1",
                    id: "t2-tax1",
                    branches: [
                        {
                            title: "Ramo 1",
                            description: "Primeiro ramo",
                            id: "t2-tax1-b1",
                            evaluation: {
                                feedback: "Parcial",
                                fulfilled: true,
                                score: 6
                            }
                        },
                        {
                            title: "Ramo 2",
                            description: "Segundo ramo",
                            id: "t2-tax1-b2",
                            evaluation: {
                                feedback: "Ruim",
                                fulfilled: false,
                                score: 2
                            }
                        },
                        {
                            title: "Ramo 3",
                            description: "Terceiro ramo",
                            id: "t2-tax1-b3",
                            evaluation: {
                                feedback: "Ok",
                                fulfilled: true,
                                score: 7
                            }
                        }
                    ],
                    sources: []
                }
            ]
        },
        {
            name: "Tipificação 3",
            id: "t3",
            sources: [],
            taxonomies: [
                {
                    title: "Taxonomia 1 da Tipificação 3",
                    description: "Descrição T3-Tax1",
                    id: "t3-tax1",
                    branches: [
                        {
                            title: "Ramo A",
                            description: "Primeiro ramo A",
                            id: "t3-tax1-b1",
                            evaluation: {
                                feedback: "Excelente",
                                fulfilled: true,
                                score: 10
                            }
                        }
                    ],
                    sources: []
                },
                {
                    title: "Taxonomia 2 da Tipificação 3",
                    description: "Descrição T3-Tax2",
                    id: "t3-tax2",
                    branches: [
                        {
                            title: "Ramo único B",
                            description: "Só um ramo aqui",
                            id: "t3-tax2-b1",
                            evaluation: {
                                feedback: "Bom",
                                fulfilled: true,
                                score: 8
                            }
                        }
                    ],
                    sources: []
                },
                {
                    title: "Taxonomia 3 da Tipificação 3",
                    description: "Descrição T3-Tax3",
                    id: "t3-tax3",
                    branches: [
                        {
                            title: "Ramo 1",
                            description: "Primeiro ramo da terceira taxonomia",
                            id: "t3-tax3-b1",
                            evaluation: {
                                feedback: "Fraco",
                                fulfilled: false,
                                score: 4
                            }
                        },
                        {
                            title: "Ramo 2",
                            description: "Segundo ramo",
                            id: "t3-tax3-b2",
                            evaluation: {
                                feedback: "Bom",
                                fulfilled: true,
                                score: 7
                            }
                        }
                    ],
                    sources: []
                }
            ]
        },
        {
            name: "Tipificação 4",
            id: "t4",
            sources: [],
            taxonomies: [
                {
                    title: "Taxonomia única da Tipificação 4",
                    description: "Só uma taxonomia aqui",
                    id: "t4-tax1",
                    branches: [
                        {
                            title: "Ramo único",
                            description: "Sem mais ramos",
                            id: "t4-tax1-b1",
                            evaluation: {
                                feedback: "Não atendido",
                                fulfilled: false,
                                score: 1
                            }
                        }
                    ],
                    sources: []
                }
            ]
        },
        {
            name: "Tipificação 5",
            id: "t5",
            sources: [],
            taxonomies: [
                {
                    title: "Taxonomia 1 da Tipificação 5",
                    description: "Descrição T5-Tax1",
                    id: "t5-tax1",
                    branches: [
                        {
                            title: "Ramo 1",
                            description: "Primeiro",
                            id: "t5-tax1-b1",
                            evaluation: {
                                feedback: "Ok",
                                fulfilled: true,
                                score: 7
                            }
                        },
                        {
                            title: "Ramo 2",
                            description: "Segundo",
                            id: "t5-tax1-b2",
                            evaluation: {
                                feedback: "Precisa revisão",
                                fulfilled: false,
                                score: 5
                            }
                        }
                    ],
                    sources: []
                },
                {
                    title: "Taxonomia 2 da Tipificação 5",
                    description: "Descrição T5-Tax2",
                    id: "t5-tax2",
                    branches: [
                        {
                            title: "Ramo único",
                            description: "Só um ramo",
                            id: "t5-tax2-b1",
                            evaluation: {
                                feedback: "Excelente",
                                fulfilled: true,
                                score: 9
                            }
                        }
                    ],
                    sources: []
                }
            ]
        },
        {
            name: "Tipificação 2",
            id: "t2",
            sources: [],
            taxonomies: [
                {
                    title: "Taxonomia 1 da Tipificação 2",
                    description: "Descrição T2-Tax1",
                    id: "t2-tax1",
                    branches: [
                        {
                            title: "Ramo 1",
                            description: "Primeiro ramo",
                            id: "t2-tax1-b1",
                            evaluation: {
                                feedback: "Parcial",
                                fulfilled: true,
                                score: 6
                            }
                        },
                        {
                            title: "Ramo 2",
                            description: "Segundo ramo",
                            id: "t2-tax1-b2",
                            evaluation: {
                                feedback: "Ruim",
                                fulfilled: false,
                                score: 2
                            }
                        },
                        {
                            title: "Ramo 3",
                            description: "Terceiro ramo",
                            id: "t2-tax1-b3",
                            evaluation: {
                                feedback: "Ok",
                                fulfilled: true,
                                score: 7
                            }
                        }
                    ],
                    sources: []
                }
            ]
        },
        {
            name: "Tipificação 2",
            id: "t2",
            sources: [],
            taxonomies: [
                {
                    title: "Taxonomia 1 da Tipificação 2",
                    description: "Descrição T2-Tax1",
                    id: "t2-tax1",
                    branches: [
                        {
                            title: "Ramo 1",
                            description: "Primeiro ramo",
                            id: "t2-tax1-b1",
                            evaluation: {
                                feedback: "Parcial",
                                fulfilled: true,
                                score: 6
                            }
                        },
                        {
                            title: "Ramo 2",
                            description: "Segundo ramo",
                            id: "t2-tax1-b2",
                            evaluation: {
                                feedback: "Ruim",
                                fulfilled: false,
                                score: 2
                            }
                        },
                        {
                            title: "Ramo 3",
                            description: "Terceiro ramo",
                            id: "t2-tax1-b3",
                            evaluation: {
                                feedback: "Ok",
                                fulfilled: true,
                                score: 7
                            }
                        }
                    ],
                    sources: []
                }
            ]
        },
        {
            name: "Tipificação 2",
            id: "t2",
            sources: [],
            taxonomies: [
                {
                    title: "Taxonomia 1 da Tipificação 2",
                    description: "Descrição T2-Tax1",
                    id: "t2-tax1",
                    branches: [
                        {
                            title: "Ramo 1",
                            description: "Primeiro ramo",
                            id: "t2-tax1-b1",
                            evaluation: {
                                feedback: "Parcial",
                                fulfilled: true,
                                score: 6
                            }
                        },
                        {
                            title: "Ramo 2",
                            description: "Segundo ramo",
                            id: "t2-tax1-b2",
                            evaluation: {
                                feedback: "Ruim",
                                fulfilled: false,
                                score: 2
                            }
                        },
                        {
                            title: "Ramo 3",
                            description: "Terceiro ramo",
                            id: "t2-tax1-b3",
                            evaluation: {
                                feedback: "Ok",
                                fulfilled: true,
                                score: 7
                            }
                        }
                    ],
                    sources: []
                }
            ]
        },
        {
            name: "Tipificação 2",
            id: "t2",
            sources: [],
            taxonomies: [
                {
                    title: "Taxonomia 1 da Tipificação 2",
                    description: "Descrição T2-Tax1",
                    id: "t2-tax1",
                    branches: [
                        {
                            title: "Ramo 1",
                            description: "Primeiro ramo",
                            id: "t2-tax1-b1",
                            evaluation: {
                                feedback: "Parcial",
                                fulfilled: true,
                                score: 6
                            }
                        },
                        {
                            title: "Ramo 2",
                            description: "Segundo ramo",
                            id: "t2-tax1-b2",
                            evaluation: {
                                feedback: "Ruim",
                                fulfilled: false,
                                score: 2
                            }
                        },
                        {
                            title: "Ramo 3",
                            description: "Terceiro ramo",
                            id: "t2-tax1-b3",
                            evaluation: {
                                feedback: "Ok",
                                fulfilled: true,
                                score: 7
                            }
                        }
                    ],
                    sources: []
                }
            ]
        },
        {
            name: "Tipificação 2",
            id: "t2",
            sources: [],
            taxonomies: [
                {
                    title: "Taxonomia 1 da Tipificação 2",
                    description: "Descrição T2-Tax1",
                    id: "t2-tax1",
                    branches: [
                        {
                            title: "Ramo 1",
                            description: "Primeiro ramo",
                            id: "t2-tax1-b1",
                            evaluation: {
                                feedback: "Parcial",
                                fulfilled: true,
                                score: 6
                            }
                        },
                        {
                            title: "Ramo 2",
                            description: "Segundo ramo",
                            id: "t2-tax1-b2",
                            evaluation: {
                                feedback: "Ruim",
                                fulfilled: false,
                                score: 2
                            }
                        },
                        {
                            title: "Ramo 3",
                            description: "Terceiro ramo",
                            id: "t2-tax1-b3",
                            evaluation: {
                                feedback: "Ok",
                                fulfilled: true,
                                score: 7
                            }
                        }
                    ],
                    sources: []
                }
            ]
        }
    ];


    const [ultimaTab, setUltimaTab] = useState<boolean>(false)
    const [primeiraTab, setPrimeiraTab] = useState<boolean>(true)
    const [abaSelecionada, setAbaSelecionada] = useState<string>("tab0")

    const [tipificacaoSelecionada, setTipificacaoSelecionada] = useState({
        tipificacao: tipificacoes[0],
        index: 0
    })

    return (
        <div className="flex flex-row gap-4 items-center">

            <div className="flex w-full gap-4 relative">

                <Tabs
                    className="w-full"
                    value={abaSelecionada}
                    defaultValue="tab0"
                    onValueChange={(val) => setAbaSelecionada(val)}
                >
                    <TabsList className="w-full flex justify-between p-3 border border-gray-300 h-fit">
                        
                        <Button
                            className={`
                                ${primeiraTab ? "bg-gray-100 hover:bg-gray-100" : "bg-gray-300 hover:bg-gray-300"}
                                hover:cursor-pointer 
                            `}
                            title={`${primeiraTab ? "Você está na primeira aba" : "Tipificação anterior"}`}
                            variant={"outline"}
                            size={"icon"}
                            onClick={() => {
                                if (tipificacaoSelecionada.index === null) return

                                const indexAnterior = tipificacaoSelecionada.index - 1

                                if (indexAnterior < 0) return

                                setTipificacaoSelecionada(anterior => ({
                                    ...anterior,
                                    index: indexAnterior,
                                    tipificacao: tipificacoes[indexAnterior]
                                }))
                                
                                setPrimeiraTab(indexAnterior === 0)
                                setUltimaTab(indexAnterior === tipificacoes.length - 1)
                                setAbaSelecionada("tab" + indexAnterior)
                            }}
                        >
                            <ChevronLeft />
                        </Button>
                                
                        <div className="flex gap-2 items-center mx-3">
                            <ScrollArea className="w-full">
                                <div className="flex-1 w-min-0 whitespace-nowrap">
                                    {tipificacoes.map((tip, index) => (
                                        <TabsTrigger
                                            onClick={() => {
                                                setTipificacaoSelecionada(anterior => ({
                                                    ...anterior,
                                                    index: index,
                                                    tipificacao: tip
                                                }))
                                                
                                                if (index === 0) {
                                                    setPrimeiraTab(true)
                                                } else {
                                                    setPrimeiraTab(false)
                                                }

                                                if (index === tipificacoes.length - 1) {
                                                    setUltimaTab(true)
                                                } else {
                                                    setUltimaTab(false)
                                                }
                                            }}
                                            value={"tab" + index}
                                            key={tip.id}
                                        >
                                            <span className="hover:cursor-pointer text-xs text-gray-600 px-2">
                                                {tip.name}
                                            </span>
                                        </TabsTrigger>
                                    ))}
                                </div>
                                <ScrollBar className="" orientation="horizontal" />
                            </ScrollArea>
                        </div>

                        
                        <Button
                            className={`
                                ${ultimaTab ? "bg-gray-100 hover:bg-gray-100" : "bg-gray-300 hover:bg-gray-300"} hover:cursor-pointer
                                `}
                                title={`${!ultimaTab ? "Tipificação seguinte" : "Você está na última aba"}`}
                                variant={"outline"}
                                size={"icon"}
                                onClick={() => {
                                    
                                    if (tipificacaoSelecionada.index === null || tipificacaoSelecionada.index === tipificacoes.length - 1) return

                                    const proximoIndex = tipificacaoSelecionada.index + 1

                                    if (proximoIndex < tipificacoes.length) {
                                        setTipificacaoSelecionada({
                                            tipificacao: tipificacoes[proximoIndex],
                                            index: proximoIndex
                                        })
                                        setAbaSelecionada("tab" + proximoIndex.toString())
                                    }

                                    setPrimeiraTab(proximoIndex === 0)
                                    setUltimaTab(proximoIndex === tipificacoes.length - 1)
                                }
                            }
                        >
                            <ChevronRight />
                        </Button>
                    </TabsList>

                    {
                        tipificacoes.map((tipificacao, index) => (
                            <TabsContent
                                value={"tab" + index}
                                className=""
                                key={tipificacao.id}
                            >
                                <TaxonommiasResultado
                                    taxonomias={tipificacaoSelecionada.tipificacao ? tipificacaoSelecionada.tipificacao.taxonomies : []}
                                    key={tipificacao.id}
                                />
                            </TabsContent>
                        ))
                    }
                </Tabs>
            </div>
        </div>
    );
}