import Chart from "@/components/layout/AppChart";
import InfoBar from "@/components/layout/InfoBar";
import { firstChartData, infoBarInfos, secondChartData } from "@/constants/informacoes";

export default function Home() {

  

  return (
  <div className="bg-[url(/backgroundImg.png)] overflow-y-auto px-12 pb-4 rounded w-full h-full flex justify-center items-center gap-12 flex-col">
    <h1 className="text-5xl font-bold mt-12 w-1/2 text-center leading-tight">Centralize, organize e otimize seus 
    <strong className="bg-red-600 text-white px-2 rounded-xl">editais</strong> em um só lugar.</h1>

    <div className="flex gap-4">
      <button className="text-red-700 border-red-700 border-solid border-2 px-6 py-2 rounded-md cursor-pointer">Módulo base de conhecimento</button>
      <button className="text-white bg-red-700 px-4 py-2 rounded-md cursor-pointer">Módulo análise de editais</button>
    </div>
    <div className="flex flex-col w-full gap-4 h-1/2">
      <InfoBar data={infoBarInfos}/>
      <div className="w-full h-full flex gap-8 ">
        <Chart data={firstChartData}  titulo="Gráfico de quantidade de tipos de editais" className={"w-[65%]"}></Chart>
        <Chart data={secondChartData}  titulo="Gráfico de status dos editais" className={"w-[35%]"}></Chart>
    </div>
    </div>
  </div>
  );
}
