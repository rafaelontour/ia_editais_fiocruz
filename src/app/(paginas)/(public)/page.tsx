'use client'
import Chart from "@/components/AppChart";
import InfoBar from "@/components/InfoBar";
import MapaRender from "@/components/Map";
import { firstChartData, infoBarInfos, secondChartData } from "@/core/constants/informacoes";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), {
  loading: () => <p>Carregando..</p>,
  ssr: false
})

//Lembrar de criar inteface exportavel para a infobar e chart para poder reutilizar
export default function Home() {
  return (
  <div className="flex flex-col">
  <div className="bg-[url(/backgroundImg.png)] bg-repeat bg-contain px-12 pb-4 rounded-md w-full flex justify-center items-center gap-12 flex-col">
    <h1 className="text-5xl font-bold mt-12 w-1/2 text-center leading-tight">Centralize, organize e otimize seus 
    <span className="bg-red-600 text-white px-2 rounded-md font-semibold">editais</span> em um só lugar.</h1>

    <div className="flex text-xl gap-4 font-medium">
      <button className="text-vermelho border-vermelho border-solid border-2 px-8 py-2 rounded-md cursor-pointer">Base de conhecimento</button>
      <button className="text-branco bg-vermelho px-6  rounded-md cursor-pointer">Análise de editais</button>
    </div>
    <div className="flex flex-col w-full gap-4 h-1/2">
      <InfoBar data={infoBarInfos}/>
      <div className="w-full flex gap-8 ">
        <Chart data={firstChartData}  titulo="Gráfico de quantidade de tipos de editais" className={"w-[60%]"}></Chart>
        <Chart data={secondChartData}  titulo="Gráfico de status dos editais" className={"w-[40%]"}></Chart>
    </div>
    </div>
   
  </div>
   <div className='flex gap-6 h-screen  w-full items-center text-center justify-between p-4'>
          <h2 className='w-3/4  text-3xl 2xl:text-5xl leading-tight'><strong className=' px-2 py-2 bg-red-600 rounded-xl text-white'>Pesquise</strong> por editais por unidades da FioCruz</h2>
            <Map/>
        </div>
    </div>
  );
}
