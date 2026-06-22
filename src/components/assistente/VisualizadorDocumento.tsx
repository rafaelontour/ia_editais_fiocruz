"use client";

interface Props {
  fileDataUrl: string;
  fileName: string;
}

export default function VisualizadorDocumento({
  fileDataUrl,
  fileName,
}: Props) {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 bg-zinc-200">
        <iframe src={fileDataUrl} className="w-full h-full" title={fileName} />
      </div>
    </div>
  );
}
