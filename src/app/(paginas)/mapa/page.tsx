import { useRef, useEffect } from 'react'
import MapaRender from '@/components/Map';




export default function Mapa() {
  
  return (

    <div className='flex gap-6 h-full w-full items-center text-center justify-between pb-8'>
      <h2 className='w-3/4  text-5xl leading-tight'><strong className=' px-2 py-2 bg-red-600 rounded-xl text-white'>Pesquise</strong> por editais por unidades da FioCruz</h2>
        <MapaRender/>
    </div>
  )
}
