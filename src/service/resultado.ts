const urlBase = process.env.NEXT_PUBLIC_URL_BASE;

async function buscarResultadosService(params?: {
  test_run_id?: string;
  offset?: number;
  limit?: number;
}) {
  try {
    const query = new URLSearchParams();

    if (params?.test_run_id) {
      query.append("test_run_id", params.test_run_id);
    }

    query.append("offset", String(params?.offset ?? 0));
    query.append("limit", String(params?.limit ?? 100));

    const response = await fetch(
      `${urlBase}/test-results/?${query.toString()}`,
      {
        method: "GET",
        credentials: "include",
      }
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
