'use client'

import "@/app/globals.css";
import { ProcEditalProvider } from "@/data/context/ProcEdital";
import { UsuarioContextoProvider } from "@/data/context/UsuarioContext";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="pt-BR">
      <body
        className={`antialiased bg-[#F5F5F5] h-full`}
      >
        <UsuarioContextoProvider>
          <ProcEditalProvider>
            <div>
              <Toaster closeButton richColors position="top-right" duration={3500} />
            
              <div className="h-full">
                {children}
              </div>
            </div>
          </ProcEditalProvider>
        </UsuarioContextoProvider>
      </body>
    </html>
  );
}
