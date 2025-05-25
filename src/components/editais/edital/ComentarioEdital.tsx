import { User } from "lucide-react";
import Linha01 from "./analiselinhas/Linha01";

export interface Comentario {
    id: string;
    nome: string;
    data: string;
    comentario: string;
}

export default function ComentarioEdital () {

    const comentarios: Comentario[] = [
        { id: "1", nome:"Eduardo Manuel", data:"07/03/2025 - 09h32", comentario: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab unde similique dolore labore esse eveniet beatae laudantium, illum itaque voluptates totam sint quidem ullam laboriosam libero neque, temporibus illo a." },
        { id: "2", nome:"Gustavo Pereira", data:"08/03/2025 - 10h53", comentario: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab unde similique dolore labore esse eveniet beatae laudantium, illum itaque voluptates totam sint quidem ullam laboriosam libero neque, temporibus illo a." }
    ]

    return(
        <div className="flex flex-col gap-10">
            <Linha01/>
            <div className="flex flex-col gap-6">
                <div className="border-2 border-gray-300 rounded-md p-2">
                    <h2 className="text-lg font-bold">Comentários</h2>
                </div>
                <div className="flex flex-col gap-10">
                    {comentarios.map((item) => (
                        <div key={item.id} className="flex flex-row gap-5">
                            <div>
                                <div className="flex rounded-xl w-14 h-14 bg-gray-300 justify-center items-center"><User/></div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div>
                                    <h2 className="text-lg font-bold">{item.nome}</h2>
                                    <p className="text-sm font-semibold text-gray-400">{item.data}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-400">{item.comentario}</p>
                                </div>
                            </div>                 
                        </div>
                    ))}    
                </div>
            </div>
        </div>
    )
}