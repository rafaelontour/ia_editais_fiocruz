'use client'

import useUsuario from "@/data/hooks/useUsuario";
import { IconLogin, IconLogout, IconMenu, IconMenu4, IconSignLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Menu, UserCog2Icon } from "lucide-react";
import { Unidade } from "@/core/unidade";
import { useEffect, useState } from "react";
import { getUnidadePorId } from "@/service/unidade";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Cabecalho() {
    const { usuario, deslogar, mensagemLogin, mudarEstadoBarraLateral, barraLateralAberta } = useUsuario();
    const router = useRouter();

    const [montado, setMontado] = useState<boolean>(false);

    const [unidade, setUnidade] = useState<Unidade | null>(null);
    const [cargo, setCargo] = useState<string | null>(null);
    const versaoPlataforma: string | undefined = process.env.NEXT_PUBLIC_VERSAO_PLATAFORMA;

    // Função para buscar dados da unidade e definir cargo
    async function carregarInfoUsuario() {
        if (!usuario) return;

        // Busca unidade
        if (usuario.unit_id) {
            const u = await getUnidadePorId(usuario.unit_id);
            setUnidade(u);
        }

        // Define cargo
        const c = usuario.access_level === "ADMIN" ? "ADMINISTRADOR" :
                  usuario.access_level === "ANALYST" ? "ANALISTA" :
                  usuario.access_level === "AUDITOR" ? "AUDITOR" : "CARGO NÃO DEFINIDO"
        setCargo(c);
    }

    useEffect(() => {
        setMontado(true);
    }, []);

    useEffect(() => {
        carregarInfoUsuario()
    }, [usuario]);

    return (
        <header className="w-full bg-[#F5F5F5] px-4 flex justify-between items-center"
            style={{ boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)" }}
        >

            <div className="flex justify-start items-center gap-2">
                <button
                    onClick={() => mudarEstadoBarraLateral()}
                    className={`rounded-full bg-zinc-200 p-2 -ml-1.5 hover:cursor-pointer`}
                    title={`${barraLateralAberta ? "Recolher menu" : "Expandir menu"}`}
                >
                    <Menu size={25} />
                </button>

                <Link href="/">
                    <img
                        src="/logo_ia_editais.png"
                        alt="Logo"
                        style={{ width: "auto", maxHeight: 32 }}
                        className="inline-block ml-2"
                    />
                </Link>

                <img
                    src="/logo_fiocruz.png"
                    alt="Logo"
                    style={{ width: "auto", maxHeight: 60 }}
                    className="ml-2 inline-block mb-[3px]"
                />
            </div>

            <div className="flex justify-center top-4 -ml-60 items-center">

                {usuario && (
                    <div className="flex items-center gap-2">
                        <div
                            title="Seu cargo/nível de acesso e unidade"
                            style={{ boxShadow: "1px 2px 4px rgba(0, 0, 0, .5)"}}
                            className={`
                                bg-zinc-600  rounded-md flex items-center gap-2 ml-3
                                text-white px-3 py-2 text-sm italic select-none
                                ${unidade ? "transiotion-all duration-500 ease-in-out delay-100" : "opacity-0"}
                                `}
                        >
                            <UserCog2Icon size={16} />
                            <p className="flex items-center">
                                <span className="font-semibold">{cargo}</span>
                                <span className={`${usuario ? "opacity-100" : "opacity-0"}`}>&nbsp;- Unidade {unidade?.name}</span>
                            </p>
                        </div>
                        
                        <motion.div
                            className="italic text-xs relative left-2 top-3.5"
                            animate={{ opacity: 1, y: 0 }}
                            initial={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            Versão da plataforma: { versaoPlataforma }
                        </motion.div>
                    </div>
                )}
            </div>


            {/* Botão login/logout */}

            <div>
                {
                    montado && (
                        !usuario ? (
                            <div className="">
                                <Button
                                    type="button"
                                    onClick={() => router.push("/auth/cadastro")}
                                    variant="destructive"
                                    className="flex h-fit ml-auto mr-2 py-[5px] px-4 items-center gap-1 bg-vermelho rounded-sm hover:cursor-pointer"
                                    style={{ boxShadow: "3px 3px 4px rgba(0, 0, 0, 0.25)" }}
                                >
                                    <p className="text-branco text-sm my-1">Criar conta</p>
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => router.push("/auth/login")}
                                    variant="destructive"
                                    className="flex  mr-2 px-4 items-center gap-1 bg-vermelho rounded-sm hover:cursor-pointer"
                                    style={{ boxShadow: "3px 3px 4px rgba(0, 0, 0, 0.25)" }}
                                >
                                    <IconLogin color="white" size={26} />
                                    <p className="text-branco text-sm ">{mensagemLogin}</p>
                                </Button>
                            </div>
                        ) : (
                            <Button
                                onClick={() => { deslogar(); router.push("/"); }}
                                variant="destructive"
                                className="flex h-fit py-[5px] px-4 items-center gap-1 bg-vermelho rounded-sm hover:cursor-pointer"
                                style={{ boxShadow: "3px 3px 4px rgba(0, 0, 0, 0.25)" }}
                            >
                                <IconLogout color="white" size={26} />
                                <p className="text-branco text-sm mt-1">{mensagemLogin}</p>
                            </Button>
                        )
                    )
                }
            </div>
            
        </header>
    );
}
