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
    created_at: string;
    updated_at: string | null;
}

export interface Edital {
    id: string;
    name?: string;
    identifier?: string;
    description?: string;
    status?: StatusEdital;
    editors?: string[];
    typification?: string[];
    history?: EditalHistory[];
    typifications?: EditalTypification[];
    created_at?: string;
    updated_at?: string | null;
}

export interface ListaEditais {
    documents: Edital[];
}
