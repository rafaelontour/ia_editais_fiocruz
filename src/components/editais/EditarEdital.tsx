"use client";

import { ChevronDown, PencilLine } from "lucide-react";
import { Button } from "../ui/button";
import { FileUpload } from "../ui/file-upload";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Textarea } from "../ui/textarea";

export default function EditarEdital () {
    return(
        <div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant={"outline"} size={"icon"} className="h-6 w-6 p-[14px] border-gray-300 rounded-sm hover:cursor-pointer">
                        <PencilLine/>
                    </Button> 
                </SheetTrigger>
                <SheetContent side="right" className="px-10">
                    <SheetHeader>
                        <SheetTitle className="text-2xl">Edital Fiocruz 2025/1</SheetTitle>
                        <SheetDescription>Editar</SheetDescription>
                    </SheetHeader>
                
                    <div className="space-y-6">
                        <div className="flex flex-row gap-3">
                            <div className="flex flex-col gap-3 w-[60%]">
                                <Label htmlFor="name">Nome do Edital*</Label>
                                <Input id="name" placeholder="Insira o nome do edital"></Input>
                            </div>
                            <div className="flex flex-col gap-3 w-[40%]">
                                <Label htmlFor="unit">Unidade*</Label>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selcione a unidade" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full">
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
                        <div className="flex flex-row gap-3 w-full">
                            <div className="flex flex-col gap-3 w-full">
                                <Label htmlFor="tipe">Tipo*</Label>
                                <Select>
                                    <SelectTrigger className="w-full">
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
                            <div className="flex flex-col gap-3 w-full">
                                <Label htmlFor="date">Data*</Label>
                                <Input id="fate" placeholder="Selecione a data"></Input>
                            </div>
                        </div>
                        <div className="flex flex-row gap-3 w-full">
                            <div className="flex flex-col gap-3 w-[55%]">
                                <Label htmlFor="responsavel">Responsavel*</Label>
                                <Input id="responsavel" placeholder="Informe o responsável"></Input>

                            </div>
                            <div className="flex flex-col gap-3 w-[45%]">
                                <Label htmlFor="date">Número do edital*</Label>
                                <Input id="fate" placeholder="Informe o número do edital"></Input>
                            </div>
                        </div>
                        <div>
                            <Label>Descrição*</Label>
                            <Textarea/>
                        </div>
                        <div className="">
                            <Label>Upload do documento*</Label>
                            <div className="h-16">
                                <FileUpload />
                            </div> 
                        </div>
                    </div>
                
                    <SheetFooter className="flex flex-end justify-end max-w-full">
                        <div className="flex flex-row justify-between">
                            <Label className="flex flex-row">Documentos anteriores</Label>
                            <ChevronDown/>
                        </div>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
}