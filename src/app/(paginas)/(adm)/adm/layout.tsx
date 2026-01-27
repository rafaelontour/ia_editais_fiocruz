'use client'

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Cabecalho from "@/components/Cabecalho";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import useUsuario from "@/data/hooks/useUsuario";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { IconLoader2 } from "@tabler/icons-react";
import Link from "next/link";
import { UserIcon } from "lucide-react";
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
    "/adm/editais": "Meus Editais",
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
      <div className="flex flex-col h-screen overflow-hidden w-full scrollbar-hidden">
      
      <Cabecalho />
      <div className="flex flex-1 overflow-y-hidden">
        <SidebarProvider defaultOpen={barraLateralAberta}>
          <Sidebar
            variant="inset" collapsible="icon" className="relative"
          >
              <SidebarContent>
                <SidebarGroup>
                  <SidebarMenu>
                    {items && items.length > 0 ? (
                      items.map((item) => {
                        const ativo = pathname === item.url;
                        return (
                          barraLateralAberta ? (
                            <SidebarMenuItem key={item.title}>
                              <SidebarMenuButton
                                className={`
                                  rounded-sm transition-all duration-15 py-[18px] pl-3
                                  ${ativo
                                    ? "bg-[#D03C30] text-white hover:bg-[#D03C30] hover:text-white"
                                    : "hover:bg-[#D03C30] hover:text-white bg-[#CCCCCC]"}
                                `}
                                asChild
                              >
                                <Link className="flex items-center gap-2" href={item.url}>
                                  <item.icon className="w-5 h-5" />
                                  <span className="text-[16px]">{item.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>

                          ) : (
                            <Tooltip key={item.title}>
                              <TooltipTrigger>
                                <SidebarMenuItem key={item.title}>
                                  <SidebarMenuButton
                                    className={`
                                      rounded-sm transition-all duration-15 py-[18px] pl-3
                                      ${ativo
                                        ? "bg-[#D03C30] text-white hover:bg-[#D03C30] hover:text-white"
                                        : "hover:bg-[#D03C30] hover:text-white bg-[#CCCCCC]"}
                                    `}
                                    asChild
                                  >
                                    <Link className="flex items-center gap-2" href={item.url}>
                                      <item.icon className="w-5 h-5" />
                                      <span className="text-[16px]">{item.title}</span>
                                    </Link>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              </TooltipTrigger>

                              <TooltipContent side="right" className="">
                                <p className="text-sm">{item.title}</p>
                              </TooltipContent>

                            </Tooltip>
                          )
                        );
                      })
                    ) : (
                      barraLateralAberta ? (
                        <div className=" text-gray-400 text-sm animate-pulse w-fit">Carregando menu...</div>
                      ) : (
                        <IconLoader2 className="w-5 h-5 animate-spin" />
                      )
                    )}
                  </SidebarMenu>
                </SidebarGroup>
              </SidebarContent>

              <SidebarFooter>
                <div className="flex items-center gap-4 w-full">
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
              </SidebarFooter>
    
          </Sidebar>

          <div
            className="
              flex relative w-full min-w-0 overflow-hidden
            "
          >
            <div
              className="
                absolute left-0 top-0 
                overflow-hidden flex w-full
              "
              
            >
              <SidebarTrigger
                onClick={() => mudarEstadoBarraLateral()}
                className={`
                  mt-4 ml-4 rounded-sm mb-1
                  hover:cursor-pointer
                  bg-vermelho hover:bg-vermelho text-white hover:text-white
                  
                `}
                style={{ boxShadow: "2px 2px 3px rgba(0, 0, 0, .3)"}}
                title={
                  barraLateralAberta
                    ? "Recolher menu"
                    : "Expandir menu"
                }
              />
            </div>
            
            <div
              className="
                flex flex-1 flex-col h-[98%]
                bg-white p-12 overflow-y-auto scrollbar-hidde
              "
              style={{
                boxShadow: "inset 0px 0px 5px rgba(0, 0, 0, .5)",
                borderRadius: "10px",
              }}
            >
              <div className="h-full overflow-auto no-scrollbar px-1">
                {children}
              </div>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </div>
    )
  );
}
