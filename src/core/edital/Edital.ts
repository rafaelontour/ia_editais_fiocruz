export type StatusEdital = "PENDING" | "UNDER_CONSTRUCTION" | "WAITING_FOR_REVIEW" | "COMPLETED";

export default interface Edital {
  id: string;
  name?: string;
  identifier?: string;
  description?: string;
  status?: StatusEdital;
  editors?: string[];
  typification?: string[];
  created_at?: string;
  updated_at?: string;
}