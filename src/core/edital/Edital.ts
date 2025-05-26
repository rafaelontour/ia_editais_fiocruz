export type StatusEdital = "rascunho" | "construcao" | "analise" | "concluido";

export default interface Edital {
  id: string;
  titulo: string;
  status: StatusEdital;
  data: string;
  categoria: string;
}