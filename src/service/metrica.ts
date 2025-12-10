import { Metrica } from "@/core/metrica";
import { MetricaFormData } from "@/core/schemas/metrica.schema";

const urlBase: string | undefined = process.env.NEXT_PUBLIC_URL_BASE;

async function getMetricasService(): Promise<Metrica[] | undefined> {
  try {
    const response = await fetch(`${urlBase}/metrics`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar métricas");
    }

    const { metrics } = await response.json();

    return metrics as Metrica[];
  } catch (error) {
    console.error("Erro ao buscar métricas", error);
  }
}

async function adicionarMetricaService(
  data: MetricaFormData
): Promise<Metrica | undefined> {
  try {
    const response = await fetch(`${urlBase}/metrics`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        criteria: data.criteria,
        evaluation_steps: data.evaluation_steps,
        threshold: data.threshold,
      }),
    });

    if (!response.ok) {
      throw new Error("Erro ao adicionar métrica");
    }

    const resultado = await response.json();

    return resultado as Metrica;
  } catch (error) {
    console.error("Erro ao adicionar métrica", error);
  }
}

async function atualizarMetricaService(
  id: string,
  data: MetricaFormData
): Promise<Metrica | undefined> {
  try {
    const response = await fetch(`${urlBase}/metrics/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        criteria: data.criteria,
        evaluation_steps: data.evaluation_steps,
        threshold: data.threshold,
      }),
    });
    if (!response.ok) {
      throw new Error("Erro ao atualizar métrica");
    }

    const resultado = await response.json();

    return resultado as Metrica;
  } catch (error) {
    console.error("Erro ao atualizar métrica", error);
  }
}

async function excluirMetricaService(id: string): Promise<boolean | undefined> {
  try {
    const response = await fetch(`${urlBase}/metrics/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Erro ao excluir métrica");
    }
    return response.ok;
  } catch (error) {
    console.error("Erro ao excluir métrica", error);
  }
}

export {
  getMetricasService,
  adicionarMetricaService,
  atualizarMetricaService,
  excluirMetricaService,
};
