import z from "zod";

const ModeloSchema = z.object({
  name: z.string().min(1, "O nome do modelo é obrigatório"),
  code_name: z.string().min(1, "O codinome do modelo é obrigatório"),
});

export type ModeloFormData = z.infer<typeof ModeloSchema>;
export { ModeloSchema };
