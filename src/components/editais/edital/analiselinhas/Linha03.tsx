"use client"

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Edital, Tipificacao } from "@/core";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import TaxonommiasResultado from "./TaxonomiasResultado";

interface Props {
    edital: Edital | undefined
}

export default function Linha03({ edital }: Props) {

    // const tipificacoes = edital && edital?.typifications || []

    const tipificacoes = [
        {
            name: "Tipificação 1 - Acesso Indevido",
            id: "t1",
            sources: [
                {
                    name: "Portaria 123/2024",
                    description: "Documento que define regras de acesso ao sistema",
                    id: "t1-s1",
                    created_at: "2024-11-05T09:12:34.000Z",
                    updated_at: "2025-02-14T15:03:21.000Z"
                }
            ],
            taxonomies: [
                {
                    title: "Identificação e Autenticação",
                    description: "Verifica se existem mecanismos adequados de autenticação",
                    id: "t1-tax1",
                    branches: [
                        {
                            title: "Uso de autenticação multifator",
                            description: "Avalia presença e qualidade do MFA",
                            id: "t1-tax1-b1",
                            evaluation: {
                                feedback: "MFA implementado para administradores, mas não universal.",
                                fulfilled: false,
                                score: 6
                            }
                        },
                        {
                            title: "Política de senhas",
                            description: "Complexidade e renovação de senhas",
                            id: "t1-tax1-b2",
                            evaluation: {
                                feedback: "Política definida e aplicada automaticamente.",
                                fulfilled: true,
                                score: 9
                            }
                        }
                    ],
                    sources: [
                        {
                            name: "Relatório de auditoria - Nov 2024",
                            description: "Auditoria trimestral sobre controles de acesso",
                            id: "t1-tax1-s1",
                            created_at: "2024-11-30T12:00:00.000Z",
                            updated_at: "2024-11-30T12:00:00.000Z"
                        }
                    ]
                },
                {
                    title: "Logs e Monitoramento",
                    description: "Capacidade de detecção e registro de tentativas de acesso",
                    id: "t1-tax2",
                    branches: [
                        {
                            title: "Retenção de logs",
                            description: "Período e integridade dos logs",
                            id: "t1-tax2-b1",
                            evaluation: {
                                feedback: "Logs retidos por 90 dias e replicados.",
                                fulfilled: true,
                                score: 8
                            }
                        }
                    ],
                    sources: []
                }
            ]
        },
        {
            name: "Tipificação 2 - Privacidade de Dados",
            id: "t2",
            sources: [
                {
                    name: "Política de Privacidade",
                    description: "Documento público descrevendo tratamento de dados",
                    id: "t2-s1",
                    created_at: "2023-06-10T08:00:00.000Z",
                    updated_at: "2025-03-02T10:10:10.000Z"
                }
            ],
            taxonomies: [
                {
                    title: "Consentimento e Base Legal",
                    description: "Verifica se há base legal para tratamento",
                    id: "t2-tax1",
                    branches: [
                        {
                            title: "Coleta com consentimento explícito",
                            description: "Formulários e logs de consentimento",
                            id: "t2-tax1-b1",
                            evaluation: {
                                feedback: "Consentimento solicitado, mas sem granularidade suficiente.",
                                fulfilled: false,
                                score: 5
                            }
                        },
                        {
                            title: "Direito ao esquecimento",
                            description: "Procedimentos para exclusão de dados",
                            id: "t2-tax1-b2",
                            evaluation: {
                                feedback: "Procedimento disponível via formulário de suporte.",
                                fulfilled: true,
                                score: 7
                            }
                        },
                        {
                            title: "Minimização de dados",
                            description: "Coleta apenas do necessário",
                            id: "t2-tax1-b3",
                            evaluation: {
                                feedback: "Algumas rotinas coletam metadados desnecessários.",
                                fulfilled: false,
                                score: 4
                            }
                        }
                    ],
                    sources: []
                }
            ]
        },
        {
            name: "Tipificação 3 - Disponibilidade",
            id: "t3",
            sources: [],
            taxonomies: [
                {
                    title: "Planos de continuidade",
                    description: "Procedimentos para falhas e recuperação",
                    id: "t3-tax1",
                    branches: [
                        {
                            title: "Backup e RTO",
                            description: "Frequência de backups e objetivo de tempo de recuperação",
                            id: "t3-tax1-b1",
                            evaluation: {
                                feedback: "Backups diários com RTO estimado em 4 horas.",
                                fulfilled: true,
                                score: 8
                            }
                        }
                    ],
                    sources: []
                },
                {
                    title: "Redundância de infraestrutura",
                    description: "Uso de múltiplas zonas/regiões",
                    id: "t3-tax2",
                    branches: [
                        {
                            title: "Balanceamento e failover",
                            description: "Mecanismos automáticos de failover",
                            id: "t3-tax2-b1",
                            evaluation: {
                                feedback: "Failover configurado, porém testes são esporádicos.",
                                fulfilled: false,
                                score: 6
                            }
                        }
                    ],
                    sources: []
                },
                {
                    title: "Monitoramento de performance",
                    description: "Alertas e SLAs",
                    id: "t3-tax3",
                    branches: [
                        {
                            title: "Alertas proativos",
                            description: "Sistema de alertas antes do impacto",
                            id: "t3-tax3-b1",
                            evaluation: {
                                feedback: "Alertas configurados para CPU e latência.",
                                fulfilled: true,
                                score: 9
                            }
                        },
                        {
                            title: "Análise de capacidade",
                            description: "Planejamento de capacidade e picos",
                            id: "t3-tax3-b2",
                            evaluation: {
                                feedback: "Relatórios mensais existem, mas falta automação.",
                                fulfilled: false,
                                score: 6
                            }
                        }
                    ],
                    sources: []
                }
            ]
        },
        {
            name: "Tipificação 4 - Integridade dos Dados",
            id: "t4",
            sources: [],
            taxonomies: [
                {
                    title: "Checksums e versionamento",
                    description: "Mecanismos para garantir integridade",
                    id: "t4-tax1",
                    branches: [
                        {
                            title: "Verificação de integridade",
                            description: "Checksums e validações periódicas",
                            id: "t4-tax1-b1",
                            evaluation: {
                                feedback: "Verificações realizadas em arquivos críticos.",
                                fulfilled: true,
                                score: 8
                            }
                        }
                    ],
                    sources: []
                }
            ]
        },
        {
            name: "Tipificação 5 - Conformidade Legal",
            id: "t5",
            sources: [
                {
                    name: "CheckList de Conformidade 2025",
                    description: "Checklist interno para requisitos legais",
                    id: "t5-s1",
                    created_at: "2025-01-15T11:22:33.000Z",
                    updated_at: "2025-07-01T09:00:00.000Z"
                }
            ],
            taxonomies: [
                {
                    title: "Licenças e contratos",
                    description: "Revisão de licenças de software e contratos de terceiros",
                    id: "t5-tax1",
                    branches: [
                        {
                            title: "Licença de terceiros",
                            description: "Verificação de compatibilidade de licenças",
                            id: "t5-tax1-b1",
                            evaluation: {
                                feedback: "Todas as dependências estão catalogadas.",
                                fulfilled: true,
                                score: 9
                            }
                        },
                        {
                            title: "Cláusulas contratuais",
                            description: "Cláusulas que impactam proteção de dados",
                            id: "t5-tax1-b2",
                            evaluation: {
                                feedback: "Alguns contratos carecem de cláusulas de SLA claras.",
                                fulfilled: false,
                                score: 5
                            }
                        }
                    ],
                    sources: []
                },
                {
                    title: "Auditorias internas",
                    description: "Frequência e cobertura das auditorias",
                    id: "t5-tax2",
                    branches: [
                        {
                            title: "Relatórios de auditoria",
                            description: "Acompanhamento de não-conformidades",
                            id: "t5-tax2-b1",
                            evaluation: {
                                feedback: "Auditorias semestrais com plano de ação ativo.",
                                fulfilled: true,
                                score: 8
                            }
                        }
                    ],
                    sources: []
                }
            ]
        },
        {
            name: "Tipificação 6 - Segurança de Aplicação",
            id: "t6",
            sources: [],
            taxonomies: [
                {
                    title: "Validação de entrada",
                    description: "Proteções contra injeção e dados malformados",
                    id: "t6-tax1",
                    branches: [
                        {
                            title: "Sanitização de inputs",
                            description: "Uso de validação e escaping",
                            id: "t6-tax1-b1",
                            evaluation: {
                                feedback: "Validações aplicadas no frontend, mas nem sempre no backend.",
                                fulfilled: false,
                                score: 5
                            }
                        },
                        {
                            title: "Testes de segurança",
                            description: "SAST/DAST e pentests periódicos",
                            id: "t6-tax1-b2",
                            evaluation: {
                                feedback: "Pentest anual realizado, com todas as findings tratadas.",
                                fulfilled: true,
                                score: 8
                            }
                        }
                    ],
                    sources: []
                }
            ]
        }
    ];
    const refs = useRef<(HTMLButtonElement | null)[]>([]);

    const scrollToIndex = (index: number) => {
        const el = refs.current[index];
        if (el) {
        el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
    };

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
                    <TabsList className="w-full flex flex-col gap-2 justify-between p-3 border border-gray-300 h-fit">
                        <span className="font-bold text-xl italic text-black">Tipificações para este edital</span>
                        <div className="w-full flex items-center gap-2">
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
                                    setAbaSelecionada("tab" + indexAnterior)
                                    scrollToIndex(indexAnterior);
                                    setPrimeiraTab(indexAnterior === 0)
                                    setUltimaTab(indexAnterior === tipificacoes.length - 1)
                                }}
                            >
                                <ChevronLeft />
                            </Button>
                            <div className="flex gap-2 items-center mx-3 overflow-x-hidden">
                                <div className="flex w-max">
                                    {tipificacoes.map((tip, index) => (
                                        <TabsTrigger
                                            ref={el => {refs.current[index] = el}} // ← aqui conecta cada aba ao array de refs
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
                                            <span
                                            title={tip.name}
                                            className="
                                                hover:cursor-pointer
                                                text-xs text-gray-600 px-2
                                                max-w-[100px]
                                                truncate
                                                block
                                            "
                            >
                                                {tip.name}
                                            </span>
                                        </TabsTrigger>
                                    ))}
                                </div>
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
                                    scrollToIndex(proximoIndex);
                                    setPrimeiraTab(proximoIndex === 0)
                                    setUltimaTab(proximoIndex === tipificacoes.length - 1)
                                }
                                }
                            >
                                <ChevronRight />
                            </Button>
                        </div>
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