import { Fonte } from "../fonte";
import Ramo from "../ramo/Ramo";

export default interface Taxonomia {
    typification_id: string;
    id?: string;
    title: string;
    description: string;
    source: Fonte[] | string[];
    branches?: Ramo[];
    created_at?: string;
    updated_at?: string;
}