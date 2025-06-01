import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "IA Editais",
  description: "Análise inteligente de editais com inteligência artificial.",
  icons: {
    icon: "/favicon.png",
  }
};

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
        {children}
      </body>
    </html>
  );
}
