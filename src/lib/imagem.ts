const DIMENSAO_MAXIMA_PADRAO = 512;
const QUALIDADE_PADRAO = 0.85;

function trocarExtensao(nome: string, extensao: string): string {
  const base = nome.replace(/\.[^.]+$/, "").trim() || "imagem";
  return `${base}.${extensao}`;
}

/**
 * Redimensiona e re-encoda a imagem no navegador antes do upload.
 * Sem isso, uma foto de celular de 4MB viaja inteira e ainda vira
 * ~5,3MB de base64 quando guardada em JSON.
 */
export async function comprimirImagem(
  arquivo: File,
  dimensaoMaxima: number = DIMENSAO_MAXIMA_PADRAO,
  qualidade: number = QUALIDADE_PADRAO,
): Promise<File> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(arquivo);
  } catch {
    return arquivo;
  }

  const escala = Math.min(
    1,
    dimensaoMaxima / Math.max(bitmap.width, bitmap.height),
  );
  const largura = Math.max(1, Math.round(bitmap.width * escala));
  const altura = Math.max(1, Math.round(bitmap.height * escala));

  const canvas = document.createElement("canvas");
  canvas.width = largura;
  canvas.height = altura;

  const contexto = canvas.getContext("2d");
  if (!contexto) {
    bitmap.close();
    return arquivo;
  }
  contexto.drawImage(bitmap, 0, 0, largura, altura);
  bitmap.close();

  // PNG só quando a origem é PNG, para não perder transparência.
  const tipo = arquivo.type === "image/png" ? "image/png" : "image/jpeg";
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, tipo, qualidade),
  );
  if (!blob) return arquivo;

  return new File([blob], trocarExtensao(arquivo.name, tipo === "image/png" ? "png" : "jpg"), {
    type: tipo,
  });
}

/** Abre o seletor de arquivos e entrega a imagem já comprimida. */
export function escolherArquivoImagem(
  aoSelecionar: (arquivo: File) => void,
  dimensaoMaxima: number = DIMENSAO_MAXIMA_PADRAO,
): void {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/png,image/jpeg";
  input.onchange = (event) => {
    const arquivo = (event.target as HTMLInputElement).files?.[0];
    if (!arquivo) return;
    void comprimirImagem(arquivo, dimensaoMaxima).then(aoSelecionar);
  };
  input.click();
}

/**
 * O backend devolve o caminho relativo do arquivo (ex: /uploads/<uuid>_a.png),
 * então a origem da API precisa ser prefixada. URLs absolutas e data URLs
 * passam direto.
 */
export function urlImagem(caminho?: string | null): string | null {
  if (!caminho) return null;
  if (/^(https?:|data:|blob:)/.test(caminho)) return caminho;
  return `${process.env.NEXT_PUBLIC_URL_BASE ?? ""}${caminho}`;
}
