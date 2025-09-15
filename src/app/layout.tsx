'use client'

import "@/app/globals.css";
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
        className={`antialiased bg-[#F5F5F5] `}
      >
        <UsuarioContextoProvider>
          <div>
            <Toaster richColors position="top-right" duration={3000} />
            
            <div>
              {children}
            </div>
          </div>
        </UsuarioContextoProvider>
      </body>
    </html>
  );
}
