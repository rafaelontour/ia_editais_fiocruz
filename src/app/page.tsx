import InfoBar from "@/components/ui/layout/InfoBar";
import Image from "next/image";

export default function Home() {

  const infoBarInfos = [{
    titulo: "Editais recebidos",
    valor: 200
  },{
    titulo: "Editais em análise",
    valor: 176, 
  },{
    titulo: "Editais concluidos",
    valor: 689,
  },{
  titulo: "Usuãrios",
  valor: 30
  }
]

  return (
  <div className="bg-[url(/backgroundImg.png)] px-12 rounded w-full h-full flex justify-center items-center gap-12 flex-col">
    <span className="text-5xl font-bold mt-12 w-1/2 text-center leading-tight">Centralize, organize e otimize seus 
    <strong className="bg-red-600 text-white px-2 rounded-xl">editais</strong> em um só lugar.</span>

    <div className="flex gap-4">
      <button className="text-red-700 border-red-700 border-solid border-2 px-6 py-2 rounded-md">Módulo base de conhecimento</button>
      <button className="text-white bg-red-700 px-4 py-2 rounded-md">Módulo análise de editais</button>
    </div>

    <InfoBar data={infoBarInfos}/>
  </div>
  );
}
