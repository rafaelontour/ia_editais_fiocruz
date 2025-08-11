
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "lucide-react";


interface AdicionarUsuarioProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AdicionarUsuario ({open, onOpenChange}:AdicionarUsuarioProps) {
    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <User />
                        Adicionar Usuário
                    </DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>     
    );
}