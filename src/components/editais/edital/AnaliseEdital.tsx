import { Edital } from "@/core";
import Linha01 from "./analiselinhas/Linha01";
import Linha02 from "./analiselinhas/Linha02";
import Linha03 from "./analiselinhas/Linha03";
import { EditalArquivo, EditalRelease } from "@/core/edital/Edital";
import type { DestinoPagina } from "@/lib/utils";

interface Props {
  edital: Edital | undefined;
  editalArquivo: EditalArquivo | undefined;
  resumoIA?: string;
  versoes?: EditalRelease[];
  versaoSelecionadaId?: string;
  onMudarVersao?: (id: string) => void;
  onIrParaPagina?: (destino: DestinoPagina) => void;
}

export default function AnaliseEdital({
  edital,
  editalArquivo,
  resumoIA,
  versoes,
  versaoSelecionadaId,
  onMudarVersao,
  onIrParaPagina,
}: Props) {
  return (
    <div className="flex w-full flex-col gap-4 h-full min-h-0">
      <Linha01 edital={edital} />

      <div className="flex flex-col gap-4 flex-1 min-h-0">
        <Linha02 edital={edital} editalArquivo={editalArquivo} />
        <Linha03
          edital={editalArquivo}
          editalInfo={edital}
          resumoIA={resumoIA}
          versoes={versoes}
          versaoSelecionadaId={versaoSelecionadaId}
          onMudarVersao={onMudarVersao}
          onIrParaPagina={onIrParaPagina}
        />
      </div>
    </div>
  );
}
