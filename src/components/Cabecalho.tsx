'use client'

import useUsuario from "@/data/hooks/useUsuario";
import { IconLogin, IconLogout, IconUsersGroup } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { UserCheck, UserCog2Icon } from "lucide-react";

export default function Cabecalho() {

    const { usuario, deslogar, mensagemLogin } = useUsuario()
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

                {
                    usuario && (
                        <div
                            title="Seu cargo/nível de acesso"
                            className="
                                bg-vermelho rounded-md flex items-center gap-2
                                text-white px-3 py-2 text-sm italic ml-4 select-none
                            "
                            style={{
                                boxShadow: "3px 3px 4px rgba(0, 0, 0, 0.25)"
                            }}
                        >
                            <UserCog2Icon size={16} />
                            <p>
                                {usuario && usuario.access_level === "ADMIN" ? "ADMINISTRADOR" : usuario.access_level === "ANALYST" ? "ANALISTA" : "AUDITOR"}
                            </p> 
                        </div>
                    )
                }
            </div>

            {
                !usuario ?
                    <Button
                        onClick={() => router.push("/auth/login")}
                        variant={"destructive"}
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
                        <p className="text-branco text-sm mt-1">{mensagemLogin}</p>
                    </Button>
                    :
                    <Button
                        onClick={() => {
                            router.push("/")
                            deslogar()
                        }}
                        variant={"destructive"}
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
                        <p className="text-branco text-sm mt-1">{mensagemLogin}</p>
                    </Button>
            }
        </header>
    )
}