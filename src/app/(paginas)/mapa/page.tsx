"use client"
import { useRef, useEffect } from 'react'
import MapaRender from '@/components/Map';




export default function Mapa() {
  
  return (

    <div className='flex gap-6 h-full w-full items-center text-center '>
      <h2 className='w-full text-5xl'><strong className=' px-2 py-2 bg-red-500 rounded-xl'>Pesquise</strong> por editais por unidades da FioCruz</h2>
      <MapaRender/>
    </div>
  )
}
