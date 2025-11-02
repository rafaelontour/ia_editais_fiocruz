'use client'

import Image from "next/image";

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Cabecalho from "@/components/Cabecalho";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Head from "next/head";
import useUsuario from "@/data/hooks/useUsuario";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { IconLoader2 } from "@tabler/icons-react";
import Link from "next/link";

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

  const title = titulosMap[pathname] || "Administrativo";

  // Atualiza o título dinamicamente no client (quando navega via Link)
  useEffect(() => {
    document.title = `Administrativo - ${title}`;
  }, [title]);

  return (
    usuario && (
      <div className="flex flex-col h-screen overflow-hidden w-full scrollbar-hidden">
      <Head>
        <title>Administrativo - {title}</title>
        <link rel="icon" sizes="32x32" type="image/x-icon" href="/favicon.ico" />
      </Head>
      
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
                                    <a className="flex items-center gap-2" href={item.url}>
                                      <item.icon className="w-5 h-5" />
                                      <span className="text-[16px]">{item.title}</span>
                                    </a>
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
                <div className="flex items-center gap-4">
                  <Image className="rounded-md" src="https://picsum.photos/100" alt="Logo" width={32} height={32} />
                  <h1 className="text-lg font-semibold">
                  </h1>
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
              style={{
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <SidebarTrigger
                onClick={() => mudarEstadoBarraLateral()}
                className="
                  mt-4 ml-4
                  hover:cursor-pointer
                  bg-white
                "
              />

              <div 
                className="
                  flex items-center pl-4 py-3
                  h-16 w-[95%] bg-white sticky
                  top-0 left-0 pointer-events-none z-10
                "
                style={{ 
                  background: "linear-gradient(to bottom, rgb(202, 202, 202) 0%, white 7%)",
                }}
              >
                <p></p>
              </div>
            </div>
            
            <div
              className="
                flex flex-1 flex-col h-[98%]
                bg-white pt-20 px-12 overflow-y-auto scrollbar-hidde
              "
              style={{
                boxShadow: "inset 0px 0px 5px rgba(0, 0, 0, .5)",
                borderRadius: "10px",
              }}
            >
              <div className="h-full">
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
