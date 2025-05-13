import CardEditais from "./CardEditais";
import CategoriaColor from "./CategoriaColor";

export interface Categoria {
  nome: string;
  color: string;
}

interface CategoriaColorProps{
    categoria: Categoria[];
}

export default function CardList ({categoria} : CategoriaColorProps) {
    return(
        <div className="flex flex-col  w-56 gap-5">
            <div className="flex flex-row justify-between">
                {categoria.map((item) => (
                    <CategoriaColor key={item.nome} categoria={[{nome:item.nome, color:item.color}]}/>
                ))}
                <p>7</p>
            </div>
            <div className="">
                <CardEditais/>
            </div>
            
        </div>
    );
}