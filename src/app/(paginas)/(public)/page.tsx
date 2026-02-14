'use client'

import { useState, useEffect } from "react";
import Chart from "@/components/AppChart";
import InfoBar from "@/components/InfoBar";
import dynamic from "next/dynamic";

import {
    getKpiStatsService,
    getDocumentsByUnitService,
    getMostUsedTypificationsService
} from "@/service/stats";
import {
    KpiStats,
    DocumentCountByUnitList,
    TypificationUsageList,
    IInfoBarItem,
    IChartData
} from "@/core";

const Map = dynamic(() => import("@/components/Map"), {
    loading: () => <p>Carregando..</p>,
    ssr: false
})

export default function Home() {
    const [infoBarData, setInfoBarData] = useState<IInfoBarItem[]>([]);
    const [typificationChartData, setTypificationChartData] = useState<IChartData[]>([]);
    const [docsByUnitChartData, setDocsByUnitChartData] = useState<IChartData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadDashboardData() {
            try {
                setIsLoading(true);

                // Buscar todos os dados em paralelo
                const [kpiResult, typificationResult, docsByUnitResult] = await Promise.all([
                    getKpiStatsService(),
                    getMostUsedTypificationsService(),
                    getDocumentsByUnitService()
                ]);

                // --- Processar KPIs para o InfoBar ---
                if (kpiResult) {
                    const kpis: KpiStats = kpiResult;
                    const mappedInfoBar: IInfoBarItem[] = [
                        { title: "Documentos", value: kpis.total_documents },
                        { title: "Análises", value: kpis.total_analyses },
                        { title: "Unidades", value: kpis.total_units },
                        { title: "Usuários", value: kpis.total_users },
                    ];
                    setInfoBarData(mappedInfoBar);
                }

                // --- Processar Tipificações para o Gráfico 1 ---
                // (Mapeia a resposta da API para o formato {tipo, valor} esperado pelo Chart)
                if (typificationResult) {
                    const data: TypificationUsageList = typificationResult;
                    const mappedData: IChartData[] = data.stats.map(item => ({
                        tipo: item.typification_name, // O nome da tipificação será o eixo X
                        valor: item.usage_count      // A contagem será o valor da barra
                    }));
                    setTypificationChartData(mappedData);
                }

                // --- Processar Documentos por Unidade para o Gráfico 2 ---
                // (Mapeia a resposta da API para o formato {tipo, valor} esperado pelo Chart)
                if (docsByUnitResult) {
                    const data: DocumentCountByUnitList = docsByUnitResult;
                    const mappedData: IChartData[] = data.stats.map(item => ({
                        tipo: item.unit_name,         // O nome da unidade será o eixo X
                        valor: item.document_count    // A contagem será o valor da barra
                    }));
                    setDocsByUnitChartData(mappedData);
                }

            } catch (error) {
                console.error("Falha ao carregar dados do dashboard:", error);
                // Aqui você pode definir um estado de erro, se desejar
            } finally {
                setIsLoading(false);
            }
        }

        loadDashboardData();
    }, []); // Array vazio garante que rode apenas uma vez (onMount)


    // 4. Renderizar os componentes com os dados do estado
    return (
        <div className="flex flex-col">
            <div className="bg-[url(/backgroundImg.png)] bg-repeat bg-contain px-12 pb-4 rounded-md w-full flex justify-center items-center gap-12 flex-col">
                <h1 className="text-5xl font-bold mt-12 w-1/2 text-center leading-tight">Centralize, organize e otimize seus 
                    <span className="bg-red-600 text-white px-2 ml-4 rounded-md font-semibold">editais</span> em um só lugar.</h1>

                <div className="flex text-xl gap-4 font-medium">
                    <button className="text-vermelho border-vermelho border-solid border-2 px-8 py-2 rounded-md cursor-pointer">Base de conhecimento</button>
                    <button className="text-branco bg-vermelho px-6  rounded-md cursor-pointer">Análise de editais</button>
                </div>

                <div className="flex flex-col w-full gap-4 h-1/2">

                    {/* Exibe 'Carregando...' ou o componente com dados */}
                    {isLoading ? (
                        <p className="text-center">Carregando estatísticas...</p>
                    ) : (
                        <>
                            <InfoBar data={infoBarData} /> {/* <-- Dado real */}

                            <div className="w-full flex gap-8 ">
                                <Chart
                                    data={typificationChartData} // <-- Dado real
                                    titulo="Tipificações mais utilizadas"
                                    className="w-[60%]"
                                />
                                <Chart
                                    data={docsByUnitChartData} // <-- Dado real
                                    titulo="Documentos por Unidade" // <-- Título atualizado
                                    className="w-[40%]"
                                />
                            </div>
                        </>
                    )}

                </div>
            </div>

            <div className='flex gap-6 h-screen  w-full items-center text-center justify-between p-4'>
                <h2 className='w-3/4 text-3xl 2xl:text-5xl leading-tight'>
                    <strong className=' px-2 py-2 bg-red-600 rounded-xl text-white'>Pesquise</strong>
                    por editais por unidades da FioCruz
                </h2>
                <Map />
            </div>
        </div>
    );
}