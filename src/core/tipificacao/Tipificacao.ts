import { Fonte } from "../fonte";

export interface Tipificacao {
    id: string
    name?: string
    sources?: Fonte[]
    source_ids?: string[];
    taxonomies?: Taxonomia[]
    created_at?: string
    updated_at?: string | null
}

export interface Taxonomia {
    typification_id?: string
    id: string
    title?: string
    description?: string
    branches?: Branch[]
    created_at?: string
    updated_at?: string | null
}

export interface Branch {
    id: string
    title?: string
    description?: string
    evaluation?: {
        feedback: string
        fulfilled: boolean
        score: number
    }
    created_at?: string
    updated_at?: string | undefined
}
