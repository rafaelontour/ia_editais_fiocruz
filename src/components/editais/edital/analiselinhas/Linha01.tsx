import { Button } from "@/components/ui/button";
import { Edital } from "@/core";
import { IconNotes } from "@tabler/icons-react";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface Props {
  edital: Edital | undefined;
}

export default function Linha01({ edital }: Props) {
  return (
    <></>
    // <div className="flex w-full flex-row justify-between">
    //   {/* <p className="text-sm font-semibold text-gray-400">versão 1.0.1</p> */}

    //   <div className="flex flex-row gap-2 items-center">
    //     {/* <div className=" flex gap-4 p-2 rounded-md">

    //       <Link href={`/adm/editais/${edital?.id}/comentarios`}>
    //         <Button
    //           variant={"destructive"}
    //           className="text-md px-3 py-2 hover:cursor-pointer bg-red-500 text-white"
    //           size="sm"
    //           style={{ boxShadow: "2px 2px 3px rgba(0, 0, 0, .25)" }}
    //         >
    //           <span className="flex gap-[6px] items-center">
    //             <p>Comentários</p>
    //             <IconNotes className="w-4 h-4" />
    //           </span>
    //         </Button>
    //       </Link>
    //     </div> */}
    //   </div>
    // </div>
  );
}
