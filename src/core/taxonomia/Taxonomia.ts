import Ramo from "../ramo/Ramo";

export default interface Taxonomia {
    id: number;
    nome: string;
    descricao: string;
    data: string;
    ramos?: Ramo[];
}