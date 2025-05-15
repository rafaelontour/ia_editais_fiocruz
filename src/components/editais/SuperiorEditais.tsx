"use client"

import { ChevronRightIcon } from "lucide-react";
import CategoriaColor from "./CategoriaColor";
import { Button } from "../ui/button";
//import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
//import { Input } from "../ui/input";
//import { Label } from "@radix-ui/react-label";
//import { Textarea } from "../ui/textarea";
//import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
//import { FileUpload } from "../ui/file-upload";
import AdicionarEdital from "./AdicionarEdital";

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
                <div className="w-full">
                    <AdicionarEdital />
                </div>
            </div>
        </div>
    );
}