"use client"
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts"
import { ChartConfig, ChartContainer } from "../ui/chart"

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

export default function Chart(props: {data : IChartData[]}){


    return(
        <ResponsiveContainer width="50%" height="50%">
        <BarChart accessibilityLayer data={props.data} className="bg-white">
            <XAxis dataKey="Tipo"/>
          <Bar dataKey="valor" fill={chartConfig.editais.color} radius={4} />
        </BarChart>
      </ResponsiveContainer>
    )
}