"use client"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartTooltip } from "./ui/chart"
import { Tooltip } from "./ui/tooltip"
import { IChartDataUnidade } from "@/core/stats/Stats"

interface IChartData {
    tipo: string,
    uso: number,
    fill?: string
}

const chartConfig = {
    editais: {
        label: "Editais",
        color: "#098177"
    }
} satisfies ChartConfig


export default function Chart({ data, className, titulo }: { data: IChartData[] | IChartDataUnidade[], className: string, titulo: string }) {

    function isUnidade(item: IChartData | IChartDataUnidade): item is IChartDataUnidade {
        return "documentos" in item;
    }
    
    const dataKey = data.length > 0 && isUnidade(data[0]) ? "documentos" : "uso"

    return (
        <div className={`h-[calc(100vh-580px)] bg-branco rounded-md flex flex-col p-6 border-zinc-400 border ${className}`}>
            <h2 className="text-2xl">{titulo}</h2>
            <ResponsiveContainer width="100%" height="100%" className="bg-branco rounded-sm pt-6">
                <BarChart innerRadius={103} className="-ml-6" accessibilityLayer data={data}>
                    <XAxis
                        dataKey="tipo"
                        tick={false}
                        tickLine={false}
                        axisLine={true}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                    />

                    <ChartTooltip  />
                    <Bar dataKey={dataKey} fill={chartConfig.editais.color} radius={12} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
