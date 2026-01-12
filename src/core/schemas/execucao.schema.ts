import z from "zod";

const ExecucaoSchema = z.object({
  metrica_id: z.array(z.string()).min(1, "Selecione uma métrica"),
});

export type ExecucaoFormData = z.infer<typeof ExecucaoSchema>;

export { ExecucaoSchema };
