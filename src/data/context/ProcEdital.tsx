import { Edital } from "@/core";
import { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

export interface ProcEditalProps {
    editalProcessado: boolean,
    setEditalProcessado: Dispatch<SetStateAction<boolean>>
    novoEdital: boolean,
    setNovoEdital: Dispatch<SetStateAction<boolean>>
}

export const ProcEditalContexto = createContext<ProcEditalProps | undefined>(undefined);

export function ProcEditalProvider({ children }: { children: ReactNode }) {

    const [editalProcessado, setEditalProcessado] = useState<boolean>(false);
    const [novoEdital, setNovoEdital] = useState<boolean>(false);

    return (
        <ProcEditalContexto.Provider
            value={
                {
                    editalProcessado,
                    setEditalProcessado,
                    novoEdital,
                    setNovoEdital
                }
            }
        >
            {children}
        </ProcEditalContexto.Provider>
    );
}
