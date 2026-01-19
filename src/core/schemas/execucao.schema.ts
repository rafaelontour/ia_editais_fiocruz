import z, { uuid } from "zod";

const ExecucaoSchema = z.object({
  metric_ids: z.array(z.string()).min(1, "Selecione uma métrica"),
  model_id: z.string().uuid("Selecione um modelo de IA"),
  file: z.instanceof(File, { message: "Envie o edital" }),
});

export type ExecucaoFormData = z.infer<typeof ExecucaoSchema>;

export { ExecucaoSchema };
