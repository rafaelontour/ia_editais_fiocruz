export interface Fonte {
    id: string;
    name: string;
    description?: string;
    has_file?: boolean;
    file_path?: string | null;
    created_at?: string;
    updated_at?: string;
}
