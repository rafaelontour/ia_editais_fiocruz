import z from "zod";

const MetricaSchema = z.object({
  name: z.string().min(1, "O nome da métrica é obrigatório"),
  criteria: z.string().min(1, "O critério da métrica é obrigatório"),
  threshold: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().min(0, "A nota de corte deve ser maior que 0")
  ),
  evaluation_steps: z
    .string()
    .min(1, "Os passos de avaliação são obrigatórios"),
});

export type MetricaFormData = z.infer<typeof MetricaSchema>;
export { MetricaSchema };
