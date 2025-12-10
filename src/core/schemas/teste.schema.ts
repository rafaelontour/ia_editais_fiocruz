import z from "zod";

const TesteSchema = z.object({
  name: z.string().min(1, "O nome do teste é obrigatório"),
  description: z.string().min(1, "A descrição do teste é obrigatória"),
});

export type TesteFormData = z.infer<typeof TesteSchema>;
export { TesteSchema };
