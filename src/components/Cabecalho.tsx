'use client'

import useUsuario from "@/data/hooks/useUsuario";
import { IconLogin, IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { UserCog2Icon } from "lucide-react";
import { Unidade } from "@/core/unidade";
import { useEffect, useState } from "react";
import { getUnidadePorId } from "@/service/unidade";

export default function Cabecalho() {
    const { usuario, deslogar, mensagemLogin } = useUsuario();
    const router = useRouter();

    const [unidade, setUnidade] = useState<Unidade | null>(null);
    const [cargo, setCargo] = useState<string | null>(null);
    const [carregandoInfo, setCarregandoInfo] = useState<boolean>(true);

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
                  usuario.access_level === "AUDITOR" ? "AUDITOR" : "VISITANTE";
        setCargo(c);
    }

    useEffect(() => {
        setCarregandoInfo(true);
        carregarInfoUsuario().finally(() => setCarregandoInfo(false));
    }, [usuario]);

    return (
        <header className="w-full bg-[#F5F5F5] px-3 flex items-center">
            <div className="flex justify-between items-center">
                <img
                    src="/logo_ia_editais.png"
                    alt="Logo"
                    style={{ width: "auto", maxHeight: 32 }}
                    className="inline-block ml-2"
                />
                <img
                    src="/logo_fiocruz.png"
                    alt="Logo"
                    style={{ width: "auto", maxHeight: 60 }}
                    className="ml-2 inline-block mb-[3px]"
                />

                {/* Skeleton ou informação real */}
                {usuario && (
                    <div
                        title="Seu cargo/nível de acesso e unidade"
                        style={{ boxShadow: "1px 2px 4px rgba(0, 0, 0, .5)"}}
                        className={`
                            bg-zinc-600  rounded-md flex items-center gap-2 ml-6
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
                )}
            </div>

            {/* Botão login/logout */}
            {!usuario ? (
                <Button
                    onClick={() => router.push("/auth/login")}
                    variant="destructive"
                    className="flex h-fit ml-auto mr-2 py-[5px] px-4 items-center gap-1 bg-vermelho rounded-sm hover:cursor-pointer"
                    style={{ boxShadow: "3px 3px 4px rgba(0, 0, 0, 0.25)" }}
                >
                    <IconLogin color="white" size={26} />
                    <p className="text-branco text-sm mt-1">{mensagemLogin}</p>
                </Button>
            ) : (
                <Button
                    onClick={() => { deslogar(); router.push("/"); }}
                    variant="destructive"
                    className="flex h-fit ml-auto mr-2 py-[5px] px-4 items-center gap-1 bg-vermelho rounded-sm hover:cursor-pointer"
                    style={{ boxShadow: "3px 3px 4px rgba(0, 0, 0, 0.25)" }}
                >
                    <IconLogout color="white" size={26} />
                    <p className="text-branco text-sm mt-1">{mensagemLogin}</p>
                </Button>
            )}
        </header>
    );
}
