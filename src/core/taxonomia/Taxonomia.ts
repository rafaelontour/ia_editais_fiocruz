import { Fonte } from "../fonte";
import { Ramo } from "../ramo/Ramo";
import { Branch } from "../tipificacao/Tipificacao";

export interface Taxonomia {
    typification_id?: string | undefined;
    id?: string;
    title?: string;
    description?: string;
    source_ids?: string[];
    sources?: Fonte[];
    branches?: Branch[] | string[];
    tip_assoc?: string;
    tip_assoc_id?: string;
    created_at?: string;
    updated_at?: string | undefined;
}