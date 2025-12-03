import z from "zod";

const CasoSchema = z.object({
  name: z.string().min(1, "O nome do caso é obrigatório"),
  taxonomia: z.string().min(1, "A taxonomia do caso é obrigatória"),
  tipificacao: z.string().min(1, "A tipificação do caso é obrigatória"),
  ramo: z.string().min(1, "O ramo do caso é obrigatório"),
  teste: z.string().min(1, "O teste do caso é obrigatório"),
  conformidade: z.string().min(1, "A conformidade do caso é obrigatória"),
  feedbackEsperado: z
    .string()
    .min(1, "O feedback esperado do caso é obrigatório"),
  textoEntrada: z.string().min(1, "O texto de entrada do caso é obrigatório"),
});

export type CasoFormData = z.infer<typeof CasoSchema>;

export { CasoSchema };
