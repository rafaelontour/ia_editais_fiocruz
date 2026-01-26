import { Caso } from "@/core/caso";
import { CasoFormData } from "@/core/schemas/caso.schema";

const urlBase: string | undefined = process.env.NEXT_PUBLIC_URL_BASE;

async function buscarCasoService(): Promise<Caso[] | undefined> {
  try {
    const response = await fetch(`${urlBase}/test-cases`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar casos");
    }

    const { test_cases } = await response.json();

    return test_cases as Caso[];
  } catch (error) {
    console.error("Erro ao buscar casos", error);
  }
}

async function buscarCasoPorColecaoService(
  collectionId: string,
): Promise<Caso[] | undefined> {
  try {
    const response = await fetch(
      `${urlBase}/test-cases?test_collection_id=${collectionId}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar casos");
    }

    const { test_cases } = await response.json();

    return test_cases as Caso[];
  } catch (error) {
    console.error("Erro ao buscar casos", error);
  }
}

async function adicionarCasoService(data: CasoFormData) {
  const response = await fetch(`${urlBase}/test-cases`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.name,
      test_collection_id: data.test_collection_id,
      branch_id: data.branch_id,
      // doc_id: data.doc_id,
      //input: data.input,
      expected_feedback: data.expected_feedback,
      expected_fulfilled: data.expected_fulfilled,
    }),
  });

  if (!response.ok) {
    throw new Error("Erro ao adicionar caso");
  }

  const resultado = await response.json();

  return resultado as Caso;
}

async function atualizarCasoService(
  test_case_id: string,
  data: CasoFormData,
): Promise<Caso | undefined> {
  try {
    const response = await fetch(`${urlBase}/test-cases/${test_case_id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        test_collection_id: data.test_collection_id,
        branch_id: data.branch_id,
        // doc_id: data.doc_id,
        //input: data.input,
        expected_feedback: data.expected_feedback,
        expected_fulfilled: data.expected_fulfilled,
      }),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar caso de teste");
    }
    const dados = await response.json();

    return dados as Caso;
  } catch (error) {
    console.error("Erro ao atualizar caso de teste", error);
  }
}

async function excluirCasoService(id: string): Promise<boolean | undefined> {
  try {
    const response = await fetch(`${urlBase}/test-cases/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    return response.ok;
  } catch (error) {
    console.error("Erro ao excluir caso de teste");
  }
}

export {
  buscarCasoService,
  buscarCasoPorColecaoService,
  adicionarCasoService,
  atualizarCasoService,
  excluirCasoService,
};
