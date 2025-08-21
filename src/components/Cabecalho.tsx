'use client'

import useUsuario from "@/data/hooks/useUsuario";
import { IconLogin, IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function Cabecalho() {

    const { usuario, deslogar } = useUsuario()
    const router = useRouter()

    return (
        <header
            className="
                w-full bg-[#F5F5F5] px-3 flex items-center
            "
        >
            <div className="flex items-center">
                <img
                    src={"/logo_ia_editais.png"}
                    alt="Logo"
                    style={{ width: "auto", maxHeight: "32px" }}
                    className="
                        inline-block ml-2
                    "
                />
                <img
                    src={"/logo_fiocruz.png"}
                    alt="Logo"
                    style={{ width: "auto", maxHeight: "60px" }}
                    className="
                        ml-2 inline-block mb-[3px]
                    "
                />
            </div>

            {
                !usuario ?
                <button
                    onClick={() => router.push("/auth/login")}
                    className="
                        flex h-fit ml-auto mr-2 py-[5px] px-4
                        items-center gap-1 bg-vermelho rounded-sm
                        hover:cursor-pointer
                    "
                    style={{
                        boxShadow: "3px 3px 4px rgba(0, 0, 0, 0.25)"
                    }}
                >
                    <IconLogin color="white" size={26} />
                    <p className="text-branco text-sm">Fazer login</p>
                </button>
                :
                <button
                    onClick={() => {
                        router.push("/")
                        deslogar()
                    }}
                    className="
                        flex h-fit ml-auto mr-2 py-[5px] px-4
                        items-center gap-1 bg-vermelho rounded-sm
                        hover:cursor-pointer
                    "
                    style={{
                        boxShadow: "3px 3px 4px rgba(0, 0, 0, 0.25)"
                    }}
                >
                    <IconLogout color="white" size={26} />
                    <p className="text-branco text-sm">Sair</p>
                </button>
            }
        </header>
    )
}