import { TesteFormData } from "@/core/schemas/teste.schema";
import { Teste } from "@/core/teste";

const urlBase: string | undefined = process.env.NEXT_PUBLIC_URL_BASE;

async function getTestesService(): Promise<Teste[] | undefined> {
  try {
    const response = await fetch(`${urlBase}/test-collections`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar testes");
    }

    const { test_collections } = await response.json();

    return test_collections as Teste[];
  } catch (error) {
    console.error("Erro ao buscar testes", error);
  }
}

async function adicionarTesteService(
  data: TesteFormData,
): Promise<Teste | undefined> {
  try {
    const response = await fetch(`${urlBase}/test-collections`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
      }),
    });

    if (response.status === 409) {
      const error: any = new Error("Nome duplicado");
      error.status = 409;
      throw error;
    }

    if (!response.ok) {
      throw new Error("Erro ao adicionar teste");
    }

    const resultado = await response.json();

    return resultado as Teste;
  } catch (error) {
    console.error("Erro ao adicionar teste", error);
    throw error;
  }
}

async function atualizarTesteService(
  id: string,
  data: TesteFormData,
): Promise<Teste | undefined> {
  try {
    const response = await fetch(`${urlBase}/test-collections/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
      }),
    });
    if (!response.ok) {
      throw new Error("Erro ao atualizar teste");
    }
    const resultado = await response.json();

    return resultado as Teste;
  } catch (error) {
    console.error("Erro ao atualizar teste", error);
  }
}

async function excluirTesteService(id: string): Promise<boolean | undefined> {
  try {
    const response = await fetch(`${urlBase}/test-collections/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return response.ok;
  } catch (error) {
    console.error("Erro ao excluir teste", error);
  }
}

export {
  getTestesService,
  adicionarTesteService,
  atualizarTesteService,
  excluirTesteService,
};
