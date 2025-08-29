export type StatusEdital = "rascunho" | "construcao" | "analise" | "concluido";

export default interface Edital {
  id: string;
  name: string;
  typification: string[];
  created_at: string;
}