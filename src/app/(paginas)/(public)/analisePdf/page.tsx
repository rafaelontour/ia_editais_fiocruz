import { ChevronLeft } from "lucide-react";

export default function AnalisePdf() {
  return (
    <div className="flex flex-col w-full min-h-screen p-6">
      <header className="flex items-center gap-4 mb-6">
        <button className="flex items-center justify-center h-8 w-8 bg-white rounded-sm border border-gray-300 ml-4 hover:cursor-pointer">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold">INSTRUÇÃO NORMATIVA 05/2017 SLTI</h1>
      </header>

      <main className="flex flex-1 gap-8">
        <section className="flex-1 basis-1/2 bg-white shadow-md rounded-lg p-6">
          <div className="h-full border border-gray-200 rounded-lg overflow-hidden">
            <iframe
              src="pdf-teste.pdf" 
              className="w-full h-full"
              title="PDF do Fonte"
            ></iframe>
          </div>
        </section>

        <section className="flex-1 basis-1/2 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Descrição</h2>
          <p className="text-gray-700 text-sm mb-8">
            Dispõe sobre as regras e diretrizes do procedimento de contratação de serviços sob o
            regime de execução indireta no âmbito da Administração Pública federal direta,
            autárquica e fundacional.
          </p>
          <h2 className="text-lg font-semibold mb-2">Criação</h2>
          <p className="text-gray-500 text-sm">14/03/2025 16:36:53</p>
        </section>
      </main>
    </div>
  );
}
