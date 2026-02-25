'use client'

import Cabecalho from "@/components/Cabecalho";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import useUsuario from "@/data/hooks/useUsuario";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import {  UserIcon } from "lucide-react";
import { motion } from "motion/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { usuario, barraLateralAberta, mudarEstadoBarraLateral } = useUsuario();
  const pathname = usePathname();
  const { items } = useUsuario();

  const titulosMap: Record<string, string> = {
    "/adm": "Início",
    "/adm/editais": "Meus documentos",
    "/adm/tipificacoes": "Tipificações",
    "/adm/taxonomias": "Taxonomias",
    "/adm/fontes": "Fontes",
    "/adm/unidades": "Unidades",
    "/adm/cargos": "Cargos",
  };

  const title = titulosMap[pathname] || "IAEditais";

  const urlBase = process.env.NEXT_PUBLIC_URL_BASE

  // Atualiza o título dinamicamente no client (quando navega via Link)
  useEffect(() => {
    document.title = `Administrativo - ${title}`;
  }, [pathname]);

  return (
    <div className="flex flex-col overflow-hidden w-full scrollbar-hidden">
    
      <Cabecalho />

      <div className="overflow-hidden">

        <div className="flex h-[calc(100vh-4rem)]">

          <motion.div
            layout
            className="flex top-14 left-0 h-[calc(100vh-4rem)] bg-zinc-100 z-10 overflow-hidden"
            style={{ boxShadow: "4px 0 3px rgba(0, 0, 0, .2)"}}
            animate={{ width: barraLateralAberta ? 260 : 60, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className={`w-[300px] flex flex-col justify-between`}>
              <nav className={``}>
                <ul>
                  {items.map((item) => (
                    barraLateralAberta ? (
                      <li key={item.url}>
                        <Link href={item.url}
                          className={`flex items-center gap-3 px-3 py-0.5`}
                        >
                          <span className={`flex ${barraLateralAberta ? "w-full" : "w-fit"} hover:bg-vermelho hover:text-white text-sm mb-1 items-center gap-2 p-2 rounded-md ${pathname === item.url ? "bg-vermelho font-bold text-white" : "bg-zinc-300"}`}>
                            <item.icon size={18} />
                            {barraLateralAberta && <span>{item.title}</span>}
                          </span>
                        </Link>
                      </li>
                    ) : (
                      <Tooltip key={item.url}>
                        <TooltipTrigger asChild>
                          <Link className="flex items-center gap-3 px-3 py-0.5" href={item.url}>
                            <span className={`flex ${barraLateralAberta ? "w-full" : "w-fit"} hover:bg-vermelho hover:text-white text-sm mb-1 items-center gap-2 p-2 rounded-md ${pathname === item.url ? "bg-vermelho font-bold text-white" : "bg-zinc-300"}`}>
                            <item.icon size={18} />
                          </span>
                          </Link>
                        </TooltipTrigger>

                        <TooltipContent side="right">
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    )
                  ))}
                </ul>
              </nav>
              
              

              <div className="flex items-center gap-4 w-full p-3">
                <div className={`flex items-center justify-center h-9 min-w-8.5 max-w-full bg-verde rounded-full `}>
                  
                  {
                    usuario && (
                      usuario.icon ? (
                        <img src={urlBase + usuario.icon.file_path} className={`w-8 h-8 rounded-full`} />
                      ) : (
                        <UserIcon size={18} />
                      )
                    )
                  }
                </div>

                <motion.div
                  initial={false}
                  animate={{
                    opacity: barraLateralAberta ? 1 : 0,
                    pointerEvents: barraLateralAberta ? "auto" : "none",
                    transition: {
                      delay: barraLateralAberta ? 0.3 : 0,
                      duration: 0.2,
                      ease: "easeOut"
                    }
                  }}
                  exit={{
                    display: barraLateralAberta ? "flex" : "none"
                  }}
                  style={{
                    display: barraLateralAberta ? "flex" : "none"
                  }}
                  className={`flex flex-col gap-0 min-w-[120px]`}
                >
                  <span className="text-sm font-bold">{usuario?.username}</span>
                  <Link className="h-fit" href="/adm/meu-perfil"><span className="text-xs font-medium hover:underline">Meu perfil</span></Link>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            layout
            className="px-6 w-full min-w-0 h-[calc(100vh-4rem)] overflow-y-auto"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="h-5 overflow-y-auto" />
              {children}
          </motion.div>

        </div>
      </div>
      
    </div>
  )
}