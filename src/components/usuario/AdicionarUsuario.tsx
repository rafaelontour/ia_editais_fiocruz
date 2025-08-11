import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";

interface AdicionarUsuarioProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AdicionarUsuario ({open, onOpenChange}:AdicionarUsuarioProps) {
    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex flex-row gap-2 items-center">
                        <UserPlus size={20}/>
                        <DialogTitle>Adicionar Usuário</DialogTitle>
                    </div>
                    <DialogDescription>Adicine um usuário</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                        <Label>Nome</Label>
                        <Input placeholder="Insira o nome"/>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label>Email</Label>
                        <Input placeholder="Insira o email"/>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label>Unidade</Label>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione a unidade" />
                            </SelectTrigger>
                            <SelectContent >
                                <SelectGroup>
                                    <SelectLabel>Unidade</SelectLabel>
                                    {Array.from({length:5}).map((_, i) => (
                                        <SelectItem key={i} value="unit">Unidade01</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1">
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