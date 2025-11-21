"use client";
import BarraDePesquisa from "@/components/BarraDePesquisa";
import Masonry from "react-masonry-css";

export default function resultados() {
  const mockResultados = [
    {
      nome: "Caso de teste de não conformidades para SIFAC",
      modeloIa: "GPT-5",
      notaCorte: "0.7",
      scoreFeedback: "0.87",
      atualFeedback:
        "O critério específico, que envolve o cadastro no SICAF e a compatibilidade do ramo de atividade com o objeto da licitação, não foi explicitamente mencionado no documento analisado. Contudo, partes do texto destacam a importância da habilitação, regularidade e qualificação técnica, mas não fazem referência direta ao SICAF ou à necessidade de cadastro prévio. A inclusão desse critério é crucial para garantir que os licitantes atendam aos requisitos legais e operacionais adequados para participar, proporcionando maior transparência e eficiência no processo licitatório. Para aprimorar a inclusão desse critério, recomenda-se a adição de uma seção específica que mencione claramente a necessidade de cadastramento no SICAF e a validação da compatibilidade do ramo de atividade do licitante com o objeto da licitação.",
      reasonFeedback:
        "O output aborda todos os pontos principais, identificando que o critério de cadastro no SICAF e compatibilidade do ramo de atividade não foi explicitamente mencionado no documento, alinhando-se ao esperado. Além disso, sugere melhorias, indo além do esperado. No entanto, há uma leve diferença de detalhamento em relação ao esperado, pois o output traz recomendações adicionais, mas não há informações faltando sobre a ausência do critério.",
      tag: "Aprovado",
    },
    {
      nome: "Caso de teste de não conformidades para SIFAC",
      modeloIa: "GPT-5",
      notaCorte: "0.7",
      scoreFeedback: "0.87",
      atualFeedback:
        "O critério específico, que envolve o cadastro no SICAF e a compatibilidade do ramo de atividade com o objeto da licitação, não foi explicitamente mencionado no documento analisado. Contudo, partes do texto destacam a importância da habilitação, regularidade e qualificação técnica, mas não fazem referência direta ao SICAF ou à necessidade de cadastro prévio. A inclusão desse critério é crucial para garantir que os licitantes atendam aos requisitos legais e operacionais adequados para participar, proporcionando maior transparência e eficiência no processo licitatório. Para aprimorar a inclusão desse critério, recomenda-se a adição de uma seção específica que mencione claramente a necessidade de cadastramento no SICAF e a validação da compatibilidade do ramo de atividade do licitante com o objeto da licitação.",
      reasonFeedback:
        "O output aborda todos os pontos principais, identificando que o critério de cadastro no SICAF e compatibilidade do ramo de atividade não foi explicitamente mencionado no documento, alinhando-se ao esperado. Além disso, sugere melhorias, indo além do esperado. No entanto, há uma leve diferença de detalhamento em relação ao esperado, pois o output traz recomendações adicionais, mas não há informações faltando sobre a ausência do critério.",
      tag: "Reprovado",
    },
  ];

  const breakpointColumns = {
    default: 1,
  };

  return (
    <div className="flex flex-col gap-5 pd-10">
      <h2 className="text-4xl font-bold">Gestão dos resultados</h2>

      <BarraDePesquisa />

      <Masonry
        breakpointCols={breakpointColumns}
        className="flex gap-5 mb-10 px-1"
      >
        {mockResultados.map((mockResultado) => (
          <div
            className="flex  gap-2 rounded-md p-4 w-full transition ease-in-out duration-100 mb-3 pb-8 justify-between"
            style={{ boxShadow: "0 0 5px rgba(0,0,0,.3)" }}
          >
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold">{mockResultado.nome}</h2>
              <div className="flex flex-row gap-3">
                <p>
                  <span className="font-semibold">Modelo ia:</span>{" "}
                  {mockResultado.modeloIa}
                </p>
                <p>
                  <span className="font-semibold">Nota de corte:</span>{" "}
                  {mockResultado.notaCorte}
                </p>
                <p>
                  <span className="font-semibold">Score feedback:</span>{" "}
                  {mockResultado.scoreFeedback}
                </p>
              </div>
            </div>
            <button
              className=" flex rounded-md gap-2 items-center px-4 py-2
                bg-vermelho  text-white
                hover:cursor-pointer w-fit h-fit"
            >
              {mockResultado.tag}
            </button>
          </div>
        ))}
      </Masonry>
    </div>
  );
}
