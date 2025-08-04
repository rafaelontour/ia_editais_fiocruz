import { Fonte } from "../fonte";
import Ramo from "../ramo/Ramo";

export default interface Taxonomia {
    typification_id: string | undefined;
    id?: string;
    title: string;
    description: string;
    source: string[];
    branches?: Ramo[];
    created_at?: string;
    updated_at?: string;
}