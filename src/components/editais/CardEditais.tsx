import { Calendar, PencilLine, Sparkle, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

export default function CardEditais () {
    return(
        <div className="flex flex-col rounded-md overflow-hidden border-2 border-gray-300 cursor-move">
            <div className="bg-[#dedede]  h-16">

            </div>
            <div className="flex flex-col bg-gray-50 py-2.5 px-3 gap-4">
                <div>
                    <div>Edital Fiocruz 2023/2</div>
                    <div className="flex flex-row justify-between items-center">
                        <p className="text-sm">compras</p>
                        <div className="flex flex-row text-gray-500">
                            <p className="text-[8px]">25/02/2025 </p>
                            <Calendar className="h-3"/>
                        </div>
                    </div>
                </div>
                <div className="flex gap-0.5 justify-end">
                    <Button variant={"outline"} size={"icon"} className="h-6 w-6 border-gray-300"><Sparkle/></Button>
                    <Button variant={"outline"} size={"icon"} className="h-6 w-6 border-gray-300"><PencilLine/></Button>
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <Button variant={"outline"} size={"icon"} className="h-6 w-6 border-gray-300 bg-orange-600 text-white hover:text-black transition-all"><Trash className=""/></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl">
                            <AlertDialogHeader>
                                    <AlertDialogTitle className="text-2xl font-bold">Tem certeza que deseja excluir o edital Edital Fiocruz 2025/1?</AlertDialogTitle>
                                <AlertDialogDescription className="font-bold text-xs">
                                    Após a exclusão, não será possível recuperar os dados desse edital e análise realizada
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction>Excluir edital</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    );
}