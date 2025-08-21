'use client'

import "@/app/globals.css";
import { UsuarioContextoProvider } from "@/data/context/UsuarioContext";
import { useState } from "react";
import { Toaster } from "sonner";

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
          <Toaster richColors position="top-right" duration={3000} />
          
          <div>
            {children}
          </div>
        </UsuarioContextoProvider>
      </body>
    </html>
  );
}
