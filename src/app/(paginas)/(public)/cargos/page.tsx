"use client";

import { useEffect, useState } from "react";
import { UsuarioCard } from "@/components/usuarios/UsuarioCard";
import { UsuarioUnidade } from "@/core/usuario";
import { getTodasUnidades } from "@/service/unity";
import { getUsuariosUnidade } from "@/service/usuarioUnidade";
import { Unidade } from "@/core/unidade";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Plus, Search } from "lucide-react";
import AdicionarUsuario from "@/components/usuarios/AdicionarUsuario";

export default function AtribuirCargo () {

    const [isDialogAdicionarUsuarioOpen, setIsDialogAdicionarUsuarioOpen] = useState(false);
    const [usuarios, setUsuarios] = useState<UsuarioUnidade[]>([]);
    const [unidades, setUnidades] = useState<Unidade[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const unidadesData = await getTodasUnidades();
                setUnidades(unidadesData);
                if (unidadesData.length > 0) {
                const usuariosData = await getUsuariosUnidade(unidadesData[0].id, unidadesData[0].name);
                console.log(usuariosData)
                setUsuarios(Array.isArray(usuariosData) ? usuariosData : [usuariosData]);
                }
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <p>Carregando...</p>;
    }

    return(
        <div className="flex flex-col gap-8">
            {/* MENU SUPERIOR - ATRIBUIR CARGO */}
            <div className="flex flex-row justify-between w-full">
                <div className="flex flex-row gap-2 items-center">
                    <Button variant={"outline"} size={"icon"} className="cursor-pointer"><ChevronLeft /></Button>
                    <h2 className="text-2xl font-semibold">Gerenciar Usuários</h2>
                </div>
                <div>
                    <Button variant={"outline"} onClick={(e) => {
                        e.preventDefault();
                        setIsDialogAdicionarUsuarioOpen(true);
                    }}
                        className="bg-vermelho text-white items-center cursor-pointer hover:scale-105 hover:bg-vermelho hover:text-white transition-all"
                        >
                        <Plus />
                        <Label>Adicionar Usuário</Label>
                    </Button>
                </div>
            </div>

            {/* FILTRO + BUSCA */}
            <div className="flex flex-row gap-5">
                <div className="flex flex-row gap-2 items-center">
                    <p className="font-semibold">Unidade: </p>
                    <Select>
                        <SelectTrigger className="">
                            <SelectValue placeholder="Selecione a unidade" />
                        </SelectTrigger>
                        <SelectContent >
                            <SelectGroup>
                                <SelectLabel>Unidade</SelectLabel>
                                {unidades.map(u => (
                                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* <div className="relative flex-grow w-full items-center">
                    <Input type={"search"} placeholder="Buscar Usuário" 
                        className="pl-4 pr-10 py-2 w-full rounded-lg"/>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 items-center">
                        <Search size={20}/>
                    </div>
                </div> */}
            </div>

            <div className="p-4 flex flex-wrap gap-4">
                {usuarios.map((usuario) => (
                    <UsuarioCard
                    key={usuario.id}
                    usuario={usuario}
                    unidades={unidades}
                    />
                ))}
            </div>

            <AdicionarUsuario open={isDialogAdicionarUsuarioOpen} onOpenChange={setIsDialogAdicionarUsuarioOpen}/>
        </div>
    );
}
