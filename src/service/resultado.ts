import { Resultado } from "@/core/resultado";

const urlBase = process.env.NEXT_PUBLIC_URL_BASE;

async function buscarResultadosService(params?: {
  test_run_id?: string;
  test_case_id?: string;
  metric_id?: string;
  model_id?: string;
  sort_by?: "created_at" | "updated_at";
  sort_order?: "asc" | "desc";
  offset?: number;
  limit?: number;
}): Promise<{ test_results: Resultado[] }> {
  try {
    const query = new URLSearchParams();

    if (params?.test_run_id) {
      query.append("test_run_id", params.test_run_id);
    }

    if (params?.test_case_id) {
      query.append("test_case_id", params.test_case_id);
    }

    if (params?.metric_id) {
      query.append("metric_id", params.metric_id);
    }

    if (params?.model_id) {
      query.append("model_id", params.model_id);
    }

    query.append("sort_by", params?.sort_by ?? "created_at");
    query.append("sort_order", params?.sort_order ?? "desc");
    query.append("offset", String(params?.offset ?? 0));
    query.append("limit", String(params?.limit ?? 100));

    const response = await fetch(
      `${urlBase}/test-results/?${query.toString()}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar resultados");
    }

    return response.json();
  } catch (error) {
    throw new Error("Erro ao buscar resultados");
  }
}

export { buscarResultadosService };
