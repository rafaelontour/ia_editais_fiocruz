"use client"

import { ChevronRightIcon } from "lucide-react";
import CategoriaColor from "./CategoriaColor";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { FileUpload } from "../ui/file-upload";

export default function SuperiorEditais () {

    const status = [
        { nome:"Retrabalhando", color:"green" },
        { nome:"Retrabalhar", color:"red" }
    ]

    return(
        <div className="flex felx-row justify-between items-center gap-5 px-2 h-12">
            <div className="flex flex-row gap-7 items-center">
                <Button variant={"outline"} size={"icon"}> <ChevronRightIcon /> </Button>
                <h2 className="text-2xl font-bold">Meus editais</h2>
            </div>
            <div className="flex flex-row gap-7 items-center">
                <div className="text-slate-400 flex gap-5 text-sm">
                    <p>Legendas:</p>
                    <CategoriaColor categoria={status}/>
                
                </div>
                <Sheet>
                    <SheetTrigger>
                        <Button variant={"outline"}>Enviar novo edital</Button> {/* ADICIONAR ÍCONE */}
                    </SheetTrigger>
                    <SheetContent side="right" className="w-1/2 max-w-[50%]">
                        <SheetHeader>
                            <SheetTitle className="text-2xl">Adicionar</SheetTitle>
                            <SheetDescription>Edital</SheetDescription>
                        </SheetHeader>
                    
                        <div className="px-4 space-y-6">
                            <div className="flex flex-row gap-3">
                                <div className="w-[85%]">
                                    <Label htmlFor="name">Nome do Edial</Label>
                                    <Input id="name" placeholder="Insira o nome do edital"></Input>
                                </div>
                                <div>
                                    <Label htmlFor="unit">Unidade*</Label>
                                    <Select>
                                        <SelectTrigger className="">
                                            <SelectValue placeholder="Selcione a unidade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Unidade</SelectLabel>
                                                <SelectItem value="unit">Unidade01</SelectItem>
                                                <SelectItem value="unit">Unidade02</SelectItem>
                                                <SelectItem value="unit">Unidade03</SelectItem>
                                                <SelectItem value="unit">Unidade04</SelectItem>
                                                <SelectItem value="unit">Unidade05</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex flex-row gap-3">
                                <div>
                                    <Label htmlFor="tipe">Tipo</Label>
                                    <Select>
                                        <SelectTrigger className="">
                                            <SelectValue placeholder="Selcione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>tipo</SelectLabel>
                                                <SelectItem value="type">tipo01</SelectItem>
                                                <SelectItem value="type">tipo02</SelectItem>
                                                <SelectItem value="type">tipo03</SelectItem>
                                                <SelectItem value="type">tipo04</SelectItem>
                                                <SelectItem value="type">tipo05</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                </div>
                                <div>
                                    <Label htmlFor="date">Data</Label>
                                    <Input id="fate" placeholder="Selecione a data"></Input>
                                </div>
                            </div>
                            <div className="flex flex-row gap-3">
                                <div>
                                    <Label htmlFor="responsavel">Responsavel*</Label>
                                    <Input id="responsavel" placeholder="Informe o responsável"></Input>

                                </div>
                                <div>
                                    <Label htmlFor="date">Número do edital*</Label>
                                    <Input id="fate" placeholder="Informe o número do edital"></Input>
                                </div>
                            </div>
                            <div>
                                <Label>Descrição</Label>
                                <Textarea/>
                            </div>
                            <div className="">
                                <Label>Upload do documento*</Label>
                                <div className="h-16">
                                    <FileUpload />
                                </div> 
                            </div>
                        </div>
                    
                        <SheetFooter className="flex flex-end justify-end max-w-40">
                            <Button>Salvar Edital</Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}