const urlBase = process.env.NEXT_PUBLIC_URL_BASE;

export async function executarTesteService(
  payload: { test_case_id: string; metric_ids: string[] },
  file: File
) {
  try {
    const formData = new FormData();

    formData.append("payload", JSON.stringify(payload));
    formData.append("file", file);

    for (const pair of formData.entries()) {
      console.log("FORMDATA:", pair[0], pair[1]);
    }

    const response = await fetch(`${urlBase}/test-runs/`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const erro = await response.text();
      console.error("BACKEND ERROR DETAIL:", erro);
      throw new Error("Falha ao executar teste");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao executar teste:", error);
    return undefined;
  }
}
