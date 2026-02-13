'use client'

import Cabecalho from "@/components/Cabecalho";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import useUsuario from "@/data/hooks/useUsuario";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { Expand, Menu, SidebarCloseIcon, SidebarOpenIcon, UserIcon } from "lucide-react";
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
    usuario && (
      <div className="flex flex-col overflow-hidden w-full scrollbar-hidden">
      
        <Cabecalho />

        <div className="overflow-hidden">

          <div className="flex">

            <motion.div
              layout
              className="flex top-14 left-0 h-[calc(100vh-4rem)] bg-zinc-100 z-10 overflow-hidden"
              style={{ boxShadow: "4px 0 3px rgba(0, 0, 0, .2)"}}
              animate={{ width: barraLateralAberta ? 260 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className={`w-[300px] flex flex-col justify-between`}>
                <nav className={``}>
                  <ul>
                    {items.map((item) => (
                      <li key={item.url}>
                        <Link href={item.url} className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-200 ${pathname === item.url ? "bg-gray-300 font-bold" : ""}`}>
                          <item.icon size={20} />
                          {barraLateralAberta && <span>{item.title}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="flex items-center gap-4 w-full p-4">
                  <div className={`flex items-center justify-center transition-all duration-100 w-full ${barraLateralAberta ? "h-12" : "h-9"} min-w-8 max-w-12  bg-verde rounded-full`}>
                    
                    {
                      usuario && (
                        usuario.icon ? (
                          <img src={urlBase + usuario.icon.file_path} className={`w-8 h-8 rounded-full`} />
                        ) : (
                          <UserIcon size={20} />
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
                    className={`flex flex-col min-w-[120px]`}
                  >
                    <span className="text-sm font-bold">{usuario?.username}</span>
                    <Link href="/adm/meu-perfil"><span className="text-xs font-medium hover:underline">Meu perfil</span></Link>
                  </motion.div>
                </div>
              </div>

              <Tooltip>
                  <TooltipTrigger asChild className="hover:cursor-pointer">
                    <motion.button
                      animate={{ x: barraLateralAberta ? 0 : -20 }}
                      className={`
                        fixed bg-red-500 text-white rounded-md
                        w-8 h-8 p-2 z-20 top-18 ${barraLateralAberta ? "left-[275px]" : "left-8"}
                        opacity-30 hover:opacity-85 transition-opacity
                      `}
                      onClick={mudarEstadoBarraLateral}
                    >
                      { barraLateralAberta ? <SidebarCloseIcon size={16} /> : <SidebarOpenIcon size={16} />}
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    { barraLateralAberta ? "Recolher menu" : "Expandir menu" }
                  </TooltipContent>
                </Tooltip>
                
            </motion.div>

            <motion.div
              layout
              className="flex-1 px-10"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="h-10" />
                  {children}
            </motion.div>

          </div>
        </div>
        
      </div>
    )
  );
}