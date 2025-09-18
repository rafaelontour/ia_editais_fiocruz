export interface Tipificacao {
    id: string
    name: string
    sources?: string[]
    source_ids?: string[];
    taxonomies?: Taxonomia[]
    created_at?: string
    updated_at?: string | null
}

export interface Taxonomia {
    id: string
    title: string
    description: string
    branches: Branch[]
    created_at?: string
    updated_at?: string | null
}

export interface Branch {
    id: string
    title: string
    description: string
    created_at?: string
    updated_at?: string | null
}
