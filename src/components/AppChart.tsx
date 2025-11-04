"use client"
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts"
import { ChartConfig } from "./ui/chart"

interface IChartData {
    tipo: string,
    valor: number,
    fill?: string
}

const chartConfig = {
    editais: {
        label: "Editais",
        color: "#098177"
    }
} satisfies ChartConfig

export default function Chart({ data, className, titulo }: { data: IChartData[], className: string, titulo: string }) {
    return (
        <div className={`min-h-[280px] bg-branco p-4 rounded-md flex flex-col px-12 border-zinc-400 border-1 ${className}`}>
            <h2 className="text-2xl">{titulo}</h2>
            <ResponsiveContainer width="100%" height="100%" className="bg-branco rounded-sm py-4">
                <BarChart accessibilityLayer data={data}   >
                    <XAxis
                        dataKey="tipo"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <Bar dataKey="valor" fill={chartConfig.editais.color} radius={12} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}