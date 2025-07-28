import { Fonte } from "../fonte";

export default interface Tipificacao {
    id: string;
    name: string;
    sources: Fonte[];
    created_at: string;
    updated_at: string;
}