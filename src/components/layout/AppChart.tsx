"use client"
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts"
import { ChartConfig,ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"

interface IChartData{
    tipo : string,
    valor: number
}


const chartConfig = {
    editais:{
        label: "Editais",
        color: "#2567eb"
    }
} satisfies ChartConfig

export default function Chart({data, className, titulo}: {data : IChartData[], className : string, titulo : string}){


    return(
        <div className={`h-full bg-white p-4 rounded-md flex flex-col px-12 ${className}`}>
            <h2 className="text-2xl">{titulo}</h2>
            <ResponsiveContainer width="100%" height="100%" className="bg-white rounded-sm py-4">
            <BarChart accessibilityLayer data={data} >
                <XAxis 
                dataKey="tipo"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                />
            <Bar dataKey="valor" fill={chartConfig.editais.color} radius={4} />
            </BarChart>
        </ResponsiveContainer>
      </div>
    )
}