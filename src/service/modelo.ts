import { Modelo } from "@/core/modelo";
import { ModeloFormData } from "@/core/schemas/modelo.schema";

const urlBase: string | undefined = process.env.NEXT_PUBLIC_URL_BASE;

async function getModeloService(): Promise<Modelo[] | undefined> {
  try {
    const response = await fetch(`${urlBase}/models`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar modelos de ia");
    }

    const { ai_models } = await response.json();

    return ai_models as Modelo[];
  } catch (error) {
    console.error("Erro ao buscar modelos", error);
  }
}

async function adicionarModeloService(
  data: ModeloFormData
): Promise<Modelo | undefined> {
  try {
    const response = await fetch(`${urlBase}/models`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        code_name: data.code_name,
      }),
    });

    if (!response.ok) {
      throw new Error("Erro ao adicionar modelo de ia");
    }

    const resultado = await response.json();

    return resultado as Modelo;
  } catch (error) {
    console.error("Erro ao adicionar modelo", error);
  }
}

async function excluirModeloService(id: string): Promise<boolean | undefined> {
  try {
    const response = await fetch(`${urlBase}/models/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    return response.ok;
  } catch (error) {
    console.error("Erro ao excluir modelo de ia", error);
  }
}

async function atualizarModeloService(
  id: string,
  data: ModeloFormData
): Promise<Modelo | undefined> {
  try {
    const response = await fetch(`${urlBase}/models/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: data.name, code_name: data.code_name }),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar modelo de ia");
    }

    const resultado = await response.json();

    return resultado as Modelo;
  } catch (error) {
    console.error("Erro ao atualizar modelo de ia", error);
  }
}

export {
  getModeloService,
  adicionarModeloService,
  excluirModeloService,
  atualizarModeloService,
};
