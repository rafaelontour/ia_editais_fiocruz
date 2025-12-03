import z from "zod";

const MetricaSchema = z.object({
  name: z.string().min(1, "O nome da métrica é obrigatório"),
  modelo: z.string().min(1, "O modelo da métrica é obrigatório"),
  criterio: z.string().min(1, "O critério da métrica é obrigatório"),
  notaCorte: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().min(1, "A nota de corte deve ser maior que 0")
  ),
  passosAvaliacao: z.string().min(1, "Os passos de avaliação são obrigatórios"),
});

export type MetricaFormData = z.infer<typeof MetricaSchema>;
export { MetricaSchema };
