import { UsuarioUnidade } from "../usuario";

export type StatusEdital = "PENDING" | "UNDER_CONSTRUCTION" | "WAITING_FOR_REVIEW" | "COMPLETED";

export interface EditalHistory {
    id: string;
    status: StatusEdital;
    created_at: string;
    updated_at: string | null;
}

export interface EditalTypification {
    id: string;
    name: string;
    sources: any[];
    taxonomies: any[];
    created_at?: string;
    updated_at?: string | null;
}

export interface Edital {
    id: string;
    name?: string;
    identifier?: string;
    description?: string;
    status?: StatusEdital;
    editors?: UsuarioUnidade[];
    typification?: string[];
    history?: EditalHistory[];
    typifications?: EditalTypification[];
    created_at?: string;
    updated_at?: string | null;
}

export interface EditalArquivo {
    releases: [
        {
            id: string;
            file_path: string;
            description: string;
            check_tree: EditalTypification[]
            created_at: string;
        }
    ]
}

export interface ListaEditais {
    documents: Edital[];
}
