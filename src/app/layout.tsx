'use client'

import "@/app/globals.css";
import { UsuarioContextoProvider } from "@/data/context/UsuarioContext";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [teste, setTeste] = useState<boolean>(false)
  
  return (
    <html lang="pt-BR">
      <body
        className={`antialiased bg-[#F5F5F5] `}
      >
        <UsuarioContextoProvider>
          {
            teste
            ?
            <div>
              Teste funcionando
            </div>
            :
            <div>
              {children}
            </div>
          }
        </UsuarioContextoProvider>
      </body>
    </html>
  );
}
