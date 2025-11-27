export interface Caso {
  id: number;
  nome: string;
  taxonomia: string;
  ramo: string;
  teste: string;
  conformidade: string;
  feedbackEsperado: string;
  textoEntrada: string;
  created_at?: string;
}
