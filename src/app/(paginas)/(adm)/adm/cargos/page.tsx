'use client'

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdicionarUsuario from "@/components/usuarios/AdicionarUsuario";
import { UsuarioCard } from "@/components/usuarios/UsuarioCard";
import { Unidade } from "@/core/unidade";
import { UsuarioUnidade } from "@/core/usuario";
import { getTodasUnidades } from "@/service/unidade";
import { getUsuariosPorUnidade } from "@/service/usuario";
import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AtribuirCargo () {

    const [isDialogAdicionarUsuarioOpen, setIsDialogAdicionarUsuarioOpen] = useState<boolean>(false);
    const [usuariosDaUnidade, setUsuariosDaUnidade] = useState<UsuarioUnidade[] | undefined>([]);
    const [unidades, setUnidades] = useState<Unidade[]>([]);
    const [idUnidadeSelecionada, setIdUnidadeSelecionada] = useState<string | undefined>("");

    async function buscarTodasUnidades() {
        const unidades = await getTodasUnidades();
        setUnidades(unidades);
    }

    async function buscarUsuariosDaUnidade(unidadeId: string | undefined) {
        const usuarios = await getUsuariosPorUnidade(unidadeId);
        setUsuariosDaUnidade(usuarios);
    }
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                await buscarTodasUnidades();
            } catch (error) {
                toast.error("Erro ao carregar unidades");
            } 
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (idUnidadeSelecionada) {
            buscarUsuariosDaUnidade(idUnidadeSelecionada);
        }
    }, [idUnidadeSelecionada])

    return(
        <div className="flex flex-col gap-8">
            {/* MENU SUPERIOR - ATRIBUIR CARGO */}
            <div className="flex flex-row justify-between w-full">
                <div className="flex flex-row gap-2 items-center">
                    {/* <Button variant={"outline"} size={"icon"} className="cursor-pointer"><ChevronLeft /></Button> */}
                    <h2 className="text-4xl font-semibold">Gerenciar usuários</h2>
                </div>
                
                <Button
                    variant={"destructive"}
                    style={{ boxShadow: "0 0 3px rgba(0,0,0,.5)" }}
                    className={`
                        flex rounded-md gap-2 items-center px-4 py-2
                        bg-vermelho text-white
                        hover:cursor-pointer
                    `}
                    onClick={(e) => {
                        e.preventDefault();
                        setIsDialogAdicionarUsuarioOpen(true);
                    }}
                >
                    <UserPlus size={18} />
                    <span className="text-sm">Adicionar usuário</span>
                </Button>
            </div>

            {/* FILTRO + BUSCA */}
            <div className="flex flex-row gap-5">
                <div className="flex flex-row gap-2 items-center">
                    <p className="font-semibold text-xl">Unidade: </p>
                    <Select
                        onValueChange={(value) => {
                            setIdUnidadeSelecionada(value);
                        }}
                    >
                        <SelectTrigger className="text-md">
                            <SelectValue placeholder="Selecione a unidade" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Unidade</SelectLabel>
                                {unidades.map(u => (
                                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className={`${idUnidadeSelecionada !== "" && (usuariosDaUnidade && usuariosDaUnidade.length > 0) ? "grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-0.5" : "flex w-full justify-center"}`}>
                {
                    idUnidadeSelecionada !== "" ? (
                        usuariosDaUnidade && usuariosDaUnidade.length > 0 ? (
                            usuariosDaUnidade?.map((usuario) => (
                                <UsuarioCard
                                    key={usuario.id}
                                    usuario={usuario}
                                    unidades={unidades}
                                    buscarUsuarios={buscarUsuariosDaUnidade}
                                />
                            ))
                        ) : (
                            <p className="w-full text-gray-500 animate-pulse transition-all text-center">
                                Nenhum usuário cadastrado nessa unidade
                            </p>
                        )
                    ) : (
                        <p className="w-full text-gray-500 animate-pulse transition-all text-center">
                            Selecione uma unidade para exibir os usuários
                        </p>
                    )
                }
            </div>

            <AdicionarUsuario unidade={idUnidadeSelecionada} atualizarUsuariosUnidade={buscarUsuariosDaUnidade} unidades={unidades} open={isDialogAdicionarUsuarioOpen} onOpenChange={setIsDialogAdicionarUsuarioOpen}/>
        </div>
    );
}
