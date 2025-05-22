import Chart from "@/components/AppChart";
import InfoBar from "@/components/InfoBar";
import { firstChartData, infoBarInfos, secondChartData } from "@/core/constants/informacoes";


//Lembrar de criar inteface exportavel para a infobar e chart para poder reutilizar
export default function Home() {
  return (
  <div className="bg-[url(/backgroundImg.png)] bg-repeat bg-contain px-12 pb-4 rounded-md w-full flex justify-center items-center gap-12 flex-col">
    <h1 className="text-5xl font-bold mt-12 w-1/2 text-center leading-tight">Centralize, organize e otimize seus 
    <span className="bg-red-600 text-white px-2 rounded-md font-semibold">editais</span> em um só lugar.</h1>

    <div className="flex text-xl gap-4 font-medium">
      <button className="text-red-700 border-red-700 border-solid border-2 px-8 py-2 rounded-md cursor-pointer">Base de conhecimento</button>
      <button className="text-white bg-red-700 px-6  rounded-md cursor-pointer">Análise de editais</button>
    </div>
    <div className="flex flex-col w-full gap-4 h-1/2">
      <InfoBar data={infoBarInfos}/>
      <div className="w-full flex gap-8 ">
        <Chart data={firstChartData}  titulo="Gráfico de quantidade de tipos de editais" className={"w-[60%]"}></Chart>
        <Chart data={secondChartData}  titulo="Gráfico de status dos editais" className={"w-[40%]"}></Chart>
    </div>
    </div>
  </div>
  );
}
