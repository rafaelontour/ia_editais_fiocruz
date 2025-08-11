import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Info } from "lucide-react";

interface AdicionarUsuarioProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AdicionarUsuario ({open, onOpenChange}:AdicionarUsuarioProps) {

    const [nomeUsuario, setNomeUsuario] = useState<string>("");
    const [emailUsuario, setEmailUsuario] = useState<string>("");
    const [telWhatsApp, setTelWhatsApp] = useState<string>("");
    const [unidade, setUnidade] = useState<string>("");
    const [perfil, setPerfil] = useState<string>("");

    function limparCampos() {
        setNomeUsuario("");
        setEmailUsuario("");
        setTelWhatsApp("");
        setUnidade("");
        setPerfil("");
    }

    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent onCloseAutoFocus={limparCampos}>
                <DialogHeader className="mb-3">
                    <div className="flex flex-row gap-2 items-center">
                        <DialogTitle>Adicionar usuário</DialogTitle>
                    </div>
                    <DialogDescription>Adicine um usuário</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3">
                    <div className="flex w-full gap-3">
                        <div className="flex w-1/2 flex-col gap-1">
                            <Label>Nome</Label>
                            <Input placeholder="Insira o nome"/>
                        </div>
                        <div className="flex w-1/2 flex-col gap-1">
                            <Label>Email</Label>
                            <Input className="w-full"  placeholder="Insira o email"/>
                        </div>
                    </div>

                    <div className="flex w-full flex-col gap-1 relative">
                        <Label>WhatsApp</Label>
                        <Input placeholder="Insira o telefone do WhatsApp"/>
                        <Tooltip>
                            <TooltipTrigger className="absolute right-4 top-7">
                                <Info className="w-4 h-4"/>
                            </TooltipTrigger>

                            <TooltipContent>
                                <p className="text-xs">O usuário receberá o acesso via WhatsApp!</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                
                    <div className="flex gap-3 items-center">
                        <div className="flex w-1/2 flex-col gap-1">
                            <Label>Unidade</Label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione a unidade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Unidade</SelectLabel>
                                        {Array.from({length:5}).map((_, i) => (
                                            <SelectItem key={i} value="unit">Unidade01</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="flex w-1/2 flex-col gap-1">
                            <Label>Perfil</Label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o perfil" />
                                </SelectTrigger>
                                <SelectContent >
                                    <SelectGroup>
                                        <SelectLabel>Perfil</SelectLabel>
                                        {Array.from({length:5}).map((_, i) => (
                                            <SelectItem key={i} value="unit">Perfil01</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" className="cursor-pointer">Cancelar</Button>
                    </DialogClose>
                    <Button type="submit" className="bg-verde hover:bg-green-900 cursor-pointer">Adicionar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>     
    );
}