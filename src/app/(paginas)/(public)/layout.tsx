'use client'

import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import Cabecalho from "@/components/Cabecalho";
import useUsuario from "@/data/hooks/useUsuario";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { items } = useUsuario()
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Cabecalho />

      <div className="flex flex-1 overflow-y-hidden">
        <SidebarProvider>
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
                        );
                      })
                    ) : (
                      <div className="p-4 text-gray-400 animate-pulse w-fit">Carregando menu...</div>
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
              flex flex-1 relative
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
                flex w-full flex-col h-[98%]
                bg-white flex-1 pt-20 px-12 overflow-y-auto scrollbar-hide
              "
              style={{
                boxShadow: "inset 0px 0px 5px rgba(0, 0, 0, .5)",
                borderRadius: "10px",
              }}
            >
              <div className="w-full">
                {children}
              </div>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}
