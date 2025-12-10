import z from "zod";

const CasoSchema = z.object({
  name: z.string().min(1, "O nome do caso é obrigatório"),
  taxonomy_id: z.string().min(1, "A taxonomia do caso é obrigatória"),
  typification_id: z.string().min(1, "A tipificação do caso é obrigatória"),
  branch_id: z.string().min(1, "O ramo do caso é obrigatório"),
  test_collection_id: z.string().min(1, "O teste do caso é obrigatório"),
  doc_id: z.string().min(1, "O edital do caso é obrigatório"),
  expected_fulfilled: z.string().superRefine((v, ctx) => {
    if (v !== "true" && v !== "false") {
      ctx.addIssue({
        code: "custom",
        message: "A conformidade do caso é obrigatória",
      });
    }
  }),

  expected_feedback: z
    .string()
    .min(1, "O feedback esperado do caso é obrigatório"),
  input: z.string().min(1, "O texto de entrada do caso é obrigatório"),
});

export type CasoFormData = z.infer<typeof CasoSchema>;

export { CasoSchema };
