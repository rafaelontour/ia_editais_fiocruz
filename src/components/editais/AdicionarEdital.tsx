import { Upload } from "lucide-react";
import { Button } from "../ui/button";
import { FileUpload } from "../ui/file-upload";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Textarea } from "../ui/textarea";

export default function AdicionarEdital () {
    return(
        <div className="">
            <Sheet>
                <SheetTrigger>
                    <Button variant={"outline"} className="bg-vermelho text-white hover:text-black"> {/* AJEITAR ÍCONE */}
                        <Upload className=""/>
                        <p>Enviar novo edital</p>
                    </Button> 
                </SheetTrigger>
                <SheetContent side="right" className="w-full px-10">
                    <SheetHeader>
                        <SheetTitle className="text-2xl">Adicionar</SheetTitle>
                        <SheetDescription>Edital</SheetDescription>
                    </SheetHeader>
                
                    <div className="space-y-6">
                        <div className="flex flex-row gap-5 w-full">
                            <div className="flex flex-col gap-3 w-[60%]">
                                <Label htmlFor="name">Nome do Edial*</Label>
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
                        <div className="flex flex-row gap-5 w-full">
                            <div className="flex flex-col gap-3 w-full">
                                <Label htmlFor="tipe">Tipo</Label>
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
                                <Label htmlFor="date">Data</Label>
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
                        <div className="flex flex-col gap-3">
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
                
                    <SheetFooter className="flex w-full justify-end">
                        <Button className="bg-orange-600 text-white w-fit hover:text-black transition-all ml-auto">
                            <Upload/>
                            <p>Salvar Edital</p>
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
}