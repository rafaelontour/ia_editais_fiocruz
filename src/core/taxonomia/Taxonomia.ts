import { Fonte } from "../fonte";
import { Ramo } from "../ramo/Ramo";

export interface Taxonomia {
    typification_id: string | undefined;
    id?: string;
    title: string;
    description: string;
    source_ids?: string[];
    sources?: Fonte[];
    branches?: Ramo[];

    created_at?: string;
    updated_at?: string;
}