import Head from "next/head";
import Logos from "./Logos";

export const metadata = {
  title: "Autenticação - IAEditais",
  description: "Faça login na plataforma",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex bg-branco h-screen">
      <Head>
        <title>Autenticação - IAEditais</title>
      </Head>

      {/* Lado esquerdo com animações */}
      <div className="flex gap-10 justify-center items-center flex-col p-24 bg-zinc-400 text-branco w-full h-full">
        <Logos />
      </div>

      {/* Conteúdo dinâmico */}
      <div className="h-full w-full">{children}</div>
    </div>
  );
}
