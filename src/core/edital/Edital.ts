import { UsuarioUnidade } from "../usuario";

export type StatusEdital = "PENDING" | "UNDER_CONSTRUCTION" | "WAITING_FOR_REVIEW" | "COMPLETED";

export interface Comentarios {
    messages: Comentario[]
}

export interface Comentario {
    id?: string;
    content?: string;
    mentions?: [
        {
            id: string;
            type: string;
            label: string;
        }
    ]
    quoted_message?: {
        id: string;
        content_preview: string;
        author: UsuarioUnidade;
    }
    author?: UsuarioUnidade;
    document_id?: string;
    release_id?: string;
    created_at?: string;
    updated_at?: string | null;

}

export interface EditalHistory {
    id: string;
    status: StatusEdital;
    created_at: string;
    updated_at: string | null;
    messages: Comentario[]
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
